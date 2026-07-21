import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate_flow_backend.settings')
django.setup()

from cms.models import PageContent

pages = [
    {
        'slug': 'home',
        'title': 'Find Your Perfect Home',
        'description': 'Search thousands of homes for sale and rent. Connect with trusted agents.'
    },
    {
        'slug': 'services',
        'title': 'Our Services',
        'description': 'Home / Pages / Our Services'
    },
    {
        'slug': 'pricing',
        'title': 'Simple, Transparent Pricing',
        'description': 'Choose the plan that fits your business. Upgrade or cancel anytime.'
    },
    {
        'slug': 'blog',
        'title': 'From Our Blog',
        'description': 'LATEST NEW'
    },
    {
        'slug': 'listings',
        'title': 'Property Listings',
        'description': 'Find your dream property'
    }
]

for page in pages:
    PageContent.objects.update_or_create(
        slug=page['slug'],
        defaults={
            'title': page['title'],
            'description': page['description']
        }
    )

print("Successfully seeded CMS content for remaining pages.")
