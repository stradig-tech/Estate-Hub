import os
import uuid
from django import forms
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

from .models import Property
from .widgets import AdminCoverPhotoWidget, AdminGalleryWidget, AdminFloorPlansWidget, AdminAmenitiesWidget


class PropertyAdminForm(forms.ModelForm):
    cover_photo = forms.FileField(
        required=False,
        label="Cover Photo (Thumbnail)",
        widget=AdminCoverPhotoWidget(),
        help_text="Upload or replace the primary listing thumbnail."
    )

    class Meta:
        model = Property
        fields = '__all__'
        widgets = {
            'images': AdminGalleryWidget(),
            'floor_plan_images': AdminFloorPlansWidget(),
            'amenities': AdminAmenitiesWidget(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Determine initial cover photo for visual preview
        if self.instance and self.instance.pk:
            current_cover = None
            if self.instance.images and isinstance(self.instance.images, list) and len(self.instance.images) > 0:
                current_cover = self.instance.images[0]
            self.fields['cover_photo'].widget.current_cover = current_cover
            self.fields['cover_photo'].widget.attrs['current_cover'] = current_cover
            self.initial['cover_photo'] = current_cover

            # Backward-compatibility prefill for floor_plan_images
            if self.instance.floor_plan_image and not self.instance.floor_plan_images:
                self.initial['floor_plan_images'] = [self.instance.floor_plan_image]
                if hasattr(self.instance, 'floor_plan_images'):
                    self.instance.floor_plan_images = [self.instance.floor_plan_image]

        # Make images, floor_plan_images, and amenities not required in form validation
        for fld in ('images', 'floor_plan_images', 'amenities'):
            if fld in self.fields:
                self.fields[fld].required = False
