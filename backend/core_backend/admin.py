from django.contrib import admin
from .models import (
    Transaction,
    Account,
    Entity,
    Journal,
    Property,
    RentPayment,
    JournalItem,
)


@admin.register(Transaction)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "account",
        "property",
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
        "id",
        "user",
        "property",
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


@admin.register(JournalItem)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "journal",
        "account",
        "type",
        "amount",
        "memo",
        "is_deleted",
        "created_at",
        "updated_at",
    ]


@admin.register(Journal)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "property",
        "name",
        "date",
        "item_list",
        "is_deleted",
        "created_at",
        "updated_at",
    ]


@admin.register(Property)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "address",
        "name",
        "property_type",
        "display_accounts",
        "number_of_units",
        "rent",
        "notes",
        "is_active",
        "is_deleted",
        "created_at",
        "updated_at",
    ]

    def display_accounts(self, obj):
        """
        Returns a comma-separated string of account names for the Property.
        """
        return ", ".join([account.name for account in obj.accounts.all()])


@admin.register(RentPayment)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "property",
        "entity",
        "amount",
        "date",
        "status",
        "is_deleted",
        "created_at",
        "updated_at",
    ]
