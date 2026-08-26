from rest_framework import viewsets, generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, SubCategory, Provider, Product, Review
from .serializers import (
    CategorySerializer, SubCategorySerializer, ProviderSerializer,
    ProductSerializer, ReviewSerializer, RegisterSerializer
)
from .permissions import IsAdminOrSubAdmin


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrSubAdmin]


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAdminOrSubAdmin]


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    permission_classes = [IsAdminOrSubAdmin]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrSubAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'sub_category', 'provider']
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Users apna hi review edit/delete kar sakein
        return Review.objects.all()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]