from django.db import models
from django.core.exceptions import ValidationError

class SiteSetting(models.Model):
    hero_title = models.CharField(
        max_length=255, 
        default="Find Your Perfect Home", 
        blank=True, 
        help_text="Main heading in the homepage hero section"
    )
    hero_description = models.TextField(
        default="Search thousands of homes for sale and rent. Connect with trusted agents.", 
        blank=True, 
        help_text="Subtitle or description below the hero title"
    )
    hero_image = models.ImageField(
        upload_to='site/', 
        blank=True, 
        null=True,
        help_text="Single fallback hero image (used if no slides are active)"
    )
    hero_slider_autoplay = models.BooleanField(
        default=True, 
        help_text="Enable automatic sliding of background images"
    )
    hero_slider_interval = models.PositiveIntegerField(
        default=5000, 
        help_text="Slide transition delay in milliseconds (e.g. 5000 = 5 seconds)"
    )
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    og_image = models.ImageField(
        upload_to='site/', 
        blank=True, 
        null=True, 
        help_text="Open Graph (OG) image for social media link sharing (Recommended 1200x630px)"
    )
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
        # Auto-trim excessive transparent margins on logo so it renders prominently in navbar
        if self.logo:
            try:
                from PIL import Image
                from io import BytesIO
                from django.core.files.base import ContentFile
                import os
                self.logo.open()
                img = Image.open(self.logo)
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    bbox = img.convert('RGBA').getbbox()
                    if bbox:
                        w, h = img.size
                        bw = bbox[2] - bbox[0]
                        bh = bbox[3] - bbox[1]
                        if (bw * bh) < (w * h * 0.85):
                            pad = 4
                            crop_box = (
                                max(0, bbox[0] - pad),
                                max(0, bbox[1] - pad),
                                min(w, bbox[2] + pad),
                                min(h, bbox[3] + pad)
                            )
                            cropped = img.crop(crop_box)
                            buf = BytesIO()
                            cropped.save(buf, format='PNG')
                            filename = os.path.basename(self.logo.name)
                            self.logo.save(filename, ContentFile(buf.getvalue()), save=False)
            except Exception:
                pass
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


class HeroSlide(models.Model):
    site_setting = models.ForeignKey(
        SiteSetting, 
        on_delete=models.CASCADE, 
        related_name='hero_slides', 
        null=True, 
        blank=True,
        help_text="Associated site settings"
    )
    image = models.ImageField(
        upload_to='hero_slides/', 
        blank=True, 
        null=True, 
        help_text="Upload background image for slider"
    )
    image_url = models.CharField(
        max_length=1000, 
        blank=True, 
        null=True, 
        help_text="Or external image URL (e.g. Unsplash URL)"
    )
    title = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Optional custom title for this slide (defaults to main hero title if blank)"
    )
    description = models.TextField(
        blank=True, 
        null=True, 
        help_text="Optional custom description for this slide (defaults to main hero description if blank)"
    )
    order = models.PositiveIntegerField(
        default=0, 
        help_text="Display order (lower numbers appear first)"
    )
    is_active = models.BooleanField(
        default=True, 
        help_text="Check to show this slide on homepage"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Hero Slide"
        verbose_name_plural = "Hero Slides (Background Slider)"

    def __str__(self):
        return self.title or f"Hero Slide #{self.order or self.pk or ''}"

    @property
    def final_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url or ''

