from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Favorite, Review

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone', 'bio', 'agency_name', 
                  'avatar_url', 'license_number', 'subscription_plan', 'subscription_status')
        read_only_fields = ('id',)

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ('id', 'created_date')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('id', 'created_date')
