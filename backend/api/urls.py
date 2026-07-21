from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import register, me, UserViewSet, FavoriteViewSet, ReviewViewSet
from properties.views import PropertyViewSet, NearbyPlaceViewSet
from billing.views import InvoiceViewSet, SubscriptionPlanViewSet
from support.views import InquiryViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'inquiries', InquiryViewSet)
router.register(r'favorites', FavoriteViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'subscription-plans', SubscriptionPlanViewSet)
router.register(r'nearby-places', NearbyPlaceViewSet)

urlpatterns = [
    # Auth endpoints
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register, name='register'),
    path('auth/me/', me, name='me'),
    
    # ViewSet endpoints
    path('', include(router.urls)),
    path('cms/', include('cms.urls')),
]
