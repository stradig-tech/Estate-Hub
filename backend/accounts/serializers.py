from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from properties.models import Property
from .models import Favorite, Review

User = get_user_model()

# Roles a person may pick for themselves at sign-up. 'admin' is never self-assignable.
SELF_SERVICE_ROLES = ('buyer', 'agent')


def display_name(user):
    """Human-friendly name: first/last name, else the local part of the e-mail."""
    full = f"{user.first_name} {user.last_name}".strip()
    return full or (user.email or user.username or '').split('@')[0]


class UserSerializer(serializers.ModelSerializer):
    """Private profile of the *current* user (`/auth/me/`) and admin user views.

    Only profile fields are writable. `role`, subscription state and identity fields are
    read-only so users cannot promote themselves or fake a paid plan.
    """
    full_name = serializers.SerializerMethodField()
    created_date = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'role',
                  'agent_status', 'phone', 'bio', 'agency_name', 'avatar_url', 'license_number',
                  'subscription_plan', 'subscription_status', 'created_date')
        read_only_fields = ('id', 'username', 'email', 'role', 'agent_status',
                            'subscription_plan', 'subscription_status')

    def get_full_name(self, obj):
        return display_name(obj)


class AdminUserSerializer(UserSerializer):
    """Admins may additionally change a user's role, agent approval status, and activation state."""

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('is_active',)
        read_only_fields = ('id', 'username', 'email',
                            'subscription_plan', 'subscription_status')


class PublicAgentSerializer(serializers.ModelSerializer):
    """What anonymous visitors may see about an agent: no e-mail, phone or license."""
    full_name = serializers.SerializerMethodField()
    agent_title = serializers.SerializerMethodField()
    public_email = serializers.SerializerMethodField()
    public_phone = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'full_name', 'bio', 'agency_name', 'avatar_url', 'agent_title', 'is_featured_agent', 'public_email', 'public_phone')
        read_only_fields = fields

    def get_full_name(self, obj):
        return display_name(obj)

    def get_agent_title(self, obj):
        return getattr(obj, 'agent_title', None) or obj.bio or 'Administrative Staff'

    def get_public_email(self, obj):
        return obj.email or ''

    def get_public_phone(self, obj):
        return obj.phone or ''


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    role = serializers.ChoiceField(choices=SELF_SERVICE_ROLES, required=False, default='buyer')
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    agency_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    license_number = serializers.CharField(required=False, allow_blank=True, max_length=100)
    bio = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists() or \
                User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('User with this email already exists')
        return value

    def validate(self, attrs):
        try:
            validate_password(attrs['password'], user=User(username=attrs['email'], email=attrs['email']))
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)})
        return attrs

    def create(self, validated_data):
        first, _, last = validated_data.get('full_name', '').strip().partition(' ')
        role = validated_data.get('role', 'buyer')
        # Agents require admin approval before listing properties. Buyers are approved immediately.
        agent_status = 'pending' if role == 'agent' else 'approved'
        return User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            agent_status=agent_status,
            first_name=first[:150],
            last_name=last.strip()[:150],
            phone=validated_data.get('phone', '').strip() or None,
            agency_name=validated_data.get('agency_name', '').strip() or None,
            license_number=validated_data.get('license_number', '').strip() or None,
            bio=validated_data.get('bio', '').strip() or None,
        )


class FavoriteSerializer(serializers.ModelSerializer):
    # Read/write alias used by the frontend; `property` itself is read-only output.
    property_id = serializers.PrimaryKeyRelatedField(
        source='property', queryset=Property.objects.filter(status='active'))

    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ('id', 'created_date', 'user', 'property',
                            'property_title', 'property_price', 'property_image', 'property_city',
                            'property_state', 'property_beds', 'property_baths', 'property_size',
                            'property_type', 'listing_type')


class ReviewSerializer(serializers.ModelSerializer):
    agent_id = serializers.PrimaryKeyRelatedField(
        source='agent', queryset=User.objects.filter(role='agent'))

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('id', 'created_date', 'agent', 'author_name', 'author_email')

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        agent = attrs.get('agent')
        if self.instance is None and request and request.user.is_authenticated and agent:
            if agent == request.user:
                raise serializers.ValidationError('You cannot review yourself.')
            if Review.objects.filter(agent=agent, author_email__iexact=request.user.email).exists():
                raise serializers.ValidationError('You have already reviewed this agent.')
        if self.instance is not None:
            # The reviewed agent can never change after creation.
            attrs.pop('agent', None)
        return attrs
