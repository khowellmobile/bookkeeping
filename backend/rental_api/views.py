from django.shortcuts import render

# rental_api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    TransactionSerializer,
    AccountSerializer,
    EntitySerializer,
    JournalSerializer,
    PropertySerializer,
)
from core_backend.models import Transaction, Account, Entity, Journal, Property
from rest_framework.permissions import IsAuthenticated


class TransactionListAPIView(APIView):
    """
    API endpoint to list and create transactions.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        account_id = request.query_params.get("account_id")
        entity_id = request.query_params.get("entity_id")

        if account_id:
            try:
                transactions = Transaction.objects.filter(
                    user=request.user, account_id=account_id
                )
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
                transactions = Transaction.objects.filter(
                    user=request.user, entity_id=entity_id
                )
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

    def post(self, request):
        data = request.data

        if not isinstance(data, list):
            return Response(
                {"error": "Expected a list of transactions."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved_transactions = []
        for item in data:
            serializer = TransactionSerializer(data=item, context={"request": request})
            if serializer.is_valid():
                serializer.save()
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
        if transaction:
            serializer = TransactionSerializer(
                transaction, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        transaction = self.get_object(pk)
        if transaction:
            transaction.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class AccountListAPIView(APIView):
    """
    API endpoint to list all accounts.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_id = request.query_params.get("property_id")
        account_queryset = Account.objects.filter(user=request.user)

        if property_id:
            try:
                property_obj = Property.objects.get(id=property_id, user=request.user)
                account_queryset = property_obj.accounts.all()
            except Property.DoesNotExist:
                return Response(
                    {
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid property_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = AccountSerializer(account_queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        property_id = request.query_params.get("property_id")

        if property_id:
            try:
                property_obj = Property.objects.get(id=property_id, user=request.user)
                serializer = AccountSerializer(
                    data=request.data, context={"request": request}
                )

                if serializer.is_valid():
                    new_account = serializer.save()
                    property_obj.accounts.add(new_account)

                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

            except Property.DoesNotExist:
                return Response(
                    {
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid property_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"error": "property_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )


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


class EntityListAPIView(APIView):
    """
    API endpoint to list all entities.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_id = request.query_params.get("property_id")
        entities = Entity.objects.filter(user=request.user)

        if property_id:
            try:
                entities = entities.filter(property_id=property_id)
            except Property.DoesNotExist:
                return Response(
                    {
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid property_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = EntitySerializer(entities, many=True)
        return Response(serializer.data)

    def post(self, request):
        property_id = request.query_params.get("property_id")

        if property_id:
            try:
                property_obj = Property.objects.get(id=property_id, user=request.user)
            except Property.DoesNotExist:
                return Response(
                    {
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid property_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"error": "property_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
        try:
            entity = Entity.objects.get(pk=pk)
        except Entity.DoesNotExist:
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


class JournalListAPIView(APIView):
    """
    API endpoint to list journals.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_id = request.query_params.get("property_id")
        journals = Journal.objects.filter(user=request.user)

        if property_id:
            try:
                journals = journals.filter(property_id=property_id)
            except Property.DoesNotExist:
                return Response(
                    {
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid property_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = JournalSerializer(journals, many=True)
        return Response(serializer.data)

    def post(self, request):
        property_id = request.query_params.get("property_id")

        if property_id:
            try:
                property_obj = Property.objects.get(id=property_id, user=request.user)
            except Property.DoesNotExist:
                return Response(
                    {
                        "error": "Property with this ID does not exist or does not belong to the user."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except ValueError:
                return Response(
                    {"error": "Invalid property_id provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"error": "property_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = JournalSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save(user=request.user, property=property_obj)
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
        if journal:
            serializer = JournalSerializer(journal, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        journal = self.get_object(pk)
        if journal:
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
            serializer.save()
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
