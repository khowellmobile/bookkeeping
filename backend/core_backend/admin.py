from django.contrib import admin
from .models import Transaction, Account


@admin.register(Transaction)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "type",
        "date",
        "amount",
        "payee",
        "memo",
        "isReconciled",
        "is_deleted",
        "created_at",
        "updated_at",
    ]


@admin.register(Account)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
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
    ]
