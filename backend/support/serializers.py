from rest_framework import serializers

from properties.models import Property
from .models import Inquiry, InquiryMessage


class InquiryMessageSerializer(serializers.ModelSerializer):
    sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = InquiryMessage
        fields = ('id', 'inquiry', 'sender', 'sender_name', 'sender_email', 'sender_role', 'sender_avatar', 'message', 'created_date')
        read_only_fields = ('id', 'created_date')

    def get_sender_avatar(self, obj):
        return getattr(obj.sender, 'avatar_url', None) if obj.sender else None


class InquirySerializer(serializers.ModelSerializer):
    # Frontend alias for `property`; the receiving agent is derived from the property.
    property_id = serializers.PrimaryKeyRelatedField(
        source='property', queryset=Property.objects.filter(status='active'),
        required=False, allow_null=True)
    property_title = serializers.SerializerMethodField()
    property_image = serializers.SerializerMethodField()
    property_price = serializers.SerializerMethodField()
    agent_id = serializers.ReadOnlyField()
    agent_name = serializers.SerializerMethodField()
    agent_email = serializers.SerializerMethodField()
    agent_avatar = serializers.SerializerMethodField()
    customer_avatar = serializers.SerializerMethodField()
    messages = InquiryMessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Inquiry
        fields = '__all__'
        read_only_fields = ('id', 'created_date', 'updated_date', 'property', 'agent', 'customer', 'status')

    def get_property_title(self, obj):
        return obj.property.title if obj.property_id else None

    def get_property_image(self, obj):
        if obj.property_id and obj.property and obj.property.images and len(obj.property.images) > 0:
            return obj.property.images[0]
        return None

    def get_property_price(self, obj):
        return str(obj.property.price) if (obj.property_id and obj.property) else None

    def get_agent_name(self, obj):
        if obj.agent:
            full = obj.agent.get_full_name() if hasattr(obj.agent, 'get_full_name') else ''
            return full.strip() or obj.agent.email
        return obj.property.agent_name if (obj.property_id and obj.property) else None

    def get_agent_email(self, obj):
        return obj.agent.email if obj.agent else None

    def get_agent_avatar(self, obj):
        return getattr(obj.agent, 'avatar_url', None) if obj.agent else None

    def get_customer_avatar(self, obj):
        return getattr(obj.customer, 'avatar_url', None) if obj.customer else None

    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return {
                'message': last.message,
                'sender_name': last.sender_name,
                'sender_role': last.sender_role,
                'created_date': last.created_date
            }
        return {
            'message': obj.message,
            'sender_name': obj.name,
            'sender_role': 'customer',
            'created_date': obj.created_date
        }

    def validate_message(self, value):
        if value and len(value) > 5000:
            raise serializers.ValidationError('Message is too long (max 5000 characters).')
        return value


class InquiryStatusSerializer(serializers.ModelSerializer):
    """Receiving agents/admins may only change the status of an inquiry."""

    class Meta:
        model = Inquiry
        fields = ('status',)

