from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuCategoryViewSet, SiteSettingView, PageContentViewSet, BlogPostViewSet

router = DefaultRouter()
router.register(r'menus', MenuCategoryViewSet, basename='menu')
router.register(r'pages', PageContentViewSet, basename='page')
router.register(r'blogs', BlogPostViewSet, basename='blog')

urlpatterns = [
    path('', include(router.urls)),
    path('settings/', SiteSettingView.as_view(), name='site-settings'),
]
