from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, CustomUserViewSet, ConversationViewSet, MessageViewSet, RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'users', CustomUserViewSet)
router.register(r'users', ConversationViewSet)
router.register(r'users', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name="register")
]