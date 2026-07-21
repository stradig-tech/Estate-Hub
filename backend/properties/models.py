import uuid
from django.db import models
from django.conf import settings

class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    
    LISTING_TYPE_CHOICES = (
        ('for_sale', 'For Sale'),
        ('for_rent', 'For Rent'),
    )
    listing_type = models.CharField(max_length=20, choices=LISTING_TYPE_CHOICES, default='for_sale')
    
    PROP_TYPE_CHOICES = (
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
        ('land', 'Land'),
        ('commercial', 'Commercial'),
    )
    property_type = models.CharField(max_length=20, choices=PROP_TYPE_CHOICES, default='house')
    
    bedrooms = models.IntegerField(default=0)
    bathrooms = models.IntegerField(default=0)
    size = models.IntegerField(default=0)
    lot_size = models.IntegerField(blank=True, null=True)
    
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('rejected', 'Rejected'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    amenities = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True)
    floor_plan_image = models.CharField(max_length=1000, blank=True, null=True)
    video_url = models.CharField(max_length=1000, blank=True, null=True)
    virtual_tour_url = models.CharField(max_length=1000, blank=True, null=True)
    
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties', blank=True, null=True)
    agent_name = models.CharField(max_length=255, blank=True, null=True)
    
    views = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    year_built = models.IntegerField(blank=True, null=True)
    parking = models.IntegerField(default=0)
    rejection_note = models.TextField(blank=True, null=True)
    
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Properties'

    def __str__(self):
        return self.title


class NearbyPlace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    distance = models.CharField(max_length=50)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='nearby_places', blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
