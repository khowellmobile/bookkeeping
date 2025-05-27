from django.contrib import admin
from .models import Transaction, Account, Entity, Journal


@admin.register(Transaction)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "account",
        "type",
        "date",
        "amount",
        "entity",
        "memo",
        "is_reconciled",
        "is_deleted",
        "created_at",
        "updated_at",
    ]


@admin.register(Account)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
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
    ]


@admin.register(Entity)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "name",
        "company",
        "address",
        "phone_number",
        "email",
        "description",
        "is_deleted",
        "created_at",
        "updated_at",
    ]


@admin.register(Journal)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "name",
        "date",
        "item_list",
        "is_deleted",
        "created_at",
        "updated_at",
    ]
