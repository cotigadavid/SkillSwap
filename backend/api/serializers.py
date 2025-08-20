from rest_framework import serializers
from .models import Skill, CustomUser, Conversation, Message, MessageAttachment, Review, SkillSwapRequest
from datetime import date
from .models import CustomUser
from django.db.models import Avg
from decouple import config

class SkillSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)

    def validate_title(self, value):
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError('Title cannot contain digits.')
         
        return value

    def validate(self, data):
        difficulty = data.get('difficulty')
        hoursNeeded = data.get('hours_needed')

        if hoursNeeded is None:
            return data
        
        if difficulty.lower() == 'easy':
            if hoursNeeded < 1 or hoursNeeded > 20:
                raise serializers.ValidationError('Easy skills should require between 1 and 20 hours of practice')
        
        elif difficulty.lower() == 'medium':
            if hoursNeeded < 20 or hoursNeeded > 50:
                raise serializers.ValidationError('Medium skills should require between 20 and 50 hours of practice')
        
        elif difficulty.lower() == 'hard':
            if hoursNeeded < 50 or hoursNeeded > 100:
                raise serializers.ValidationError('Hard skills should require between 50 and 100 hours of practice')

        elif difficulty.lower() == 'serious':
            if hoursNeeded < 100:
                raise serializers.ValidationError('Serious skills should require more than 100 hours of practice')

        return data
    
    def get_user(self, obj):
        user = obj.user
        return {
            'id': user.id,
            'name': f"{user.last_name} {user.first_name}",
            'profile': user.profile_picture if user.profile_picture else None,
            'location': f"{user.residing_city}, {user.residing_county}",
        }
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()
        count = reviews.count()
        average = reviews.aggregate(rating=Avg('stars'))['rating']

        return {'count': count, 'rating': average}
    

class CustomUserSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True)
    age = serializers.SerializerMethodField()
    #profile_picture = serializers.ImageField(required=False) 

    def get_age(self, obj):
        return obj.age

    class Meta:
        model = CustomUser
        fields = '__all__'

    def validate_phone_number(self, value):
        if (len(value) != 10 or any(not char.isdigit() for char in value)):
            raise serializers.ValidationError("Phone number must contain 10 digits")
        return value
    
    def validate_birth_date(self, value):
        today = date.today()

        if value > today:
            raise serializers.ValidationError("Birth date cannot be in the future.")

        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        
        if age > 120:
            raise serializers.ValidationError("Invalid age. Must be less than 120 years.")

        if age < 16:
            raise serializers.ValidationError("You must be at least 16 years old.")

        return value
    
    def validate_residing_city(self, value):
        if any(not char.isalpha() for char in value):
            raise serializers.ValidationError("Residing city must only contain letter!")
        return value
        
    def validate_residing_county(self, value):
        if any(not char.isalpha() for char in value):
            raise serializers.ValidationError("Residing county must only contain letter!")
        return value

    def validate(self, data):
        return data
    
class SkillSwapRequestSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    timestamp = serializers.ReadOnlyField()
    offered_skill = serializers.PrimaryKeyRelatedField(many=True, queryset=Skill.objects.all())
    requested_skill = serializers.PrimaryKeyRelatedField(many=True, queryset=Skill.objects.all())

    class Meta:
        model = SkillSwapRequest
        fields = ['sender', 'receiver', 'offered_skill', 'requested_skill', 'status', 'message', 'timestamp']
    
    def create(self, validated_data):
        offered_skills = validated_data.pop('offered_skill')
        requested_skills = validated_data.pop('requested_skill')
        skill_swap_request = SkillSwapRequest.objects.create(**validated_data)
        skill_swap_request.offered_skill.set(offered_skills)
        skill_swap_request.requested_skill.set(requested_skills)
        return skill_swap_request

class SkillRequestListSerializer(serializers.ModelSerializer):

    sender = serializers.SerializerMethodField()
    receiver = serializers.IntegerField(source='receiver.id', read_only=True)
    offered_skill = SkillSerializer(many=True, read_only=True)
    requested_skill = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = SkillSwapRequest
        fields = ['id', 'sender', 'receiver', 'offered_skill', 'requested_skill', 'status', 'message', 'timestamp']
    
    def get_sender(self, obj):
        sender = obj.sender
        return {
            "id": sender.id,
            "name": f"{sender.last_name} {sender.first_name}",
            "profile_picture" : (
                self.context['request'].build_absolute_uri(obj.sender.profile_picture)
                if obj.sender.profile_picture else None
            ) 
        }

class ConversationSerializer(serializers.ModelSerializer):
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Conversation
        fields = '__all__'

    def validate_participants(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("A conversation must have at least 2 participants.")
        return value


class MessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageAttachment
        fields = '__all__'

# class MessageSerializer(serializers.ModelSerializer):
#     attachments = MessageAttachmentSerializer(many=True, read_only=True)
#     created_at = serializers.ReadOnlyField()

#     class Meta:
#         model = Message
#         fields = '__all__'

#     def create(self, validated_data):
#         request = self.context.get('request')
#         files = request.FILES.getlist('attachments')
#         message = Message.objects.create(**validated_data)
#         for file in files:
#             filename = file
#             MessageAttachment.objects.create(message=message, file=file, filename=filename)
#         return message
    
class MessageSerializer(serializers.ModelSerializer):
    attachments = MessageAttachmentSerializer(many=True, read_only=True)
    attachment_keys = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Message
        fields = '__all__'

    def create(self, validated_data):
        attachment_keys = validated_data.pop('attachment_keys', [])
        message = Message.objects.create(**validated_data)
        
        for key in attachment_keys:
            # Assuming your MessageAttachment model has a field for the file key/URL
            # You'll need to adjust this based on your model structure
            MessageAttachment.objects.create(
                message=message, 
                file=key,
                filename=key.split('_')[-1]  # extract filename from key
            )
        return message


class RegisterSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = CustomUser
            fields = ('username', 'email', 'password')

        username = serializers.CharField(max_length=100)
        email = serializers.EmailField(required=True)
        password = serializers.CharField(write_only=True, min_length=6)

        def validate_username(self, value):
            if CustomUser.objects.filter(username=value).exists():
                raise serializers.ValidationError("Username exists already.")
            return value
        
        def validate_email(self, value):
            if CustomUser.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already registered.")
            return value

        def create(self, validated_data):
                user = CustomUser.objects.create_user(
                    username=validated_data['username'],
                    email=validated_data['email'],
                    password=validated_data['password']
                )
                return user
        
class ReviewSerializer(serializers.ModelSerializer):
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Review
        fields = '__all__'
