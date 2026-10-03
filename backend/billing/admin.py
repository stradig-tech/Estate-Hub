from django.contrib import admin

from .models import Invoice, SubscriptionPlan


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('short_id', 'user', 'plan_name', 'amount', 'status', 'created_date')
    list_filter = ('status', 'plan_name', 'created_date')
    search_fields = ('id', 'user__email', 'plan_name')
    list_select_related = ('user',)
    raw_id_fields = ('user',)
    date_hierarchy = 'created_date'
    readonly_fields = ('created_date',)

    @admin.display(description='Invoice')
    def short_id(self, obj):
        return f'#{str(obj.id)[:8].upper()}'


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'interval', 'popular')
    list_editable = ('price', 'popular')
    search_fields = ('name',)
