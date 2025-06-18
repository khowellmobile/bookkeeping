# rental_api/urls.py
from django.urls import path,include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('transactions/', views.TransactionListAPIView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', views.TransactionDetailAPIView.as_view(), name='transaction-detail'),
    path('accounts/', views.AccountListAPIView.as_view(), name='account-list'),
    path('accounts/<int:pk>/', views.AccountDetailAPIView.as_view(), name='account-detail'),
    path('entities/', views.EntityListAPIView.as_view(), name='entity-list'),
    path('entities/<int:pk>/', views.EntityDetailAPIView.as_view(), name='entity-detail'),
    path('journals/', views.JournalListAPIView.as_view(), name='journal-list'),
    path('journals/<int:pk>/', views.JournalDetailAPIView.as_view(), name='journal-detail'),
    path('properties/', views.PropertyListAPIView.as_view(), name='property-list'),
    path('properties/<int:pk>/', views.PropertyDetailAPIView.as_view(), name='property-detail'),
]