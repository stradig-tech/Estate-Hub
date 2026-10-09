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

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        base_url = request.build_absolute_uri('/')[:-1] if request else 'https://admin.estatehub.stradigtech.com'

        def fix_url(url):
            if not url or not isinstance(url, str):
                return url
            import re
            if re.search(r'https?://(localhost|127\.0\.0\.1)(:\d+)?', url):
                url = re.sub(r'https?://(localhost|127\.0\.0\.1)(:\d+)?', base_url, url)
            elif url.startswith('/media/'):
                url = f"{base_url}{url}"
            return url

        if isinstance(ret.get('images'), list):
            ret['images'] = [fix_url(u) for u in ret['images']]
        if ret.get('floor_plan_image'):
            ret['floor_plan_image'] = fix_url(ret['floor_plan_image'])
        if isinstance(ret.get('floor_plan_images'), list):
            ret['floor_plan_images'] = [fix_url(u) for u in ret['floor_plan_images']]
        return ret


class NearbyPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyPlace
        fields = '__all__'
        read_only_fields = ('id', 'created_date')
