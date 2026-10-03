from rest_framework import serializers

from api.permissions import is_admin
from .models import Property, NearbyPlace

# Fields only an admin may change directly. Agents move listings through the workflow
# (always created as `pending`), the view counter is only touched by the `view` action.
ADMIN_ONLY_FIELDS = ('status', 'rejection_note', 'featured')


class PropertySerializer(serializers.ModelSerializer):
    agent_id = serializers.ReadOnlyField()

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('id', 'created_date', 'agent', 'agent_name', 'views')

    def validate(self, attrs):
        request = self.context.get('request')
        if not is_admin(getattr(request, 'user', None)):
            for field in ADMIN_ONLY_FIELDS:
                attrs.pop(field, None)
        return attrs

    def validate_price(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value


class NearbyPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyPlace
        fields = '__all__'
        read_only_fields = ('id', 'created_date')
