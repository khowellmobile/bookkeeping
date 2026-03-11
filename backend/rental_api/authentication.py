from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """
    Authenticate using Authorization header first, then fall back to access token cookie.
    """

    def authenticate(self, request):
        header = self.get_header(request)
        raw_token = None
        token_from_cookie = False

        if header is not None:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            access_cookie_name = settings.JWT_AUTH_COOKIE_ACCESS
            raw_token = request.COOKIES.get(access_cookie_name)
            token_from_cookie = raw_token is not None

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        if token_from_cookie:
            self._enforce_csrf(request)

        return self.get_user(validated_token), validated_token

    def _enforce_csrf(self, request):
        check = CSRFCheck(lambda request: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")