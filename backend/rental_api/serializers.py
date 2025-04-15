# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import Transaction, Account


class TransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "account",
            "account_name",
            "type",
            "date",
            "amount",
            "memo",
            "payee",
            "is_reconciled",
            "is_deleted",
            "created_at",
            "updated_at",
        )

    def get_account_name(self, obj):
        return obj.account.name if obj.account else None


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
