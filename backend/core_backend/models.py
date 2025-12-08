from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField

ACCOUNT_TYPE_CHOICES = [
    ("asset", "Asset"),
    ("liability", "Liability"),
    ("equity", "Equity"),
    ("revenue", "Revenue"),
    ("expense", "Expense"),
    ("bank", "Bank"),
    ("credit-card", "Credit-Card"),
]


class Account(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="accounts", null=True
    )
    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=15,
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

    # Calculates normal balance based on account type
    @property
    def normal_balance(self):
        debit_balances = ["asset", "expense", "bank"]
        credit_balances = ["liability", "equity", "revenue", "credit-card"]

        account_type = self.type.lower()

        if account_type in debit_balances:
            return "debit"
        elif account_type in credit_balances:
            return "credit"
        return "na"

    def update_balance(self, item, is_reversal=False):
        amount = item.amount

        # Early return for account normals of "na"
        if self.normal_balance == "na":
            print(
                f"Skipping balance update for account '{self.name}' with 'na' normal balance."
            )
            return

        if isinstance(item, RentPayment):
            is_increase = True if self.normal_balance == "credit" else False

            if is_reversal:
                is_increase = not is_increase

            if is_increase:
                self.balance += amount
            else:
                self.balance -= amount

        elif hasattr(item, "type"):
            is_increase = (self.normal_balance == "debit" and item.type == "debit") or (
                self.normal_balance == "credit" and item.type == "credit"
            )

            if is_reversal:
                is_increase = not is_increase

            if is_increase:
                self.balance += amount
            else:
                self.balance -= amount

        self.save()

    def audit_balance(self):
        balance = self.initial_balance

        # Early return for account normals of "na"
        if self.normal_balance == "na":
            print(
                f"Skipping balance update for account '{self.name}' with 'na' normal balance."
            )
            return

        for item in self.transactions.all():
            is_increase = (self.normal_balance == "debit" and item.type == "debit") or (
                self.normal_balance == "credit" and item.type == "credit"
            )

            if is_increase:
                balance += item.amount
            else:
                balance -= item.amount

        for item in self.journal_items.all():
            is_increase = (self.normal_balance == "debit" and item.type == "debit") or (
                self.normal_balance == "credit" and item.type == "credit"
            )

            if is_increase:
                balance += item.amount
            else:
                balance -= item.amount

        if self.type == "revenue":
            for property in self.properties.all():
                for rent_payment in property.rent_payments.filter(status="paid"):
                    balance += rent_payment.amount

        return balance

    def __str__(self):
        return self.name + "_" + str(self.id)


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
            ("multi-unit", "Multi-Unit"),
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
    phone_number = PhoneNumberField(null=True, blank=True)
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


class JournalItem(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="journal_items", null=True
    )
    journal = models.ForeignKey(
        Journal, on_delete=models.CASCADE, related_name="journal_items", null=True
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="journal_items"
    )
    type = models.CharField(
        max_length=10,
        choices=[
            ("credit", "Credit"),
            ("debit", "Debit"),
            ("noType", "NoType"),
        ],
        default="noType",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    memo = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


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


REPORT_TYPE_CHOICES = [
    ("na", "NA"),
    ("balance_sheet", "Balance Sheet"),
    ("profit_loss", "Profit & Loss"),
]

REPORT_DATE_RANGE_CHOICES = [
    ("last_year", "Last Year"),
    ("year_to_date", "Year to Date"),
    ("all_time", "All Time"),
    ("custom", "Custom"),
]


class ReportHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reports", null=True
    )
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="reports", null=True
    )
    type = models.CharField(
        max_length=25,
        choices=REPORT_TYPE_CHOICES,
        default="na",
        null=True,
        blank=True,
    )
    report_range_type = models.CharField(
        max_length=25,
        choices=REPORT_DATE_RANGE_CHOICES,
        default="custom",
        null=True,
        blank=True,
    )
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    report_ran_on_date = models.DateField(null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
