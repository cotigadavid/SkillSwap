from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer, ConversationSerializer, MessageSerializer, RegisterSerializer, SkillPublicSerializer, SkillSwapRequestSerializer
from .models import Skill, CustomUser, Conversation, Message, SkillSwapRequest
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    def get_serializer_context(self):
        return {'request': self.request}
    
class SkillPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillPublicSerializer

    def get_serializer_context(self):
        return {'request': self.request}
    
class SkillSwapRequestViewSet(viewsets.ModelViewSet):
    queryset = SkillSwapRequest.objects.all()
    serializer_class = SkillSwapRequestSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects
    serializer_class = MessageSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
