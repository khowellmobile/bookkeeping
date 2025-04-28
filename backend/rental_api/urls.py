# rental_api/urls.py
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('transactions/', views.TransactionListAPIView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', views.TransactionDetailAPIView.as_view(), name='transaction-detail'),
    path('accounts/', views.AccountListAPIView.as_view(), name='account-list'),
    path('accounts/<int:pk>/', views.AccountDetailAPIView.as_view(), name='account-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]