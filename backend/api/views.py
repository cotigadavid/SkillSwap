from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer, ConversationSerializer, MessageSerializer
from .models import Skill, CustomUser, Conversation, Message
from rest_framework import viewsets 

# Create your views here.

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects
    serializer_class = MessageSerializer