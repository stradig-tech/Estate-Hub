import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class CustomUserManager(UserManager):
    """Custom user manager ensuring superuser created from terminal (createsuperuser) has role='admin'."""
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return super().create_superuser(username, email, password, **extra_fields)


class Agency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, default="Estate Hub")
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='agencies/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Agency"
        verbose_name_plural = "Agencies"
        ordering = ['name']

    def __str__(self):
        return self.name


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
    agency = models.ForeignKey('Agency', on_delete=models.SET_NULL, null=True, blank=True, related_name='agents')
    agency_name = models.CharField(max_length=255, blank=True, null=True)
    agent_title = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        default='Administrative Staff',
        help_text="Designation/Role title (e.g. Administrative Staff, Senior Real Estate Agent)"
    )
    is_featured_agent = models.BooleanField(
        default=False,
        help_text="Feature this agent in the 'Meet Our Agents' section on homepage"
    )
    avatar_url = models.CharField(max_length=1000, blank=True, null=True)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    subscription_plan = models.CharField(max_length=100, default='Free')
    
    SUB_STATUS_CHOICES = (
        ('free', 'Free'),
        ('active', 'Active'),
        ('canceled', 'Canceled'),
    )
    subscription_status = models.CharField(max_length=20, choices=SUB_STATUS_CHOICES, default='free')

    AGENT_STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    agent_status = models.CharField(
        max_length=20,
        choices=AGENT_STATUS_CHOICES,
        default='approved',
        help_text="Approval status for agents. Unapproved agents cannot list properties."
    )

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        # Keep the app role in sync with Django's superuser flag (e.g. `createsuperuser`).
        if self.is_superuser and self.role != 'admin':
            self.role = 'admin'
        if self.role == 'admin':
            self.agent_status = 'approved'
        if self.agency and not self.agency_name:
            self.agency_name = self.agency.name
        elif self.agency_name and not self.agency:
            agency_obj, _ = Agency.objects.get_or_create(name=self.agency_name.strip())
            self.agency = agency_obj
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class AgentManager(CustomUserManager):
    def get_queryset(self):
        return super().get_queryset().filter(role='agent')


class Agent(User):
    objects = AgentManager()

    class Meta:
        proxy = True
        verbose_name = "Agent"
        verbose_name_plural = "Agents"


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
