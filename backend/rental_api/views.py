from django.shortcuts import render

# rental_api/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
import calendar
from django.db import transaction
from django.db.models import Sum, Value, CharField
from django.db.models.functions import Coalesce
from .serializers import (
    TransactionSerializer,
    AccountSerializer,
    EntitySerializer,
    JournalSerializer,
    PropertySerializer,
    RentPaymentSerializer,
    UserSerializer,
)
from core_backend.models import (
    Transaction,
    Account,
    Entity,
    Journal,
    Property,
    RentPayment,
)
from .mixins import PropertyRequiredMixin


# Mixin to check for and verify property id.
class TransactionListAPIView(PropertyRequiredMixin, APIView):
    """
    API endpoint to list and create transactions.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_obj = self.property_obj

        account_id = request.query_params.get("account_id")
        entity_id = request.query_params.get("entity_id")

        transactions = Transaction.objects.filter(
            user=request.user, property=property_obj
        )

        if account_id:
            try:
                transactions = transactions.filter(account_id=account_id)
            except Account.DoesNotExist:
                return Response(
                    {
                        "error": "Account with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid account_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif entity_id:
            try:
                transactions = transactions.filter(entity_id=entity_id)
            except Entity.DoesNotExist:
                return Response(
                    {
                        "error": "Entity with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid entity_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        data = request.data

        property_obj = self.property_obj

        saved_transactions = []
        for item in data:
            serializer = TransactionSerializer(data=item, context={"request": request})
            if serializer.is_valid():
                transaction_instance = serializer.save(
                    user=request.user, property=property_obj
                )
                if (
                    hasattr(transaction_instance, "account")
                    and transaction_instance.account
                ):
                    transaction_instance.account.update_balance(transaction_instance)
                    saved_transactions.append(serializer.instance)
            else:
                # Handle validation errors for each transaction
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if saved_transactions:
            serializer = TransactionSerializer(saved_transactions, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"message": "No valid transactions were processed."},
                status=status.HTTP_200_OK,
            )


class TransactionDetailAPIView(APIView):
    """
    API endpoint to retrieve a single transaction by its primary key (id).
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Transaction.objects.get(pk=pk, user=self.request.user)
        except Transaction.DoesNotExist:
            return None

    def get(self, request, pk):
        transaction = self.get_object(pk)
        if transaction:
            serializer = TransactionSerializer(transaction)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        transaction = self.get_object(pk)
        if not transaction:
            return Response(status=status.HTTP_404_NOT_FOUND)

        original_account = transaction.account

        serializer = TransactionSerializer(transaction, data=request.data, partial=True)

        if serializer.is_valid():
            original_account.update_balance(transaction, is_reversal=True)
            updated_transaction = serializer.save()
            updated_transaction.account.update_balance(updated_transaction)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        transaction = self.get_object(pk)
        if transaction:
            transaction.account.update_balance(transaction, is_reversal=True)
            transaction.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


# Mixin to check for and verify property id.
class AccountListAPIView(PropertyRequiredMixin, APIView):
    """
    API endpoint to list all accounts.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_obj = self.property_obj

        get_non_property_accounts = request.query_params.get(
            "get_non_property_accounts"
        )

        if get_non_property_accounts:
            included_types = ["bank", "credit-card"]

            account_queryset = Account.objects.filter(
                user=request.user, type__in=included_types
            ).exclude(properties=property_obj)

        else:
            account_queryset = property_obj.accounts.all()

        serializer = AccountSerializer(account_queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        property_obj = self.property_obj
        add_existing = request.query_params.get("add_existing")

        if add_existing:
            try:
                account_obj = Account.objects.get(
                    pk=request.data["id"], user=self.request.user
                )
                property_obj.accounts.add(account_obj)
                serializer = AccountSerializer(account_obj)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Account.DoesNotExist:
                return Response(
                    {
                        "error": "Account with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except KeyError:
                return Response(
                    {"error": "Missing 'id' for existing account."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            serializer = AccountSerializer(
                data=request.data, context={"request": request}
            )

            if serializer.is_valid():
                new_account = serializer.save(user=request.user)
                property_obj.accounts.add(new_account)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountDetailAPIView(APIView):
    """
    API endpoint to retrieve a single account by its primary key (id).
    """

    def get_object(self, pk):
        try:
            return Account.objects.get(pk=pk, user=self.request.user)
        except Account.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AccountSerializer(account)
        return Response(serializer.data)

    def put(self, request, pk):
        account = self.get_object(pk)
        if account:
            serializer = AccountSerializer(account, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)


# Mixin to check for and verify property id.
class EntityListAPIView(PropertyRequiredMixin, APIView):
    """
    API endpoint to list all entities.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_obj = self.property_obj
        entities_queryset = property_obj.entities.all()
        serializer = EntitySerializer(entities_queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        property_obj = self.property_obj
        serializer = EntitySerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save(user=request.user, property=property_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EntityDetailAPIView(APIView):
    """
    API endpoint to retrieve a single entity by its primary key (id).
    """

    def get_object(self, pk):
        try:
            return Entity.objects.get(pk=pk, user=self.request.user)
        except Entity.DoesNotExist:
            return None

    def get(self, request, pk):
        entity = self.get_object(pk)
        if not entity:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = EntitySerializer(entity)
        return Response(serializer.data)

    def put(self, request, pk):
        entity = self.get_object(pk)
        if entity:
            serializer = EntitySerializer(entity, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)


# Mixin to check for and verify property id.
class JournalListAPIView(PropertyRequiredMixin, APIView):
    """
    API endpoint to list journals.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_obj = self.property_obj
        journals_queryset = property_obj.journals.all().prefetch_related(
            "journal_items__account"
        )
        serializer = JournalSerializer(journals_queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        property_obj = self.property_obj
        serializer = JournalSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            journal_instance = serializer.save(property=property_obj)
            for item in journal_instance.journal_items.all():
                item.account.update_balance(item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JournalDetailAPIView(APIView):
    """
    API endpoint to retrieve a single journal by its primary key (id).
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Journal.objects.get(pk=pk, user=self.request.user)
        except Journal.DoesNotExist:
            return None

    def get(self, request, pk):
        journal = self.get_object(pk)
        if journal:
            serializer = JournalSerializer(journal)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        journal = self.get_object(pk)

        prev_journal_items = journal.journal_items.all()

        if journal:
            serializer = JournalSerializer(journal, data=request.data, partial=True)
            if serializer.is_valid():

                for item in prev_journal_items:
                    item.account.update_balance(item, is_reversal=True)

                journal_instance = serializer.save()

                for item in journal_instance.journal_items.all():
                    item.account.update_balance(item)

                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        journal = self.get_object(pk)
        if journal:

            for item in journal.journal_items.all():
                item.account.update_balance(item, is_reversal=True)

            journal.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class PropertyListAPIView(APIView):
    """
    API endpoint to list properties.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = Property.objects.filter(user=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PropertySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            property_instance = serializer.save()

            created_accounts = []

            account_names = [
                "asset",
                "liability",
                "equity",
                "revenue",
                "expense",
            ]

            for i in range(len(account_names)):
                acccount_data = {
                    "name": account_names[i].capitalize(),
                    "type": account_names[i],
                    "normal_balance": "na",
                    "balance": 0,
                    "initial_balance": 0,
                }

                account_serializer = AccountSerializer(
                    data=acccount_data, context={"request": request}
                )
                if account_serializer.is_valid():
                    account = account_serializer.save()
                    created_accounts.append(account)
                else:
                    print(f"Error creating account {i}: {account_serializer.errors}")

            if created_accounts:
                property_instance.accounts.add(*created_accounts)
                response_serializer = PropertySerializer(
                    property_instance, context={"request": request}
                )
                return Response(
                    response_serializer.data, status=status.HTTP_201_CREATED
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyDetailAPIView(APIView):
    """
    API endpoint to retrieve a single property by its primary key (id).
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Property.objects.get(pk=pk, user=self.request.user)
        except Property.DoesNotExist:
            return None

    def get(self, request, pk):
        property = self.get_object(pk)
        if property:
            serializer = PropertySerializer(property)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        property = self.get_object(pk)
        if property:
            serializer = PropertySerializer(property, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        property = self.get_object(pk)
        if property:
            property.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


# Mixin to check for and verify property id.
class RentPaymentListAPIView(PropertyRequiredMixin, APIView):
    """
    API endpoint to list all rent Payments.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_obj = self.property_obj

        year = request.query_params.get("year")
        month = request.query_params.get("month")
        format_by_day = request.query_params.get("format_by_day", "false").lower()

        rent_payments = RentPayment.objects.filter(property=property_obj)

        # data ranged by year and month
        if year and month:
            try:
                year = int(year)
                month = int(month)
                if not (1 <= month <= 12):
                    raise ValueError("Month must be between 1 and 12")

                rent_payments = rent_payments.filter(date__year=year, date__month=month)
            except ValueError as e:
                return Response(
                    {"error": f"Invalid year or month provided: {e}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif year or month:
            return Response(
                {
                    "error": "Both 'year' and 'month' must be provided to filter by month."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # data grouped into payments by days
        if format_by_day and year and month:

            num_days = calendar.monthrange(year, month)[1]

            payments_by_day = [[] for _ in range(num_days)]

            serializer = RentPaymentSerializer(rent_payments, many=True)

            for payment_data in serializer.data:
                payment_date_str = payment_data.get("date")
                if payment_date_str:
                    try:
                        payment_day = date.fromisoformat(payment_date_str).day
                        payments_by_day[payment_day - 1].append(payment_data)
                    except ValueError:
                        pass

            return Response(payments_by_day)
        else:
            serializer = RentPaymentSerializer(rent_payments, many=True)
            return Response(serializer.data)

    def post(self, request):
        property_obj = self.property_obj

        serializer = RentPaymentSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            rent_payment_instance = serializer.save(
                user=request.user, property=property_obj
            )

            if serializer.validated_data["status"] == "paid":
                try:
                    revenue_account = property_obj.accounts.get(type="revenue")
                    revenue_account.update_balance(rent_payment_instance)
                except Account.DoesNotExist:
                    return Response(
                        {"error": "Revenue account not found for this property."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RentPaymentDetailAPIView(APIView):
    """
    API endpoint to retrieve a single rent payment by its primary key (id).
    """

    def get_object(self, pk):
        try:
            return RentPayment.objects.get(pk=pk, user=self.request.user)
        except RentPayment.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            rent_payment = self.get_object(pk)
        except RentPayment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RentPaymentSerializer(rent_payment)
        return Response(serializer.data)

    def put(self, request, pk):
        rent_payment = self.get_object(pk)
        property_obj = rent_payment.property
        previous_status = rent_payment.status

        if rent_payment:
            serializer = RentPaymentSerializer(
                rent_payment, data=request.data, partial=True
            )
            if serializer.is_valid():
                revenue_account = property_obj.accounts.get(type="revenue")

                # Was effecting balance
                if previous_status == "paid":
                    revenue_account.update_balance(rent_payment, is_reversal=True)

                updated_item = serializer.save()

                # Should now be effecting balance
                if updated_item.status == "paid" and not updated_item.is_deleted:
                    revenue_account.update_balance(updated_item)

                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)


class RentPaymentMonthSummaryAPIView(PropertyRequiredMixin, APIView):
    """
    API endpoint to summarize rent payments for a month.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_obj = self.property_obj
        year = request.query_params.get("year")
        month = request.query_params.get("month")

        if not year or not month or int(month) > 12 or int(month) < 1:
            return Response(
                {"error": "Both 'year' and 'month', in proper range, are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            year = int(year)
            month = int(month)
            if not (1 <= month <= 12):
                raise ValueError
        except ValueError:
            return Response(
                {"error": "Invalid 'year' or 'month' provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Total queryset for payments for the month
        monthly_payments_queryset = RentPayment.objects.filter(
            property=property_obj, date__year=year, date__month=month
        )

        # Sums together the total amount for the month
        grand_total_aggregation = monthly_payments_queryset.aggregate(
            overall_total=Coalesce(
                Sum("amount"), Value(0.00), output_field=CharField()
            ),
        )

        # Groups payments by status and sums their amounts
        status_summary = (
            monthly_payments_queryset.values("status")
            .annotate(
                total_amount=Coalesce(
                    Sum("amount"), Value(0.00), output_field=CharField()
                ),
            )
            .order_by("status")
        )

        payments_summary = [
            {"status": item["status"], "amount": item["total_amount"]}
            for item in status_summary
        ]

        return Response(
            {
                "year": year,
                "month": month,
                "payment_summary": payments_summary,
                "total_rent_payments": grand_total_aggregation["overall_total"] or 0,
            }
        )


class UserProfileAPIView(APIView):
    """
    API endpoint to retrieve and update the authenticated user's profile.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves the profile of the authenticated user.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """
        Updates the profile of the authenticated user.
        """

        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
