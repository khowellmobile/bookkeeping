# rental_api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('transactions/', views.TransactionListAPIView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', views.TransactionDetailAPIView.as_view(), name='transaction-detail'),
]