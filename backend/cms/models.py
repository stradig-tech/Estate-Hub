from django.db import models
from django.core.exceptions import ValidationError

class SiteSetting(models.Model):
    hero_image = models.ImageField(upload_to='site/', blank=True, null=True)
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    
    show_developer_stradigtech = models.BooleanField(default=True, help_text="Show Stradigtech in footer")
    show_developer_mansib = models.BooleanField(default=True, help_text="Show Mansib in footer")
    
    ceo_name = models.CharField(max_length=100, default="Luke Alexander", help_text="Name of the CEO/Founder")
    ceo_role = models.CharField(max_length=100, default="CEO/Founder", help_text="Role title (e.g., CEO/Founder)")
    ceo_signature = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Signature image")
    
    contact_address = models.TextField(blank=True, null=True, help_text="Contact Address")
    contact_phone = models.CharField(max_length=50, blank=True, null=True, help_text="Contact Phone Number")
    contact_email = models.EmailField(blank=True, null=True, help_text="Contact Email Address")
    contact_opentime = models.TextField(blank=True, null=True, help_text="Office Open Hours")

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        if not self.pk and SiteSetting.objects.exists():
            raise ValidationError('There can be only one SiteSetting instance')
        return super(SiteSetting, self).save(*args, **kwargs)

    def __str__(self):
        return "Global Site Settings"

class MenuCategory(models.Model):
    title = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    is_mega_menu = models.BooleanField(default=False)
    url = models.CharField(max_length=200, blank=True, null=True, help_text="Used if not a mega menu")

    class Meta:
        verbose_name_plural = "Menu Categories"
        ordering = ['order']

    def __str__(self):
        return self.title

class MenuItem(models.Model):
    category = models.ForeignKey(MenuCategory, related_name='items', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=200)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.category.title} - {self.title}"

class PageContent(models.Model):
    slug = models.SlugField(unique=True, help_text="Unique identifier for the page (e.g., 'about-us')")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, help_text="Content or summary for the page")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Page Content"
        verbose_name_plural = "Page Contents"
        
    def __str__(self):
        return self.title

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    author = models.CharField(max_length=100, default="Admin")
    category = models.CharField(max_length=100, default="Real Estate")
    image = models.ImageField(upload_to='blog/', blank=True, null=True)
    excerpt = models.TextField(help_text="Short description for the blog list")
    content = models.TextField(help_text="Full blog post content")
    published_date = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title
