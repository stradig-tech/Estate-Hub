from decimal import Decimal, InvalidOperation

from django.db.models import F, Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from api.pagination import StandardPagination
from api.permissions import IsAgentOrAdminOrReadOnly, is_admin, is_agent
from .models import Property, NearbyPlace
from .serializers import PropertySerializer, NearbyPlaceSerializer

ORDERING_FIELDS = {'created_date', 'price', 'views', 'bedrooms', 'bathrooms', 'size'}


def _number(raw):
    """Parse a numeric query param; return None when missing/invalid."""
    if raw in (None, ''):
        return None
    try:
        return Decimal(str(raw))
    except (InvalidOperation, ValueError):
        return None


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_date')
    serializer_class = PropertySerializer
    permission_classes = [IsAgentOrAdminOrReadOnly]
    pagination_class = StandardPagination
    owner_field = 'agent'
    throttle_scope = None  # overridden per-action (see `record_view`)

    # --- visibility -------------------------------------------------------------------
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        # Public sees active listings only; an agent additionally sees their own
        # (pending/rejected/...); an admin sees everything.
        if is_admin(user):
            pass
        elif is_agent(user):
            queryset = queryset.filter(Q(status='active') | Q(agent=user))
        else:
            queryset = queryset.filter(status='active')

        return self._apply_filters(queryset)

    def _apply_filters(self, queryset):
        params = self.request.query_params

        for field in ('status', 'listing_type', 'property_type'):
            value = params.get(field)
            if value:
                queryset = queryset.filter(**{field: value})

        if params.get('agent_id'):
            queryset = queryset.filter(agent_id=params['agent_id'])
        if params.get('city'):
            queryset = queryset.filter(city__iexact=params['city'])
        if params.get('featured') in ('1', 'true', 'True'):
            queryset = queryset.filter(featured=True)

        if params.get('location'):
            loc = params['location']
            queryset = queryset.filter(
                Q(city__icontains=loc) | Q(state__icontains=loc) | Q(zip_code__icontains=loc))
        if params.get('q'):
            kw = params['q']
            queryset = queryset.filter(
                Q(title__icontains=kw) | Q(description__icontains=kw) | Q(address__icontains=kw)
                | Q(city__icontains=kw) | Q(state__icontains=kw))

        ranges = (
            ('min_price', 'price__gte'), ('max_price', 'price__lte'),
            ('min_beds', 'bedrooms__gte'), ('min_baths', 'bathrooms__gte'),
            ('min_size', 'size__gte'),
        )
        for param, lookup in ranges:
            number = _number(params.get(param))
            if number is not None:
                queryset = queryset.filter(**{lookup: number})

        ordering = params.get('ordering', '')
        if ordering.lstrip('-') in ORDERING_FIELDS:
            queryset = queryset.order_by(ordering, '-created_date')
        return queryset

    # --- writes -----------------------------------------------------------------------
    def perform_create(self, serializer):
        user = self.request.user
        name = f"{user.first_name} {user.last_name}".strip() or user.username
        # Agents can never publish directly: new listings always wait for admin approval.
        # (Admins may create an already-active listing.)
        status = serializer.validated_data.get('status', 'pending') if is_admin(user) else 'pending'
        serializer.save(agent=user, agent_name=name, status=status)

    def perform_update(self, serializer):
        extra = {}
        # Editing a rejected listing resubmits it for review.
        if (not is_admin(self.request.user)
                and serializer.instance.status == 'rejected'):
            extra['status'] = 'pending'
        serializer.save(**extra)

    # --- server-side view counter -----------------------------------------------------
    @action(detail=True, methods=['post'], url_path='view',
            permission_classes=[permissions.AllowAny],
            throttle_classes=[ScopedRateThrottle], throttle_scope='view')
    def record_view(self, request, pk=None):
        prop = self.get_object()
        if request.user.is_authenticated and prop.agent_id == request.user.id:
            return Response({'views': prop.views})  # owners don't inflate their own count
        Property.objects.filter(pk=prop.pk).update(views=F('views') + 1)
        prop.refresh_from_db(fields=['views'])
        return Response({'views': prop.views})


class NearbyPlaceViewSet(viewsets.ModelViewSet):
    queryset = NearbyPlace.objects.all()
    serializer_class = NearbyPlaceSerializer
    permission_classes = [IsAgentOrAdminOrReadOnly]
    owner_field = 'property.agent'

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if not is_admin(user):
            visible = Q(property__status='active')
            if user.is_authenticated:
                visible |= Q(property__agent=user)
            queryset = queryset.filter(visible)
        property_id = self.request.query_params.get('property_id', None)
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        return queryset

    def perform_create(self, serializer):
        prop = serializer.validated_data.get('property')
        user = self.request.user
        if not is_admin(user):
            if prop is None:
                raise ValidationError({'property': 'This field is required.'})
            if prop.agent_id != user.id:
                raise PermissionDenied('You can only add places to your own listings.')
        serializer.save()
