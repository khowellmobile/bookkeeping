# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import Transaction, Account
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    """
    Serializer for the login request data.
    """

    username = serializers.CharField(
        write_only=True, max_length=150, required=True  # You can adjust this as needed
    )
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        trim_whitespace=False,
        required=True,
    )

    def validate(self, data):
        """
        Validates the username and password, and authenticates the user.
        """
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError(
                        "User account is disabled.", code="account_disabled"
                    )
                data["user"] = user
                return data
            else:
                raise serializers.ValidationError(
                    "Invalid credentials. Please check your username and password.",
                    code="invalid_credentials",
                )
        else:
            raise serializers.ValidationError(
                "Both username and password are required.", code="missing_fields"
            )

    class Meta:
        fields = ["username", "password"]


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            "user",
            "name",
            "type",
            "balance",
            "initial_balance",
            "description",
            "account_number",
            "is_active",
            "is_deleted",
            "created_at",
            "updated_at",
        )


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "account",
            "date",
            "amount",
            "memo",
            "payee",
            "is_reconciled",
            "is_deleted",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "user": {"read_only": True},
            "date": {"required": True},
            "amount": {"required": True},
        }

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user

        # Get the account instance based on the provided account ID
        account_id = validated_data.pop(
            "account"
        )  # changed from validated_data['account']
        try:
            account = Account.objects.get(id=account_id)
        except Account.DoesNotExist:
            raise serializers.ValidationError(
                {"account": "Account with this ID does not exist."}
            )
        validated_data["account"] = account

        return super().create(validated_data)
