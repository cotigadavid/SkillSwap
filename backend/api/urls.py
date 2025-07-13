from django.urls import path
import views
from rest_framework.routers import DefaultRouter
from views import SkillViewSet, CustomUserViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'users', CustomUserViewSet)

urlpatterns = [
    router.urls,

]