from django.shortcuts import render

# rental_api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TransactionSerializer, AccountSerializer
from core_backend.models import Transaction, Account
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

    def get(self, request, pk):
        try:
            transaction = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)


class AccountListAPIView(APIView):
    """
    API endpoint to list all accounts.
    """

    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)


class AccountDetailAPIView(APIView):
    """
    API endpoint to retrieve a single account by its primary key (id).
    """

    def get(self, request, pk):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AccountSerializer(account)
        return Response(serializer.data)
