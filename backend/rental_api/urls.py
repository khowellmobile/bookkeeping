# rental_api/urls.py
from django.urls import path
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
    path('rentPayments/', views.RentPaymentListAPIView.as_view(), name='rentPayment-list'),
    path('rentPayments/<int:pk>/', views.RentPaymentDetailAPIView.as_view(), name='rentPayment-detail'),
    path('rentPayments/monthsummary/', views.RentPaymentMonthSummaryAPIView.as_view(), name='rentPayment-monthsummary'),
    path('reports/', views.ReportHistoryListAPIView.as_view(), name='reports-list'),
    
    path('profile/', views.UserProfileAPIView.as_view(), name='user-profile'),
]