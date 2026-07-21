from rest_framework import viewsets, permissions
from .models import Property, NearbyPlace
from .serializers import PropertySerializer, NearbyPlaceSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_date')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status', None)
        agent_id = self.request.query_params.get('agent_id', None)
        city = self.request.query_params.get('city', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if agent_id:
            queryset = queryset.filter(agent_id=agent_id)
        if city:
            queryset = queryset.filter(city__iexact=city)
            
        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(agent=self.request.user, agent_name=f"{self.request.user.first_name} {self.request.user.last_name}".strip() or self.request.user.username)
        else:
            serializer.save()

class NearbyPlaceViewSet(viewsets.ModelViewSet):
    queryset = NearbyPlace.objects.all()
    serializer_class = NearbyPlaceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        property_id = self.request.query_params.get('property_id', None)
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        return queryset
