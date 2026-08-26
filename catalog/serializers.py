from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, SubCategory, Provider, Product, Review, UserProfile


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SubCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = SubCategory
        fields = '__all__'


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    sub_category_name = serializers.CharField(source='sub_category.name', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    average_rating = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

    def validate_video_url(self, value):
        if not value.startswith('http'):
            raise serializers.ValidationError("Video URL must be a valid link starting with http/https.")
        return value

    def validate(self, data):
        # Sub-category ka category match hona chahiye
        sub_category = data.get('sub_category')
        category = data.get('category')
        if sub_category and category and sub_category.category_id != category.id:
            raise serializers.ValidationError("Selected sub-category does not belong to the selected category.")
        return data


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role='user')
        return user