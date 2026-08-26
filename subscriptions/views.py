import razorpay
from decouple import config
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SubscriptionPlan, Payment, UserSubscription
from .serializers import SubscriptionPlanSerializer, PaymentSerializer, UserSubscriptionSerializer
from catalog.permissions import IsAdminOrSubAdmin

# Razorpay client setup
client = razorpay.Client(auth=(config('RAZORPAY_KEY_ID'), config('RAZORPAY_KEY_SECRET')))


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAdminOrSubAdmin]


class CreateOrderView(APIView):
    """Step 1: User plan select karta hai, hum Razorpay order banate hain"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Invalid subscription plan"}, status=status.HTTP_404_NOT_FOUND)

        amount_paise = int(plan.price * 100)  # Razorpay paise mein leta hai (₹1 = 100 paise)

        razorpay_order = client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1
        })

        # Database mein pending payment record banao
        payment = Payment.objects.create(
            user=request.user,
            subscription_plan=plan,
            amount=plan.price,
            razorpay_order_id=razorpay_order['id'],
            status='pending'
        )

        return Response({
            "order_id": razorpay_order['id'],
            "amount": amount_paise,
            "currency": "INR",
            "key_id": config('RAZORPAY_KEY_ID'),
            "payment_db_id": payment.id
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """Step 2: Payment hone ke baad Razorpay se aaya signature verify karte hain"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        try:
            payment = Payment.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)

        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            payment.status = 'failed'
            payment.save()
            return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

        # Signature valid hai — payment successful mark karo
        payment.razorpay_payment_id = razorpay_payment_id
        payment.status = 'success'
        payment.save()

        # User ka subscription activate/extend karo
        plan = payment.subscription_plan
        end_date = timezone.now() + timedelta(days=plan.duration_days)

        UserSubscription.objects.update_or_create(
            user=request.user,
            defaults={'plan': plan, 'end_date': end_date, 'is_active': True}
        )

        return Response({"message": "Payment verified and subscription activated"}, status=status.HTTP_200_OK)


class MySubscriptionView(APIView):
    """User apna current active subscription check kar sake"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            sub = UserSubscription.objects.get(user=request.user)
            serializer = UserSubscriptionSerializer(sub)
            return Response(serializer.data)
        except UserSubscription.DoesNotExist:
            return Response({"message": "No active subscription"}, status=status.HTTP_404_NOT_FOUND)