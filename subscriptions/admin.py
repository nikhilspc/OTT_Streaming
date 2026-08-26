from django.contrib import admin
from .models import SubscriptionPlan, Payment, UserSubscription

admin.site.register(SubscriptionPlan)
admin.site.register(Payment)
admin.site.register(UserSubscription)