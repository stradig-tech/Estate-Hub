from rest_framework import serializers
from .models import MenuCategory, MenuItem, SiteSetting, PageContent, BlogPost

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'description', 'url', 'order']

class MenuCategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'title', 'order', 'is_mega_menu', 'url', 'items']

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            'hero_image', 'logo', 'favicon', 'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'youtube_url',
            'show_developer_stradigtech', 'show_developer_mansib', 'ceo_name', 'ceo_role', 'ceo_signature',
            'contact_address', 'contact_phone', 'contact_email', 'contact_opentime'
        ]

class PageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageContent
        fields = ['slug', 'title', 'description', 'updated_at']

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'author', 'category', 'image', 'excerpt', 'content', 'published_date']
