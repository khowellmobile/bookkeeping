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

    def update_balance(self, transaction, is_reversal=False):
        amount = transaction.amount
        if transaction.type == "debit":
            if is_reversal:
                self.balance -= amount
            else:
                self.balance += amount
        elif transaction.type == "credit":
            if is_reversal:
                self.balance += amount
            else:
                self.balance -= amount
        self.save()

    def __str__(self):
        return self.name


class Property(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="properties", null=True
    )
    address = models.CharField(max_length=255)
    name = models.CharField(max_length=255, null=True)
    property_type = models.CharField(
        max_length=25,
        choices=[
            ("residential", "Residential"),
            ("commercial", "Commercial"),
            ("multi_unit", "Multi-Unit"),
        ],
        default="residential",
    )
    accounts = models.ManyToManyField(
        Account,
        related_name="properties",
        blank=True,
    )
    number_of_units = models.DecimalField(max_digits=4, decimal_places=0, null=True)
    rent = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    current_rent_due = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    notes = models.JSONField(null=True, blank=True)
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
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="entities", null=True
    )
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, null=True)
    address = models.CharField(max_length=255, null=True)
    phone_number = models.CharField(max_length=255, null=True)
    email = models.EmailField(max_length=255, null=True)
    description = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


TRANSACTION_TYPE_CHOICES = [
    ("credit", "Credit"),
    ("debit", "Debit"),
    ("noType", "NoType"),
]


class Transaction(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transactions", null=True
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="transactions"
    )
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="transactions", null=True
    )
    type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPE_CHOICES,
        default="noType",
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
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="journals", null=True
    )
    name = models.CharField(max_length=255)
    date = models.DateField()
    item_list = models.JSONField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class RentPayment(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="rent_payments", null=True
    )
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="rent_payments", null=True
    )
    entity = models.ForeignKey(
        Entity, on_delete=models.CASCADE, related_name="rent_payments", null=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(null=True)
    status = models.CharField(
        max_length=25,
        choices=[
            ("scheduled", "Scheduled"),
            ("paid", "Paid"),
            ("due", "Due"),
            ("overdue", "Overdue"),
        ],
        default="residential",
    )
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.entity.name}: ${self.amount}"
