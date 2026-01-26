from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import logging

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=60,
    retry_kwargs={'max_retries': 3},
)
def send_confirmation_email_task(self, user_id, username, email):
    from api.models import CustomUser
    
    try:
        user = CustomUser.objects.get(id=user_id)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        confirm_url = f"{settings.BACKEND_URL}/api/confirm-email/{uid}/{token}/"
        
        subject = "Confirm Your Email Address"
        message = f"Click the link to confirm your email: {confirm_url}"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Welcome to SkillSwap, {username}!</h2>
            <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="{confirm_url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Confirm Email
                </a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr>
            <p style="font-size: 0.9em; color: #999;">SkillSwap Team</p>
        </body>
        </html>
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message
        )
        logger.info(f"Confirmation email sent to {email}")
        
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {e}")
        raise


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=60,
    retry_kwargs={'max_retries': 3},
)
def send_reset_password_email_task(self, user_id, username, email):
    from api.models import CustomUser
    
    try:
        user = CustomUser.objects.get(id=user_id)
        token = default_token_generator.make_token(user)
        
        reset_url = f"{settings.FRONTEND_URL}/choose-password/{user.pk}/{token}/"
        
        subject = "Reset Your Password"
        message = f"Click the link to reset your password: {reset_url}"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Hello, {username}</h2>
            <p>We received a request to reset your password for your SkillSwap account.</p>
            <p>Please click the button below to choose a new password:</p>
            <p style="text-align: center;">
                <a href="{reset_url}" style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <hr>
            <p style="font-size: 0.9em; color: #999;">SkillSwap Team</p>
        </body>
        </html>
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message
        )
        logger.info(f"Password reset email sent to {email}")
        
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")
        raise
