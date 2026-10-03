from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from api.permissions import is_admin
from .models import Inquiry, InquiryMessage
from .serializers import InquirySerializer, InquiryStatusSerializer, InquiryMessageSerializer


class InquiryPermission(permissions.BasePermission):
    """Guests may *send* an inquiry. Everything else requires a signed-in user and the
    queryset (see `InquiryViewSet.get_queryset`) already limits what they can touch."""

    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if is_admin(user):
            return True
        # For replies, both the listing agent and the customer may post:
        if view.action == 'reply':
            is_agent = (obj.agent_id == user.id)
            is_customer = (
                (obj.customer_id == user.id) or
                bool(obj.email and user.email and obj.email.strip().lower() == user.email.strip().lower())
            )
            return is_agent or is_customer

        # Only the receiving agent or an admin may change/delete (e.g. mark as read).
        return obj.agent_id == user.id


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all().order_by('-created_date')
    serializer_class = InquirySerializer
    permission_classes = [InquiryPermission]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_throttles(self):
        if self.action == 'create':
            # Stricter per-client limit for the public contact form.
            self.throttle_scope = 'inquiry'
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return InquiryStatusSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()

        # Admin: everything. Others: inquiries they received or sent (matched by e-mail or customer).
        if not is_admin(user):
            if user.email:
                user_email_clean = user.email.strip().lower()
                # 1. Auto-claim any unlinked inquiries matching exact email
                Inquiry.objects.filter(customer__isnull=True, email__iexact=user_email_clean).update(customer=user)

                # 2. Auto-claim common email typos (e.g. gmail.coom, gmail.ccom, gmail.cm)
                if '@' in user_email_clean:
                    username_part, domain_part = user_email_clean.split('@', 1)
                    if domain_part == 'gmail.com':
                        typo_inquiries = Inquiry.objects.filter(
                            customer__isnull=True,
                            email__iregex=rf'^{username_part}@gmail\.(coom|ccom|cm)$'
                        )
                        typo_inquiries.update(customer=user, email=user_email_clean)

            queryset = queryset.filter(Q(agent=user) | Q(customer=user) | Q(email__iexact=user.email))

        agent_id = self.request.query_params.get('agent_id', None)
        if agent_id:
            queryset = queryset.filter(agent_id=agent_id)
        return queryset

    def perform_create(self, serializer):
        prop = serializer.validated_data.get('property')
        customer = self.request.user if (self.request.user and self.request.user.is_authenticated) else None

        # If guest inquiry, try linking to registered account if email matches
        if not customer:
            email = serializer.validated_data.get('email', '').strip().lower()
            if email:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                matched_user = User.objects.filter(email__iexact=email).first()
                if matched_user:
                    customer = matched_user

        serializer.save(
            agent=prop.agent if prop else None,
            customer=customer
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, pk=None):
        inquiry = self.get_object()
        user = request.user

        # Access check: Must be receiving agent, inquiring customer, or admin
        is_user_agent = (inquiry.agent_id == user.id)
        is_user_customer = (
            (inquiry.customer_id == user.id) or
            bool(inquiry.email and user.email and inquiry.email.strip().lower() == user.email.strip().lower())
        )
        if not (is_admin(user) or is_user_agent or is_user_customer):
            raise PermissionDenied("You do not have permission to message in this conversation.")

        # If customer is replying and wasn't linked yet, link customer FK
        if is_user_customer and not inquiry.customer_id:
            inquiry.customer = user

        message_text = request.data.get('message', '').strip()
        if not message_text:
            return Response({'error': 'Message cannot be empty.'}, status=400)

        # Determine sender role
        if is_user_agent:
            role = 'agent'
            inquiry.status = 'replied'
        elif is_user_customer:
            role = 'customer'
            inquiry.status = 'read'
        else:
            role = 'admin'

        sender_display = user.get_full_name().strip() if hasattr(user, 'get_full_name') and user.get_full_name().strip() else user.email

        InquiryMessage.objects.create(
            inquiry=inquiry,
            sender=user,
            sender_name=sender_display,
            sender_email=user.email,
            sender_role=role,
            message=message_text
        )

        inquiry.save(update_fields=['status', 'updated_date'])

        serializer = InquirySerializer(inquiry, context={'request': request})
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def messages(self, request, pk=None):
        inquiry = self.get_object()
        serializer = InquiryMessageSerializer(inquiry.messages.all(), many=True)
        return Response(serializer.data)

