from django.db import models
from django.contrib.auth.models import User

ACCOUNT_TYPE_CHOICES = [
    ("asset", "Asset"),
    ("liability", "Liability"),
    ("equity", "Equity"),
    ("income", "Income"),
    ("expense", "Expense"),
    ("bank", "Bank"),
]


class Account(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="accounts", null=True
    )
    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=10,
        choices=ACCOUNT_TYPE_CHOICES,
        default="asset",
        null=True,
        blank=True,
    )
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    initial_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Entity(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="entities", null=True
    )
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, null=True)
    address = models.CharField(max_length=255, null=True)
    description = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


TRANSACTION_TYPE_CHOICES = [("journal", "Journal"), ("account", "Account")]


class Transaction(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transactions", null=True
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="transactions"
    )
    type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPE_CHOICES,
        default="account",
    )
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    entity = models.ForeignKey(
        Entity, on_delete=models.CASCADE, related_name="transactions", null=True
    )
    memo = models.TextField(blank=True, null=True)
    is_reconciled = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Journal(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="journals", null=True
    )
    name = models.CharField(max_length=255)
    date = models.DateField()
    item_list = models.JSONField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
