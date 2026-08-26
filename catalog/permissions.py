from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Sirf Admin ko allow karta hai — Delete operations ke liye"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.userprofile.role == 'admin'
        except:
            return False


class IsAdminOrSubAdmin(permissions.BasePermission):
    """GET sabko allowed, POST/PUT/PATCH Admin+Sub-admin, DELETE sirf Admin"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # sab dekh sakte hain

        if not request.user.is_authenticated:
            return False

        try:
            role = request.user.userprofile.role
        except:
            return False

        if request.method == 'DELETE':
            return role == 'admin'

        return role in ['admin', 'subadmin']  # Add/Edit dono kar sakte hain