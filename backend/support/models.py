import uuid
from django.db import models
from django.conf import settings

class Inquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='inquiries', blank=True, null=True)
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inquiries', blank=True, null=True)
    
    STATUS_CHOICES = (
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Inquiries'

    def __str__(self):
        return f"Inquiry by {self.name}"
