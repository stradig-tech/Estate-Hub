from rest_framework import serializers
from .models import MenuCategory, MenuItem, SiteSetting, PageContent, BlogPost, HeroSlide

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'description', 'url', 'order']

class MenuCategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'title', 'order', 'is_mega_menu', 'url', 'items']

class HeroSlideSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = HeroSlide
        fields = ['id', 'image', 'image_url', 'image_display', 'title', 'description', 'order', 'is_active']

    def get_image_display(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url or ''

class SiteSettingSerializer(serializers.ModelSerializer):
    hero_slides = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    favicon = serializers.SerializerMethodField()
    og_image = serializers.SerializerMethodField()

    class Meta:
        model = SiteSetting
        fields = [
            'hero_title', 'hero_description', 'hero_image', 'hero_slider_autoplay', 'hero_slider_interval', 'hero_slides',
            'logo', 'favicon', 'og_image', 'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'youtube_url',
            'show_developer_stradigtech', 'show_developer_mansib', 'ceo_name', 'ceo_role', 'ceo_signature',
            'contact_address', 'contact_phone', 'contact_email', 'contact_opentime'
        ]

    def _get_cache_busted_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get('request')
        url = request.build_absolute_uri(file_field.url) if request else file_field.url
        try:
            import os
            if os.path.exists(file_field.path):
                mtime = int(os.path.getmtime(file_field.path))
                sep = '&' if '?' in url else '?'
                return f"{url}{sep}v={mtime}"
        except Exception:
            pass
        return url

    def get_logo(self, obj):
        return self._get_cache_busted_url(obj.logo)

    def get_favicon(self, obj):
        return self._get_cache_busted_url(obj.favicon)

    def get_og_image(self, obj):
        return self._get_cache_busted_url(obj.og_image)

    def get_hero_slides(self, obj):
        slides = HeroSlide.objects.filter(is_active=True).order_by('order', 'created_at')
        return HeroSlideSerializer(slides, many=True, context=self.context).data

class PageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageContent
        fields = ['slug', 'title', 'description', 'updated_at']

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'author', 'category', 'image', 'excerpt', 'content', 'published_date']
