import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate_flow_backend.settings')
django.setup()

from properties.models import Property
from accounts.models import User

def seed_data():
    print("Seeding database with initial properties...")
    
    # Get or create a default agent
    agent, created = User.objects.get_or_create(
        username='agent1',
        defaults={
            'email': 'agent1@example.com',
            'role': 'agent',
            'agency_name': 'EstateHub Realty'
        }
    )
    if created:
        agent.set_password('password')
        agent.save()
        
    properties = [
        {
            'title': 'Modern Townhouse with City Views',
            'price': 720000,
            'listing_type': 'for_sale',
            'property_type': 'townhouse',
            'bedrooms': 3,
            'bathrooms': 2,
            'size': 1900,
            'city': 'Los Angeles',
            'state': 'CA',
            'status': 'active',
            'featured': True,
            'images': ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        },
        {
            'title': 'Cozy Beachside Apartment',
            'price': 2200,
            'listing_type': 'for_rent',
            'property_type': 'apartment',
            'bedrooms': 2,
            'bathrooms': 1,
            'size': 950,
            'city': 'Miami',
            'state': 'FL',
            'status': 'active',
            'featured': False,
            'images': ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        },
        {
            'title': 'Retail Space in Prime Location',
            'price': 5500,
            'listing_type': 'for_rent',
            'property_type': 'commercial',
            'bedrooms': 0,
            'bathrooms': 1,
            'size': 2000,
            'city': 'New York',
            'state': 'NY',
            'status': 'active',
            'featured': False,
            'images': ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
        },
        {
            'title': 'Chic Downtown Loft Apartment',
            'price': 3800,
            'listing_type': 'for_rent',
            'property_type': 'apartment',
            'bedrooms': 1,
            'bathrooms': 1,
            'size': 850,
            'city': 'New York',
            'state': 'NY',
            'status': 'active',
            'featured': False,
            'images': ['https://images.unsplash.com/photo-1502672260266-1c1de2d9200b?w=800'],
        },
        {
            'title': 'Spacious Suburban Home',
            'price': 415000,
            'listing_type': 'for_sale',
            'property_type': 'house',
            'bedrooms': 5,
            'bathrooms': 3,
            'size': 3200,
            'city': 'Austin',
            'state': 'TX',
            'status': 'active',
            'featured': False,
            'images': ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
        },
        {
            'title': 'Modern Family Home with Pool',
            'price': 525000,
            'listing_type': 'for_sale',
            'property_type': 'house',
            'bedrooms': 4,
            'bathrooms': 3,
            'size': 2800,
            'city': 'Austin',
            'state': 'TX',
            'status': 'active',
            'featured': True,
            'images': ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
        }
    ]

    for p_data in properties:
        Property.objects.get_or_create(
            title=p_data['title'],
            defaults={
                **p_data,
                'agent': agent,
                'agent_name': agent.username
            }
        )

    print(f"Successfully seeded {len(properties)} properties!")

if __name__ == '__main__':
    seed_data()
