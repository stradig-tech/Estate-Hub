from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import User, Agency, Agent, Favorite, Review


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'address', 'agents_count', 'created_at')
    search_fields = ('name', 'email', 'phone', 'address')
    ordering = ('name',)

    @admin.display(description='Agents')
    def agents_count(self, obj):
        count = obj.agents.count()
        return format_html(
            '<span style="background:#e0e7ff;color:#3730a3;font-weight:700;padding:2px 10px;border-radius:12px;font-size:12px;">{} agents</span>',
            count
        )


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Uses Django's UserAdmin so passwords are hashed and can be reset safely."""
    list_display = ('avatar_preview', 'email', 'full_name', 'role_badge', 'agent_status_badge', 'agency_name',
                    'phone', 'is_active', 'date_joined')
    list_filter = ('role', 'agent_status', 'is_featured_agent', 'subscription_status', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone',
                     'agency_name', 'license_number')
    ordering = ('-date_joined',)
    date_hierarchy = 'date_joined'

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Estate Hub profile', {
            'fields': ('role', 'agent_status', 'phone', 'agency', 'agency_name', 'agent_title', 'is_featured_agent', 'license_number', 'avatar_url', 'bio'),
        }),
        ('Subscription', {
            'fields': ('subscription_plan', 'subscription_status'),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {'classes': ('wide',), 'fields': ('email', 'role')}),
    )
    actions = [
        'approve_agents', 'reject_agents',
        'make_buyer', 'make_agent', 'make_admin',
        'activate_users', 'deactivate_users'
    ]

    @admin.display(description='Avatar')
    def avatar_preview(self, obj):
        url = obj.avatar_url
        if url:
            return format_html(
                '<img src="{}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" />',
                url
            )
        initial = (obj.first_name[:1] or obj.username[:1] or 'U').upper()
        return format_html(
            '<div style="width:34px;height:34px;border-radius:50%;background:#e2e8f0;color:#64748b;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">{}</div>',
            initial
        )

    @admin.display(description='Name', ordering='first_name')
    def full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip() or '—'

    @admin.display(description='Role', ordering='role')
    def role_badge(self, obj):
        colours = {'admin': '#dc3545', 'agent': '#17a2b8', 'buyer': '#6c757d'}
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:10px;'
            'font-size:11px;text-transform:uppercase">{}</span>',
            colours.get(obj.role, '#6c757d'), obj.role)

    @admin.display(description='Agent Approval', ordering='agent_status')
    def agent_status_badge(self, obj):
        if obj.role != 'agent':
            return '—'
        badges = {
            'approved': ('#28a745', '#fff', 'Approved'),
            'pending': ('#ffc107', '#000', 'Pending Review'),
            'rejected': ('#dc3545', '#fff', 'Rejected'),
        }
        bg, text_color, label = badges.get(obj.agent_status, ('#6c757d', '#fff', obj.agent_status))
        return format_html(
            '<span style="background:{};color:{};padding:2px 8px;border-radius:10px;'
            'font-size:11px;font-weight:600;text-transform:uppercase">{}</span>',
            bg, text_color, label)

    @admin.action(description='Approve selected agents (Grant listing access)')
    def approve_agents(self, request, queryset):
        count = queryset.filter(role='agent').update(agent_status='approved')
        self.message_user(request, f'{count} agent(s) marked as Approved. They can now list properties.', messages.SUCCESS)

    @admin.action(description='Reject selected agents')
    def reject_agents(self, request, queryset):
        count = queryset.filter(role='agent').update(agent_status='rejected')
        self.message_user(request, f'{count} agent(s) marked as Rejected.', messages.WARNING)

    def _set_role(self, request, queryset, role):
        updated = 0
        for user in queryset:  # save() individually so model-level role rules apply
            user.role = role
            user.save()
            updated += 1
        self.message_user(request, f'{updated} user(s) set to "{role}".', messages.SUCCESS)

    @admin.action(description='Set role: Buyer')
    def make_buyer(self, request, queryset):
        self._set_role(request, queryset.exclude(pk=request.user.pk), 'buyer')

    @admin.action(description='Set role: Agent')
    def make_agent(self, request, queryset):
        self._set_role(request, queryset, 'agent')

    @admin.action(description='Set role: Admin')
    def make_admin(self, request, queryset):
        self._set_role(request, queryset, 'admin')

    @admin.action(description='Activate selected users')
    def activate_users(self, request, queryset):
        self.message_user(request, f'{queryset.update(is_active=True)} user(s) activated.')

    @admin.action(description='Deactivate selected users')
    def deactivate_users(self, request, queryset):
        count = queryset.exclude(pk=request.user.pk).update(is_active=False)
        self.message_user(request, f'{count} user(s) deactivated.')


@admin.register(Agent)
class AgentAdmin(BaseUserAdmin):
    list_display = ('avatar_preview', 'full_name', 'email', 'phone', 'agency_name',
                    'agent_title', 'is_featured_badge', 'agent_status_badge', 'listings_count', 'is_active')
    list_editable = ('agent_title',)
    list_filter = ('is_featured_agent', 'agent_status', 'agency_name', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone',
                     'agency_name', 'agent_title', 'license_number')
    ordering = ('-date_joined',)

    fieldsets = (
        ('Account Credentials', {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'avatar_url', 'bio')}),
        ('Agency & Designation', {'fields': ('agency', 'agency_name', 'agent_title', 'is_featured_agent', 'license_number')}),
        ('Status & Permissions', {'fields': ('agent_status', 'is_active', 'is_staff')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password', 'phone', 'agency_name', 'agent_title', 'is_featured_agent'),
        }),
    )
    actions = [
        'feature_on_homepage', 'unfeature_from_homepage',
        'approve_agents', 'reject_agents',
        'activate_users', 'deactivate_users'
    ]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='agent')

    def save_model(self, request, obj, form, change):
        obj.role = 'agent'
        if not obj.agency_name and not obj.agency:
            obj.agency_name = 'Estate Hub'
        if not change and not obj.agent_status:
            obj.agent_status = 'approved'
        super().save_model(request, obj, form, change)

    @admin.display(description='Avatar')
    def avatar_preview(self, obj):
        url = obj.avatar_url
        if url:
            return format_html(
                '<img src="{}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" />',
                url
            )
        return format_html(
            '<div style="width:36px;height:36px;border-radius:50%;background:#e2e8f0;color:#64748b;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">{}</div>',
            (obj.first_name[:1] or obj.username[:1] or 'A').upper()
        )

    @admin.display(description='Name', ordering='first_name')
    def full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip() or obj.username

    @admin.display(description='Homepage', ordering='is_featured_agent')
    def is_featured_badge(self, obj):
        if obj.is_featured_agent:
            return format_html('<span style="background:#10b981;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">{}</span>', 'FEATURED')
        return format_html('<span style="color:#94a3b8;font-size:11px;">{}</span>', 'Standard')

    @admin.display(description='Approval', ordering='agent_status')
    def agent_status_badge(self, obj):
        badges = {
            'approved': ('#28a745', '#fff', 'Approved'),
            'pending': ('#ffc107', '#000', 'Pending Review'),
            'rejected': ('#dc3545', '#fff', 'Rejected'),
        }
        bg, text_color, label = badges.get(obj.agent_status, ('#6c757d', '#fff', obj.agent_status))
        return format_html(
            '<span style="background:{};color:{};padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;text-transform:uppercase">{}</span>',
            bg, text_color, label
        )

    @admin.display(description='Listings')
    def listings_count(self, obj):
        count = obj.properties.count()
        return format_html('<b>{}</b>', count)

    @admin.action(description='Feature selected agents on homepage (Meet Our Agents)')
    def feature_on_homepage(self, request, queryset):
        count = queryset.update(is_featured_agent=True)
        self.message_user(request, f'{count} agent(s) marked as featured on homepage.', messages.SUCCESS)

    @admin.action(description='Remove selected agents from homepage')
    def unfeature_from_homepage(self, request, queryset):
        count = queryset.update(is_featured_agent=False)
        self.message_user(request, f'{count} agent(s) unfeatured from homepage.', messages.SUCCESS)

    @admin.action(description='Approve selected agents')
    def approve_agents(self, request, queryset):
        count = queryset.update(agent_status='approved')
        self.message_user(request, f'{count} agent(s) marked as Approved.', messages.SUCCESS)

    @admin.action(description='Reject selected agents')
    def reject_agents(self, request, queryset):
        count = queryset.update(agent_status='rejected')
        self.message_user(request, f'{count} agent(s) marked as Rejected.', messages.WARNING)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'property_title', 'property_city', 'created_date')
    search_fields = ('user__email', 'property_title', 'property_city')
    list_select_related = ('user',)
    raw_id_fields = ('user', 'property')
    date_hierarchy = 'created_date'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'rating_stars', 'agent', 'short_comment', 'created_date')
    list_filter = ('rating', 'created_date')
    search_fields = ('author_name', 'author_email', 'comment', 'agent__email')
    list_select_related = ('agent',)
    raw_id_fields = ('agent',)
    date_hierarchy = 'created_date'

    @admin.display(description='Rating', ordering='rating')
    def rating_stars(self, obj):
        return '★' * obj.rating + '☆' * max(0, 5 - obj.rating)

    @admin.display(description='Comment')
    def short_comment(self, obj):
        text = obj.comment or ''
        return text if len(text) <= 60 else text[:57] + '…'
