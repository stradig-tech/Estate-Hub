from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (
    register, me, UserViewSet, AgentViewSet, FavoriteViewSet, ReviewViewSet,
    ThrottledTokenObtainPairView,
)
from properties.views import PropertyViewSet, NearbyPlaceViewSet
from billing.views import InvoiceViewSet, SubscriptionPlanViewSet
from support.views import InquiryViewSet
from api.views import upload_file

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'properties', PropertyViewSet)
router.register(r'inquiries', InquiryViewSet)
router.register(r'favorites', FavoriteViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'subscription-plans', SubscriptionPlanViewSet)
router.register(r'nearby-places', NearbyPlaceViewSet)

urlpatterns = [
    # Auth endpoints
    path('auth/login/', ThrottledTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register, name='register'),
    path('auth/me/', me, name='me'),

    # File uploads
    path('upload/', upload_file, name='upload_file'),
    
    # ViewSet endpoints
    path('', include(router.urls)),
    path('cms/', include('cms.urls')),
]
