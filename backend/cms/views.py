from rest_framework import viewsets, views, permissions
from rest_framework.response import Response
from .models import MenuCategory, SiteSetting, PageContent, BlogPost
from .serializers import MenuCategorySerializer, SiteSettingSerializer, PageContentSerializer, BlogPostSerializer

class MenuCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuCategory.objects.all()
    serializer_class = MenuCategorySerializer
    pagination_class = None

class SiteSettingView(views.APIView):
    def get(self, request, *args, **kwargs):
        setting = SiteSetting.objects.first()
        if not setting:
            setting = SiteSetting.objects.create()
        serializer = SiteSettingSerializer(setting, context={'request': request})
        return Response(serializer.data)

class PageContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    lookup_field = 'slug'

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
