from django.db import models
from django.contrib.auth.models import User


class SubscriptionPlan(models.Model):
    QUALITY_CHOICES = [
        ('SD', 'Standard Definition'),
        ('HD', 'High Definition'),
        ('4K', 'Ultra HD 4K'),
    ]

    plan_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField(help_text="Plan duration in days (e.g. 30, 365)")
    features = models.TextField(help_text="Comma-separated features")
    quality_tier = models.CharField(max_length=2, choices=QUALITY_CHOICES, default='SD')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.plan_name} - ₹{self.price}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.subscription_plan.plan_name} ({self.status})"


class UserSubscription(models.Model):
    """Tracks which plan a user currently has active."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='active_subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.plan_name}"