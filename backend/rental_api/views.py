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
)
from core_backend.models import Transaction, Account, Entity, Journal
from rest_framework.permissions import IsAuthenticated


class TransactionListAPIView(APIView):
    """
    API endpoint to list and create transactions.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.all()
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
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AccountSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
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


class EntityListAPIView(APIView):
    """
    API endpoint to list all entities.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        entites = Entity.objects.all()
        serializer = EntitySerializer(entites, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        print(request.data)
        serializer = EntitySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
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
        journals = Journal.objects.all()
        serializer = JournalSerializer(journals, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = JournalSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
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
