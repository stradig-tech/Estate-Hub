from django.contrib import admin, messages

from .models import Inquiry, InquiryMessage


class InquiryMessageInline(admin.TabularInline):
    model = InquiryMessage
    extra = 0
    readonly_fields = ('created_date',)
    fields = ('sender_name', 'sender_role', 'message', 'created_date')


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'property', 'agent', 'status', 'created_date', 'updated_date')
    list_filter = ('status', 'created_date')
    search_fields = ('name', 'email', 'phone', 'message', 'property__title', 'agent__email')
    list_select_related = ('property', 'agent', 'customer')
    raw_id_fields = ('property', 'agent', 'customer')
    date_hierarchy = 'created_date'
    readonly_fields = ('created_date', 'updated_date')
    inlines = [InquiryMessageInline]
    actions = ['mark_read', 'mark_replied']

    @admin.action(description='Mark as read')
    def mark_read(self, request, queryset):
        self.message_user(request, f'{queryset.update(status="read")} inquiry(ies) marked read.',
                          messages.SUCCESS)

    @admin.action(description='Mark as replied')
    def mark_replied(self, request, queryset):
        self.message_user(request, f'{queryset.update(status="replied")} inquiry(ies) marked replied.',
                          messages.SUCCESS)

