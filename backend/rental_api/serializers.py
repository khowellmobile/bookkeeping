# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import Transaction, Account
from django.contrib.auth import authenticate


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            "id",
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
    account = AccountSerializer(read_only=True)
    account_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "account",
            "account_id",
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
        account_id = validated_data.pop("account_id")
        try:
            account = Account.objects.get(id=account_id)
        except Account.DoesNotExist:
            raise serializers.ValidationError(
                {"account_id": "Account with this ID does not exist."}
            )
        validated_data["account"] = account
        return super().create(validated_data)
