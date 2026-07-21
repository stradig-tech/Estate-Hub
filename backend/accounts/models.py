import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('agent', 'Agent'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    agency_name = models.CharField(max_length=255, blank=True, null=True)
    avatar_url = models.CharField(max_length=1000, blank=True, null=True)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    subscription_plan = models.CharField(max_length=100, default='Free')
    
    SUB_STATUS_CHOICES = (
        ('free', 'Free'),
        ('active', 'Active'),
        ('canceled', 'Canceled'),
    )
    subscription_status = models.CharField(max_length=20, choices=SUB_STATUS_CHOICES, default='free')

    def __str__(self):
        return self.username


class Favorite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites', blank=True, null=True)
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='favorited_by')
    created_date = models.DateTimeField(auto_now_add=True)
    
    property_title = models.CharField(max_length=255, blank=True, null=True)
    property_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    property_image = models.CharField(max_length=1000, blank=True, null=True)
    property_city = models.CharField(max_length=100, blank=True, null=True)
    property_state = models.CharField(max_length=100, blank=True, null=True)
    property_beds = models.IntegerField(default=0)
    property_baths = models.IntegerField(default=0)
    property_size = models.IntegerField(default=0)
    property_type = models.CharField(max_length=50, blank=True, null=True)
    listing_type = models.CharField(max_length=50, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.property:
            self.property_title = self.property.title
            self.property_price = self.property.price
            self.property_image = self.property.images[0] if self.property.images else None
            self.property_city = self.property.city
            self.property_state = self.property.state
            self.property_beds = self.property.bedrooms
            self.property_baths = self.property.bathrooms
            self.property_size = self.property.size
            self.property_type = self.property.property_type
            self.listing_type = self.property.listing_type
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Favorite: {self.property_title}"


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    author_name = models.CharField(max_length=255)
    author_email = models.EmailField()
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews', blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating} star review for {self.agent}"
