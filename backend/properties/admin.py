import json
import os
import uuid

from django.conf import settings
from django.contrib import admin, messages
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404, redirect
from django.urls import path
from django.utils.html import format_html

from .forms import PropertyAdminForm
from .models import Property, NearbyPlace


class NearbyPlaceInline(admin.TabularInline):
    model = NearbyPlace
    extra = 0
    fields = ('name', 'type', 'distance')


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    form = PropertyAdminForm
    list_display = ('thumbnail', 'title', 'agent', 'price', 'listing_type', 'property_type',
                    'status_badge', 'quick_moderation', 'featured', 'city', 'views', 'created_date')
    list_display_links = ('thumbnail', 'title')
    list_filter = ('status', 'listing_type', 'property_type', 'featured', 'city')
    search_fields = ('title', 'description', 'city', 'state', 'zip_code', 'address',
                     'agent__email', 'agent__first_name', 'agent__last_name')
    list_select_related = ('agent',)
    raw_id_fields = ('agent',)
    date_hierarchy = 'created_date'
    ordering = ('-created_date',)
    readonly_fields = ('views', 'created_date')
    inlines = [NearbyPlaceInline]
    actions = ['approve', 'reject', 'mark_featured', 'unmark_featured']
    list_per_page = 25

    fieldsets = (
        ('Moderation', {'fields': ('status', 'rejection_note', 'featured')}),
        ('Basics', {'fields': ('title', 'description', 'listing_type', 'property_type', 'price')}),
        ('Specs', {'fields': (('bedrooms', 'bathrooms', 'parking'), ('size', 'lot_size', 'year_built'))}),
        ('Location', {'fields': ('address', ('city', 'state', 'zip_code'), ('latitude', 'longitude'))}),
        ('Media', {'fields': ('cover_photo', 'images', 'floor_plan_images', 'video_url', 'virtual_tour_url')}),
        ('Features', {'fields': ('amenities',)}),
        ('Ownership & stats', {'fields': ('agent', 'agent_name', 'views', 'created_date')}),
    )

    def save_model(self, request, obj, form, change):
        # 1. Base images from form (preserves existing URLs in updated order without removed ones)
        form_images = form.cleaned_data.get('images')
        if isinstance(form_images, list) and len(form_images) > 0:
            obj.images = list(form_images)
        elif isinstance(form_images, str) and form_images:
            try:
                obj.images = json.loads(form_images)
            except Exception:
                pass
        elif form_images == []:
            # Explicitly cleared
            obj.images = []

        # 2. Uploaded Cover Photo (Thumbnail)
        cover_file = request.FILES.get('cover_photo')
        if cover_file:
            ext = os.path.splitext(cover_file.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
                ext = '.jpg'
            filename = f"properties/cover_{uuid.uuid4().hex[:12]}{ext}"
            saved_path = default_storage.save(filename, ContentFile(cover_file.read()))
            media_url = f"{settings.MEDIA_URL.rstrip('/')}/{saved_path.lstrip('/')}"
            cover_url = request.build_absolute_uri(media_url)
            # Put as primary photo (index 0)
            if not obj.images:
                obj.images = []
            obj.images = [cover_url] + [img for img in obj.images if img != cover_url]

        # 3. Multiple Gallery Photos Uploaded
        gallery_files = request.FILES.getlist('gallery_upload_files')
        if gallery_files:
            new_gallery_urls = []
            for gfile in gallery_files:
                ext = os.path.splitext(gfile.name)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
                    ext = '.jpg'
                filename = f"properties/gallery_{uuid.uuid4().hex[:12]}{ext}"
                saved_path = default_storage.save(filename, ContentFile(gfile.read()))
                media_url = f"{settings.MEDIA_URL.rstrip('/')}/{saved_path.lstrip('/')}"
                new_gallery_urls.append(request.build_absolute_uri(media_url))
            if not obj.images:
                obj.images = []
            obj.images.extend(new_gallery_urls)

        # 4. Base floor plans from form
        form_fps = form.cleaned_data.get('floor_plan_images')
        if isinstance(form_fps, list) and len(form_fps) > 0:
            obj.floor_plan_images = list(form_fps)
        elif isinstance(form_fps, str) and form_fps:
            try:
                obj.floor_plan_images = json.loads(form_fps)
            except Exception:
                pass
        elif form_fps == []:
            obj.floor_plan_images = []

        # 5. Multiple Floor Plan Diagrams Uploaded
        floor_plan_files = request.FILES.getlist('floor_plan_upload_files')
        if floor_plan_files:
            new_fp_urls = []
            for fpfile in floor_plan_files:
                ext = os.path.splitext(fpfile.name)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
                    ext = '.png'
                filename = f"properties/floor_plans/{uuid.uuid4().hex[:12]}{ext}"
                saved_path = default_storage.save(filename, ContentFile(fpfile.read()))
                media_url = f"{settings.MEDIA_URL.rstrip('/')}/{saved_path.lstrip('/')}"
                new_fp_urls.append(request.build_absolute_uri(media_url))
            if not obj.floor_plan_images:
                obj.floor_plan_images = []
            obj.floor_plan_images.extend(new_fp_urls)

        # 6. Synchronize legacy single-field floor_plan_image
        if obj.floor_plan_images and len(obj.floor_plan_images) > 0:
            obj.floor_plan_image = obj.floor_plan_images[0]
        else:
            obj.floor_plan_image = ''

        # 7. Amenities from form
        form_amenities = form.cleaned_data.get('amenities')
        if isinstance(form_amenities, list):
            obj.amenities = list(form_amenities)
        elif isinstance(form_amenities, str) and form_amenities:
            try:
                obj.amenities = json.loads(form_amenities)
            except Exception:
                pass

        # 8. Ensure agent_name is populated if agent is set
        if obj.agent and not obj.agent_name:
            obj.agent_name = f"{obj.agent.first_name} {obj.agent.last_name}".strip() or obj.agent.username

        super().save_model(request, obj, form, change)

    @admin.display(description='Photo')
    def thumbnail(self, obj):
        first = obj.images[0] if obj.images else None
        if first and str(first).startswith(('http://', 'https://', '/')):
            return format_html('<img src="{}" style="height:44px;width:64px;object-fit:cover;'
                               'border-radius:4px" />', first)
        return '—'

    @admin.display(description='Status', ordering='status')
    def status_badge(self, obj):
        colours = {'active': '#28a745', 'pending': '#ffc107', 'rejected': '#dc3545'}
        text_colour = '#212529' if obj.status == 'pending' else '#fff'
        return format_html(
            '<span style="background:{};color:{};padding:3px 9px;border-radius:10px;'
            'font-size:11px;font-weight:600;text-transform:uppercase">{}</span>',
            colours.get(obj.status, '#6c757d'), text_colour, obj.status)

    @admin.display(description='Moderation Actions')
    def quick_moderation(self, obj):
        if obj.status == 'pending':
            return format_html(
                '<a class="btn btn-xs btn-success" style="padding:3px 8px;margin-right:4px;'
                'background:#28a745;color:#fff;border-radius:4px;text-decoration:none;font-size:11px;font-weight:600" '
                'href="{}quick-approve/">✓ Approve & Publish</a>'
                '<a class="btn btn-xs btn-danger" style="padding:3px 8px;'
                'background:#dc3545;color:#fff;border-radius:4px;text-decoration:none;font-size:11px;font-weight:600" '
                'href="{}quick-reject/">✗ Reject</a>',
                f'{obj.id}/', f'{obj.id}/'
            )
        elif obj.status == 'active':
            return format_html(
                '<span style="color:#28a745;font-weight:600;font-size:11px;margin-right:6px">● Live on Display</span>'
                '<a style="color:#dc3545;font-size:11px;text-decoration:underline" href="{}quick-reject/">Deactivate</a>',
                f'{obj.id}/'
            )
        else:  # rejected
            return format_html(
                '<a class="btn btn-xs btn-success" style="padding:3px 8px;'
                'background:#28a745;color:#fff;border-radius:4px;text-decoration:none;font-size:11px;font-weight:600" '
                'href="{}quick-approve/">✓ Re-Approve</a>',
                f'{obj.id}/'
            )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<uuid:property_id>/quick-approve/', self.admin_site.admin_view(self.quick_approve), name='property-quick-approve'),
            path('<uuid:property_id>/quick-reject/', self.admin_site.admin_view(self.quick_reject), name='property-quick-reject'),
        ]
        return custom_urls + urls

    def quick_approve(self, request, property_id):
        prop = get_object_or_404(Property, id=property_id)
        prop.status = 'active'
        prop.rejection_note = ''
        prop.save(update_fields=['status', 'rejection_note'])
        self.message_user(request, f'"{prop.title}" is now ACTIVE and visible on display.', messages.SUCCESS)
        return redirect(request.META.get('HTTP_REFERER', 'admin:properties_property_changelist'))

    def quick_reject(self, request, property_id):
        prop = get_object_or_404(Property, id=property_id)
        prop.status = 'rejected'
        if not prop.rejection_note:
            prop.rejection_note = 'Rejected by administrator.'
        prop.save(update_fields=['status', 'rejection_note'])
        self.message_user(request, f'"{prop.title}" has been deactivated/rejected.', messages.WARNING)
        return redirect(request.META.get('HTTP_REFERER', 'admin:properties_property_changelist'))

    # --- bulk moderation actions --------------------------------------------------------
    @admin.action(description='Approve selected listings')
    def approve(self, request, queryset):
        count = queryset.exclude(status='active').update(status='active', rejection_note='')
        self.message_user(request, f'{count} listing(s) approved and now live on display.', messages.SUCCESS)

    @admin.action(description='Reject selected listings')
    def reject(self, request, queryset):
        count = 0
        for prop in queryset.exclude(status='rejected'):
            prop.status = 'rejected'
            prop.rejection_note = prop.rejection_note or 'Rejected by an administrator.'
            prop.save(update_fields=['status', 'rejection_note'])
            count += 1
        self.message_user(request, f'{count} listing(s) rejected. Edit a listing to add a reason.',
                          messages.WARNING)

    @admin.action(description='Mark as featured')
    def mark_featured(self, request, queryset):
        self.message_user(request, f'{queryset.update(featured=True)} listing(s) featured.')

    @admin.action(description='Remove featured flag')
    def unmark_featured(self, request, queryset):
        self.message_user(request, f'{queryset.update(featured=False)} listing(s) un-featured.')


@admin.register(NearbyPlace)
class NearbyPlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'distance', 'property')
    list_filter = ('type',)
    search_fields = ('name', 'property__title')
    raw_id_fields = ('property',)
