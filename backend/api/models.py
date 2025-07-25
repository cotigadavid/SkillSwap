from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from datetime import date

# Create your models here.


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
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    phone_number = models.CharField(max_length=10)
    birth_date = models.DateField(blank=True, null=True)
    residing_city = models.CharField(max_length=50, blank=True, null=True)
    residing_county = models.CharField(max_length=50, blank=True, null=True)

    @property
    def age(self):
        if self.birth_date is None:
            return None
        today = date.today()
        age = today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
        return age

    objects = CustomUserManager()  

    def __str__(self):
        return self.username

class Skill(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="skills", null=True, blank=True)
    skill_picture = models.ImageField(upload_to='skill_pictures/', blank=True, null=True)
    title = models.CharField(max_length=20)
    description = models.TextField(null=True, blank=True)
    difficulty = models.CharField(max_length=20, choices=[('easy', 'easy'), ('medium', 'medium'), ('hard', 'hard'), ('serious', 'serious')])
    hours_needed = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title

class Conversation(models.Model):
    participants = models.ManyToManyField(CustomUser, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id}"

class SkillSwapRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]

    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='request_sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='request_receiver')
    offered_skill = models.ManyToManyField(Skill, related_name='offered_skill')
    requested_skill = models.ManyToManyField(Skill, related_name='requested_skill')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

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
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} at {self.timestamp}"
    

class Review(models.Model):
    stars = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reviews")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='reviews')
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
