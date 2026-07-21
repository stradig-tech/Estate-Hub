import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate_flow_backend.settings')
django.setup()

from cms.models import PageContent

about_content = """Welcome to Home Lengo, where we turn houses into homes and dreams into reality. At Home Lengo, we believe that a home is more than just a physical space; it's a place where memories are created, families grow, and life unfolds."""

contact_content = """Feel free to connect with us through our online channels for updates, news, and more."""

PageContent.objects.update_or_create(
    slug='about-us',
    defaults={
        'title': 'Welcome to the HomLengo',
        'description': about_content
    }
)

PageContent.objects.update_or_create(
    slug='contact',
    defaults={
        'title': 'Drop Us A Line',
        'description': contact_content
    }
)

print("Successfully seeded CMS content for About Us and Contact Us pages.")
