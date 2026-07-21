from rest_framework import serializers
from .models import Property, NearbyPlace

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('id', 'created_date')

class NearbyPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyPlace
        fields = '__all__'
        read_only_fields = ('id', 'created_date')
