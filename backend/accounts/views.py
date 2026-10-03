from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle, SimpleRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from api.permissions import IsAdminRole, is_admin
from .models import Favorite, Review
from .serializers import (
    AdminUserSerializer, FavoriteSerializer, PublicAgentSerializer,
    RegisterSerializer, ReviewSerializer, UserSerializer, display_name,
)

User = get_user_model()


class ThrottledTokenObtainPairView(TokenObtainPairView):
    """Login with brute-force protection (rate: THROTTLE_LOGIN)."""
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'


class _RegisterThrottle(SimpleRateThrottle):
    """Limit sign-ups per client IP (rate: THROTTLE_REGISTER)."""
    scope = 'register'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([_RegisterThrottle])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        errors = serializer.errors
        first_val = next(iter(errors.values()))
        if isinstance(first_val, list) and first_val:
            message = first_val[0]
        elif isinstance(first_val, dict):
            sub_val = next(iter(first_val.values()))
            message = sub_val[0] if isinstance(sub_val, list) and sub_val else str(first_val)
        else:
            message = str(first_val or 'Invalid registration data')
        return Response({
            'error': str(message),
            'detail': str(message),
            'fields': errors
        }, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)

    data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
    # Convenience: accept `full_name` and split it into first/last name.
    full_name = data.pop('full_name', None)
    if isinstance(full_name, (list, tuple)):
        full_name = full_name[0] if full_name else None
    if full_name is not None:
        first, _, last = str(full_name).strip().partition(' ')
        data['first_name'], data['last_name'] = first, last.strip()

    serializer = UserSerializer(request.user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """Admin user management. Regular users must use `/auth/me/`; the public sees `/agents/`."""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminRole]
    http_method_names = ['get', 'patch', 'head', 'options']


class AgentViewSet(viewsets.ReadOnlyModelViewSet):
    """Public, privacy-safe agent directory (no e-mail / phone / license). Only approved agents."""
    queryset = User.objects.filter(role='agent', agent_status='approved', is_active=True).order_by('-is_featured_agent', 'first_name', 'id')
    serializer_class = PublicAgentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        featured = self.request.query_params.get('featured')
        if featured is not None:
            if featured.lower() in ('1', 'true', 'yes'):
                qs = qs.filter(is_featured_agent=True)
            elif featured.lower() in ('0', 'false', 'no'):
                qs = qs.filter(is_featured_agent=False)
        return qs


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all().order_by('-created_date')
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset().filter(user=self.request.user)
        property_id = self.request.query_params.get('property_id', None)
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        return queryset

    def perform_create(self, serializer):
        prop = serializer.validated_data['property']
        if Favorite.objects.filter(user=self.request.user, property=prop).exists():
            raise ValidationError({'property_id': 'This property is already in your favorites.'})
        serializer.save(user=self.request.user)


class ReviewPermission(permissions.BasePermission):
    """Anyone reads; signed-in users write; only the author (or an admin) edits/deletes."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return is_admin(request.user) or (
            bool(obj.author_email) and obj.author_email.lower() == (request.user.email or '').lower()
        )


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_date')
    serializer_class = ReviewSerializer
    permission_classes = [ReviewPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        agent_id = self.request.query_params.get('agent_id', None)
        if agent_id:
            queryset = queryset.filter(agent_id=agent_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        # Author identity always comes from the session, never from the request body.
        serializer.save(author_name=display_name(user), author_email=user.email)
