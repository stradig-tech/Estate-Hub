from django.contrib import admin
from .models import Property, NearbyPlace

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'agent', 'price', 'listing_type', 'property_type', 'status', 'city')
    search_fields = ('title', 'city', 'zip_code')
    list_filter = ('status', 'listing_type', 'property_type')

@admin.register(NearbyPlace)
class NearbyPlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'distance', 'property')
