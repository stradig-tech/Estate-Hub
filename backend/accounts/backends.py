from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q


class EmailOrUsernameModelBackend(ModelBackend):
    """
    Custom authentication backend that permits authentication using
    either username or email address (case-insensitively).
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        if username is None:
            username = kwargs.get('email')

        if not username or not password:
            return None

        username = str(username).strip()
        try:
            user = User.objects.filter(
                Q(username__iexact=username) | Q(email__iexact=username)
            ).first()
        except Exception:
            return None

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
