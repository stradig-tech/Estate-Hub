from django.contrib import admin
from .models import MenuCategory, MenuItem, SiteSetting, PageContent, BlogPost

class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_mega_menu', 'url')
    list_editable = ('order', 'is_mega_menu')
    inlines = [MenuItemInline]

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'slug')

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'published_date')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'author', 'category')
    list_filter = ('category', 'published_date')
