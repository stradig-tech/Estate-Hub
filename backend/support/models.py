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
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='customer_inquiries', blank=True, null=True)
    
    STATUS_CHOICES = (
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Inquiries'
        ordering = ['-updated_date', '-created_date']

    def __str__(self):
        return f"Inquiry by {self.name}"


class InquiryMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inquiry = models.ForeignKey(Inquiry, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='inquiry_messages')
    sender_name = models.CharField(max_length=255, blank=True, null=True)
    sender_email = models.EmailField(blank=True, null=True)
    sender_role = models.CharField(max_length=20, default='agent')  # 'agent', 'customer', 'admin'
    message = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return f"Message by {self.sender_name or self.sender} on {self.inquiry_id}"

