from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skills')  
router.register(r'users', CustomUserViewSet)
router.register(r'conversations', ConversationViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'skills-public', SkillPublicViewSet, basename='skills-public')  
router.register(r'requests', SkillSwapRequestViewSet, basename='requests')


urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name="register"),
    path('mark-read/', MarkConversationAsRead),
    path('mark-received/', MarkConversationAsReceived),
    path('skills_search/', search_skills),
    path('confirm-email/<uidb64>/<token>/', ConfirmEmailView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
    path('choose-password/<uid>/<token>/', ChoosePasswordView.as_view()),
]