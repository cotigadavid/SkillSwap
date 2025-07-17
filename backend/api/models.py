from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

# Create your models here.

class Skill(models.Model):
    title = models.CharField(max_length=20)
    difficulty = models.CharField(max_length=20, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard'), ('serious', 'Serious')])
    hours_needed = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title
    
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError("Email required.")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=10)
    birth_date = models.DateField(blank=True, null=True)
    residing_city = models.CharField(max_length=50, blank=True, null=True)
    residing_county = models.CharField(max_length=50, blank=True, null=True)
    skills = models.ManyToManyField(Skill, related_name='users', null=True, blank=True)

    objects = CustomUserManager()  

    def __str__(self):
        return self.username


class Conversation(models.Model):
    participants = models.ManyToManyField(CustomUser, related_name='conversations')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id}"


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        null=True
    )

    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.CharField(max_length=1000)
    is_read = models.BooleanField(default=False)
    is_received = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} at {self.timestamp}"