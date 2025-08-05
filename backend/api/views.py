from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer, ConversationSerializer, MessageSerializer, RegisterSerializer, ReviewSerializer, SkillPublicSerializer, SkillSwapRequestSerializer, SkillRequestListSerializer
from .models import Skill, CustomUser, Conversation, Message, Review, SkillSwapRequest
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import models
from rest_framework.decorators import action, api_view, permission_classes
from django.http import JsonResponse
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.db.models.functions import Greatest

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

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def MarkConversationAsRead(request):
    print(request)
    conversation_id = request.data.get('conversation_id')
    if not conversation_id: 
        return Response({'error': 'Missing conversation_id'}, status=400)
    
    updated = Message.objects.filter(
        conversation_id=conversation_id,
        is_read=False,
    ).update(is_read=True)

    return Response({'updated': updated})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def MarkConversationAsReceived(request):
    conversation_id = request.data.get('conversation_id')
    if not conversation_id:
        return Response({'error': 'Missing conversation_id'}, status=400)
    
    updated = Message.objects.filter(
        conversation_id=conversation_id,
        is_received=False,
    ).update(is_received=True)

    return Response({'updated': updated})

@api_view(['GET'])
def search_skills(request):
    query = request.GET.get('query', '')

    if (query):
        vector = SearchVector('title')
        search_query = SearchQuery(query)
        skills = Skill.objects.annotate(
            rank=SearchRank(vector, search_query),
            similarity=TrigramSimilarity('title', query),
            score=Greatest(SearchRank(vector, search_query), TrigramSimilarity('title', query) - 0.3)
        ).filter(score__gt=0.0).order_by('-score')
    else:
        skills = Skill.objects.all()

    if (skills.count() == 0):
        skills = Skill.objects.all()

    serializer = SkillPublicSerializer(skills, many=True, context={"request": request})
    return Response(serializer.data)