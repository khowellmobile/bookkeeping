# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import Transaction, Account


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "type",
            "date",
            "amount",
            "memo",
            "payee",
            "isReconciled",
            "is_deleted",
            "created_at",
            "updated_at",
        )


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
