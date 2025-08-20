from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skills')  
router.register(r'users', CustomUserViewSet, basename='users')
router.register(r'conversations', ConversationViewSet, basename='conversations')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'requests', SkillSwapRequestViewSet, basename='requests')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name="register"),
    path('logout/', logout_view, name='logout'),
    path('mark-read/', markConversationAsRead, name="mark-read"),
    path('mark-received/', markConversationAsReceived, name="mark-received"),
    path('skills_search/', search_skills, name="skills-search"),
    path('confirm-email/<uidb64>/<token>/', ConfirmEmailView.as_view(), name="confirm-email"),
    path('reset-password/', ResetPasswordView.as_view(), name="reset-password"),
    path('choose-password/<uid>/<token>/', ChoosePasswordView.as_view(), name="choose-password"),
    path('generate-upload-url/', generate_upload_url),
]