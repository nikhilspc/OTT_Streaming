from rest_framework import serializers
from .models import SubscriptionPlan, Payment, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value


class PaymentSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='subscription_plan.plan_name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'status', 'razorpay_order_id', 'razorpay_payment_id', 'created_at']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.plan_name', read_only=True)

    class Meta:
        model = UserSubscription
        fields = '__all__'