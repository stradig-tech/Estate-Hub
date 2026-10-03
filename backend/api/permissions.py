"""Shared role-based permission helpers for all apps.

Roles: ``admin``, ``agent``, ``buyer`` (see ``accounts.User.role``).
Permission classes only answer "may this user perform this kind of action?".
List endpoints must *also* scope their querysets in ``get_queryset()``.
"""
from rest_framework import permissions


def is_admin(user):
    return bool(
        user
        and user.is_authenticated
        and (getattr(user, 'role', None) == 'admin' or user.is_superuser)
    )


def is_agent(user):
    return bool(user and user.is_authenticated and getattr(user, 'role', None) == 'agent')


def is_approved_agent(user):
    return bool(
        user
        and user.is_authenticated
        and getattr(user, 'role', None) == 'agent'
        and getattr(user, 'agent_status', 'approved') == 'approved'
    )


def is_agent_or_admin(user):
    return is_admin(user) or is_approved_agent(user)


class IsAdminRole(permissions.BasePermission):
    """Only users with the admin role."""

    def has_permission(self, request, view):
        return is_admin(request.user)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Anyone may read; only admins may write."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return is_admin(request.user)


class IsAgentOrAdminOrReadOnly(permissions.BasePermission):
    """Anyone may read; only approved agents/admins may create; owners/admins may modify.

    Views using this permission must define ``owner_field`` (a dotted path from the
    object to the owning user, e.g. ``'agent'`` or ``'property.agent'``).
    """

    owner_field = 'agent'
    message = "Your agent account is pending administrator approval before you can submit or manage listings."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return is_agent_or_admin(request.user)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if is_admin(request.user):
            return True
        owner = obj
        for part in getattr(view, 'owner_field', self.owner_field).split('.'):
            owner = getattr(owner, part, None)
            if owner is None:
                return False
        return is_approved_agent(request.user) and owner == request.user
