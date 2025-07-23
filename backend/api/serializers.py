from rest_framework import serializers
from .models import Skill, CustomUser, Conversation, Message
from datetime import date
from .models import CustomUser

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

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

class CustomUserSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True)
    age = serializers.SerializerMethodField()

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
    

class ConversationSerializer(serializers.ModelSerializer):
    timestamp = serializers.ReadOnlyField()

    class Meta:
        model = Conversation
        fields = '__all__'

    def validate_participants(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("A conversation must have at least 2 participants.")
        return value
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['participants'] = [user.username for user in instance.participants.all()]
        return rep


class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.ReadOnlyField()

    class Meta:
        model = Message
        fields = '__all__'

    def validate(self, data):
        conversation = data['conversation']
        sender = data['sender']
        if sender not in conversation.participants.all():
            raise serializers.ValidationError("Sender must be a participant in the conversation.")
        return data
    

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