from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer, ConversationSerializer, MessageSerializer, RegisterSerializer, ReviewSerializer, SkillPublicSerializer, SkillSwapRequestSerializer, SkillRequestListSerializer
from .models import Skill, CustomUser, Conversation, Message, Review, SkillSwapRequest
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import models
from rest_framework.decorators import action


# Create your views here.

class SkillViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer

    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}
    
class SkillPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillPublicSerializer

    def get_serializer_context(self):
        return {'request': self.request}
    
class SkillSwapRequestViewSet(viewsets.ModelViewSet):
    queryset = SkillSwapRequest.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'received', 'sent']:
            return SkillRequestListSerializer
        return SkillSwapRequestSerializer

    def get_queryset(self):
        return SkillSwapRequest.objects.filter(
            models.Q(sender=self.request.user) |
            models.Q(receiver=self.request.user)
        ).select_related('sender', 'receiver').prefetch_related(
            'offered_skill', 'requested_skill'
        ).order_by('-timestamp')

    def perform_create(self, serializer):
        
        receiver = serializer.validated_data.get('receiver')
        offered_skills = serializer.validated_data.get('offered_skill')
        requested_skills = serializer.validated_data.get('requested_skill')

        existing_requests = SkillSwapRequest.objects.filter(sender=self.request.user, receiver=receiver, status='pending')

        for ask in existing_requests:
            if ( set(ask.offered_skill.all()) == set(offered_skills)
                and set(ask.requested_skill.all()) == set(requested_skills)
            ):
                raise ValidationError("You already sent an exact same request!")
            
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'])
    def received(self, request):
        trade_requests = self.get_queryset().filter(
            receiver=request.user,
            status='pending'
        )

        serializer = self.get_serializer(trade_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        trade_requests = self.get_queryset().filter(
            sender=request.user,
        )

        serializer = self.get_serializer(trade_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def accept(self, request, pk=None):
        trade_request = self.get_object()

        if trade_request.receiver != request.user:
            return Response(
                {'error': 'You can only accept requests sent to you'},
                status=status.HTTP_403_FORBIDDEN
            )

        if trade_request.status != 'pending':
            return Response(
                {'error': f'Request is already {trade_request.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        trade_request.status = 'accepted'
        trade_request.save()

        serializer = self.get_serializer(trade_request)
        return Response({
            'message': 'Request accepted successfully',
            'request': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def decline(self, request, pk=None):

        trade_request = self.get_object()

        if trade_request.receiver != request.user:
            return Response(
                {'error': 'You can only decline requests sent to you.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if trade_request.status != 'pending':
            return Response(
                {'error': f'Request is already {trade_request.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        trade_request.status = 'declined'
        trade_request.save()

        serializer = self.get_serializer(trade_request)
        return Response({
            'message': 'Request declined successfully',
            'request': serializer.data
        }, status=status.HTTP_200_OK)

class SkillPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillPublicSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewView(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer