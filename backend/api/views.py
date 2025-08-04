from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer, ConversationSerializer, MessageSerializer, RegisterSerializer, ReviewSerializer, SkillPublicSerializer, SkillSwapRequestSerializer
from .models import Skill, CustomUser, Conversation, Message, Review, SkillSwapRequest
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.db.models.functions import Greatest

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