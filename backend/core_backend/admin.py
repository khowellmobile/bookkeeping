from django.contrib import admin
from .models import Transaction


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
        "created_at",
        "updated_at",
    ]
