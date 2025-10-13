from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from core_backend.models import Property


class PropertyRequiredMixin:

    def initial(self, request, *args, **kwargs):
        if request.method in ["GET", "POST"]:
            property_id = request.query_params.get("property_id")

            if not property_id:
                self.permission_denied(
                    request,
                    message={"error": "property_id is required."},
                )

            try:
                self.property_obj = Property.objects.get(
                    id=property_id, user=request.user
                )
            except Property.DoesNotExist:
                self.permission_denied(
                    request,
                    message={
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                self.permission_denied(
                    request,
                    message={"error": "Invalid property_id provided."},
                )

        super().initial(request, *args, **kwargs)
