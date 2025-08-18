from django.contrib import admin
from .models import CustomUser, Skill, Conversation, Message
from django.contrib.auth.admin import UserAdmin

# Register your models here.

admin.site.register(Skill)
admin.site.register(Conversation)
admin.site.register(Message)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('profile_picture', 'phone_number', 'birth_date', 'residing_city', 'residing_county', 'skills')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
