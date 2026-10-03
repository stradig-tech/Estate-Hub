from rest_framework import viewsets, permissions

from api.permissions import IsAdminOrReadOnly, IsAdminRole, is_admin
from .models import Invoice, SubscriptionPlan
from .serializers import InvoiceSerializer, SubscriptionPlanSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    """Invoices are issued by the platform (payment webhooks / admins), never by the client.

    Regular users can only list/read their own invoices.
    """
    queryset = Invoice.objects.all().order_by('-created_date')
    serializer_class = InvoiceSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

    def get_queryset(self):
        queryset = super().get_queryset()
        if is_admin(self.request.user):
            return queryset
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Admin-created invoices default to the admin unless a user is supplied.
        serializer.save(user=serializer.validated_data.get('user') or self.request.user)


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all().order_by('price')
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAdminOrReadOnly]
