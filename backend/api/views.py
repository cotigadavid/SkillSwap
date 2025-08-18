from django.shortcuts import render

from .serializers import SkillSerializer, CustomUserSerializer, ConversationSerializer, MessageSerializer, RegisterSerializer, ReviewSerializer, SkillSwapRequestSerializer, SkillRequestListSerializer
from .models import Skill, CustomUser, Conversation, Message, Review, SkillSwapRequest
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.db import models
from rest_framework.decorators import action, api_view, permission_classes
from django.http import JsonResponse
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.db.models.functions import Greatest
from rest_framework.pagination import PageNumberPagination
from .utils import send_confirmation_email, send_reset_password_email
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.conf import settings
from .permissions import IsOwner
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.db.models import Q


# Create your views here.

class SkillViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer

    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user).select_related('user').prefetch_related('reviews')

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
    

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsOwner]

    @action(detail=False, methods=['post'])
    def create_conversation(self, request):
        User = get_user_model()

        sender = request.user
        receiver_id = request.data.get('receiver_id')

        if not receiver_id:
            return Response({'error': 'receiver_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'Receiver not found'}, status=status.HTTP_404_NOT_FOUND)

        convo = Conversation.objects.filter(
            (Q(sender=sender) & Q(receiver=receiver)) | (Q(sender=receiver) & Q(receiver=sender))
        ).first()

        if convo:
            serializer = self.get_serializer(convo)
            return Response(serializer.data, status=status.HTTP_200_OK)

        convo = Conversation.objects.create(sender=sender, receiver=receiver)
        serializer = self.get_serializer(convo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()

            send_confirmation_email(user, request)

            return Response({
                "message": "User created successfully",
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def MarkConversationAsRead(request):
    print(request.data.get('conversation_id'))
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

    base_queryset = Skill.objects.select_related('user').prefetch_related('reviews')

    if (query):
        vector = SearchVector('title')
        search_query = SearchQuery(query)
        skills = base_queryset.annotate(
            rank=SearchRank(vector, search_query),
            similarity=TrigramSimilarity('title', query),
            score=Greatest(SearchRank(vector, search_query), TrigramSimilarity('title', query) - 0.3)
        ).filter(score__gt=0.0).order_by('-score')
    else:
        skills = base_queryset.all()

    if (skills.count() == 0):
        skills = base_queryset.all()

    paginator = PageNumberPagination()
    paginator.page_size = 20 

    result_page = paginator.paginate_queryset(skills, request)
    serializer = SkillSerializer(result_page, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid link"}, status=400)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return redirect(f"{settings.FRONTEND_URL}/confirm-email/")
        return Response({"error": "Invalid or expired token"}, status=400)
    
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')

        User = get_user_model()
        user = User.objects.get(email=email)

        print("GERE")

        send_reset_password_email(user, request)

        return Response({"message": "Email sent"}, status=status.HTTP_200_OK)

class ChoosePasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uid, token):

        data = request.data
        newPassword = data.get('newPassword')

        user = get_user_model().objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            user.set_password(newPassword) 
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid or expired token"}, status=400)


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) 

        user = serializer.user
        
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh = response.data["refresh"]
            access = response.data["access"]

            response.set_cookie(
                key='access_token',
                value=access,
                max_age=5 * 60,  # 5 minutes
                httponly=True,
                secure=True,  
                samesite='None',
                path='/'
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh,
                max_age=7 * 24 * 60 * 60,  # 7 days
                httponly=True,
                secure=True,
                samesite='None',
                path='/' 
            )

            print(access)
            print(refresh)

            del response.data["access"]
            del response.data["refresh"]

            response.data["userId"] = user.id
            response.data["username"] = user.username

        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            raise AuthenticationFailed("No refresh token provided in cookies")

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
        except Exception:
            raise AuthenticationFailed("Invalid or expired refresh token")

        response = Response({'detail': 'Access token refreshed'}, status=status.HTTP_200_OK)
        cookie_max_age = 7 * 24 * 60 * 60

        response.set_cookie(
            key='access_token',
            value=access_token,
            max_age=cookie_max_age,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )

        return response
