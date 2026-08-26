from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('subadmin', 'Sub Admin'),
        ('user', 'User'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name} → {self.name}"

    class Meta:
        verbose_name_plural = "Sub Categories"
        unique_together = ('category', 'name')  # same category mein duplicate naam na ho


class Provider(models.Model):
    name = models.CharField(max_length=150)
    contact_email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    RATING_CHOICES = [
        ('U', 'Universal'),
        ('UA', 'Parental Guidance'),
        ('A', 'Adult'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    video_url = models.URLField()  # YouTube/Vimeo embed link
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='products')
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name='products')
    release_date = models.DateField(null=True, blank=True)
    content_rating = models.CharField(max_length=2, choices=RATING_CHOICES, default='U')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 0


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()  # 1 to 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.title} ({self.rating}★)"

    class Meta:
        unique_together = ('product', 'user')  # ek user ek product pe ek hi review de sake