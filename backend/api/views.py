from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer
from .models import Skill, CustomUser
from rest_framework import viewsets 

# Create your views here.

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer