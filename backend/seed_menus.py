import os
import django
import sys

# Setup django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate_flow_backend.settings')
django.setup()

from cms.models import MenuCategory, MenuItem

def run():
    # Clear existing menus
    MenuCategory.objects.all().delete()

    # 1. Home
    MenuCategory.objects.create(title="Home", order=1, is_mega_menu=False, url="/")

    # 2. Properties (Mega Menu)
    properties = MenuCategory.objects.create(title="Properties", order=2, is_mega_menu=True)
    MenuItem.objects.create(
        category=properties, 
        title="Buy", 
        description="Explore homes for sale", 
        url="/listings?listing_type=for_sale", 
        order=1
    )
    MenuItem.objects.create(
        category=properties, 
        title="Rent", 
        description="Find your next rental home", 
        url="/listings?listing_type=for_rent", 
        order=2
    )

    # 3. Services (Mega Menu)
    services = MenuCategory.objects.create(title="Services", order=3, is_mega_menu=True)
    MenuItem.objects.create(
        category=services, 
        title="Property Management", 
        description="Let us handle the day-to-day", 
        url="/#", 
        order=1
    )
    MenuItem.objects.create(
        category=services, 
        title="Consulting", 
        description="Expert real estate advice", 
        url="/#", 
        order=2
    )

    # 4. About
    MenuCategory.objects.create(title="About", order=4, is_mega_menu=False, url="/about")

    # 5. Blog
    MenuCategory.objects.create(title="Blog", order=5, is_mega_menu=False, url="/blog")

    # 6. Contact Us
    MenuCategory.objects.create(title="Contact Us", order=6, is_mega_menu=False, url="/contact")

    print("Menus seeded successfully!")

if __name__ == '__main__':
    run()
