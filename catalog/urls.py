from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    CategoryViewSet, SubCategoryViewSet, ProviderViewSet,
    ProductViewSet, ReviewViewSet, RegisterView
)

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('subcategories', SubCategoryViewSet)
router.register('providers', ProviderViewSet)
router.register('products', ProductViewSet)
router.register('reviews', ReviewViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
] + router.urls