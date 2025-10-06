from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Change this import
from djoser.views import UserViewSet


# csrf exemption
@method_decorator(csrf_exempt, name="activation")
class CsrfExemptUserViewSet(UserViewSet):
    """
    Overrides Djoser's UserViewSet to exempt the 'activation' (POST)
    method from Django's CSRF check.
    """
    pass
