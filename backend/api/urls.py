from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, CustomUserViewSet, ConversationViewSet, MessageViewSet
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
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]