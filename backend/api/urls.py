from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, CustomUserViewSet, ConversationViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'users', CustomUserViewSet)
router.register(r'users', ConversationViewSet)
router.register(r'users', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]