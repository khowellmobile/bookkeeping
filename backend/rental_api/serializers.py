# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'user', 'type', 'date', 'amount', 'created_at', 'updated_at')