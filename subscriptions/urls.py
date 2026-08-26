from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import SubscriptionPlanViewSet, CreateOrderView, VerifyPaymentView, MySubscriptionView

router = DefaultRouter()
router.register('subscriptions', SubscriptionPlanViewSet)

urlpatterns = [
    path('payments/create-order/', CreateOrderView.as_view(), name='create-order'),
    path('payments/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('my-subscription/', MySubscriptionView.as_view(), name='my-subscription'),
] + router.urls