import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate_flow_backend.settings')
django.setup()

from cms.models import BlogPost

blogs = [
    {
        'title': 'Building Gains Into Housing Stocks And How To Trade The Sector',
        'slug': 'building-gains-housing-stocks',
        'author': 'Jerome Bell',
        'category': 'Furniture',
        'image': '',
        'excerpt': 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...',
        'content': 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...'
    },
    {
        'title': 'How to choose the perfect furniture for your new home',
        'slug': 'choose-perfect-furniture',
        'author': 'Jerome Bell',
        'category': 'Furniture',
        'image': '',
        'excerpt': 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...',
        'content': 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...'
    },
    {
        'title': 'Real estate market predictions for the next 5 years',
        'slug': 'real-estate-market-predictions',
        'author': 'Jerome Bell',
        'category': 'Real Estate',
        'image': '',
        'excerpt': 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...',
        'content': 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...'
    }
]

for blog in blogs:
    BlogPost.objects.update_or_create(
        slug=blog['slug'],
        defaults={
            'title': blog['title'],
            'author': blog['author'],
            'category': blog['category'],
            'excerpt': blog['excerpt'],
            'content': blog['content']
        }
    )

print("Successfully seeded BlogPost content.")
