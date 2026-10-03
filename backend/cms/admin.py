from django.db import models
from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.utils.html import format_html, escape
from django.utils.safestring import mark_safe
from .models import MenuCategory, MenuItem, SiteSetting, PageContent, BlogPost, HeroSlide


class AdminImagePreviewWidget(AdminFileWidget):
    """
    Enhanced AdminFileWidget that renders an 'Image Preview' box to the right
    of the file input with real-time preview upon choosing an image.
    """
    def render(self, name, value, attrs=None, renderer=None):
        file_input_html = super().render(name, value, attrs, renderer)

        image_url = None
        if value and hasattr(value, 'url'):
            image_url = value.url
        elif value and isinstance(value, str) and value.startswith(('http://', 'https://', '/')):
            image_url = value

        input_id = (attrs and attrs.get('id')) or f"id_{name}"
        safe_id = input_id.replace('-', '_')
        preview_id = f"preview_{safe_id}"
        placeholder_id = f"placeholder_{safe_id}"

        has_img = bool(image_url)
        img_src = escape(image_url) if has_img else ""

        img_box_html = f'''
        <div style="display:inline-flex; flex-direction:column; align-items:center; margin-left:18px; margin-top:2px;">
            <span style="font-size:11px; font-weight:700; color:#ef4444; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Image Preview</span>
            <div style="width:140px; height:85px; border-radius:8px; border:2px solid #ef4444; background:#ffffff; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:4px; box-shadow:0 1px 4px rgba(0,0,0,0.08);">
                <img id="{preview_id}" src="{img_src}" data-original-src="{img_src}" alt="Preview" style="max-width:100%; max-height:100%; object-fit:contain; display:{'block' if has_img else 'none'};" />
                <div id="{placeholder_id}" style="color:#94a3b8; font-size:11px; font-style:italic; text-align:center; display:{'none' if has_img else 'block'}; padding:6px;">
                    No image chosen
                </div>
            </div>
        </div>
        '''

        js = f'''
        <script>
        (function() {{
            var input = document.getElementById("{input_id}");
            var clearCb = document.getElementById("{input_id}-clear_id");
            var img = document.getElementById("{preview_id}");
            var placeholder = document.getElementById("{placeholder_id}");

            if (input) {{
                input.addEventListener("change", function(e) {{
                    var file = e.target.files && e.target.files[0];
                    if (file) {{
                        if (img) {{
                            img.src = URL.createObjectURL(file);
                            img.style.display = "block";
                        }}
                        if (placeholder) {{
                            placeholder.style.display = "none";
                        }}
                        if (clearCb) {{
                            clearCb.checked = false;
                        }}
                    }}
                }});
            }}

            if (clearCb) {{
                clearCb.addEventListener("change", function(e) {{
                    if (e.target.checked) {{
                        if (img) img.style.display = "none";
                        if (placeholder) placeholder.style.display = "block";
                    }} else if (img && img.getAttribute("data-original-src")) {{
                        img.src = img.getAttribute("data-original-src");
                        img.style.display = "block";
                        if (placeholder) placeholder.style.display = "none";
                    }}
                }});
            }}
        }})();
        </script>
        '''

        combined_html = f'''
        <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap; margin:6px 0;">
            <div style="flex:1; min-width:280px;">
                {file_input_html}
            </div>
            {img_box_html}
        </div>
        {js}
        '''
        return mark_safe(combined_html)


class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1

class HeroSlideInline(admin.StackedInline):
    model = HeroSlide
    extra = 1
    fields = (('image', 'image_url'), ('title', 'order', 'is_active'), 'description')
    formfield_overrides = {
        models.ImageField: {'widget': AdminImagePreviewWidget},
    }

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_mega_menu', 'url')
    list_editable = ('order', 'is_mega_menu')
    inlines = [MenuItemInline]

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.ImageField: {'widget': AdminImagePreviewWidget},
    }
    fieldsets = (
        ('Hero Section (Homepage)', {
            'fields': (
                'hero_title',
                'hero_description',
                'hero_image',
                ('hero_slider_autoplay', 'hero_slider_interval')
            ),
            'description': 'Configure the main headline, description text, and background slider for the homepage hero section.'
        }),
        ('Branding', {'fields': ('logo', 'favicon', 'og_image')}),
        ('Contact', {'fields': ('contact_address', 'contact_phone', 'contact_email', 'contact_opentime')}),
        ('Social links', {'fields': ('facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'youtube_url')}),
        ('Founder', {'fields': ('ceo_name', 'ceo_role', 'ceo_signature')}),
        ('Footer', {'fields': ('show_developer_stradigtech', 'show_developer_mansib')}),
    )
    inlines = [HeroSlideInline]

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False  # single global row; the API recreates it if missing

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.ImageField: {'widget': AdminImagePreviewWidget},
    }
    list_display = ('preview_thumbnail', 'title_display', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    fields = ('image', 'image_url', 'title', 'description', 'order', 'is_active')

    def preview_thumbnail(self, obj):
        url = obj.final_image_url
        if url:
            return format_html(
                '<img src="{}" style="width:75px; height:45px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1;" />',
                url
            )
        return format_html('<span style="color:#94a3b8; font-style:italic;">No image</span>')
    preview_thumbnail.short_description = "Slide Preview"

    def title_display(self, obj):
        return obj.title or f"Slide #{obj.order}"
    title_display.short_description = "Title"

@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'slug')

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.ImageField: {'widget': AdminImagePreviewWidget},
    }
    list_display = ('title', 'author', 'category', 'published_date')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'author', 'category')
    list_filter = ('category', 'published_date')
