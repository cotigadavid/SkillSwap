from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings

def send_confirmation_email(user, request):
    print("Sending confimation email")
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    confirm_url = f"{settings.BACKEND_URL}/api/confirm-email/{uid}/{token}/"

    subject = "Confirm Your Email Address"
    message = f"Click the link to confirm your email: {confirm_url}"  # Fallback plain text

    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Welcome to SkillSwap, {user.username}!</h2>
        <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
        <p style="text-align: center;">
            <a href="{confirm_url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirm Email
            </a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr>
        <p style="font-size: 0.9em; color: #999;">SkillSwap Team</p>
    </body>
    </html>
    """

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        html_message=html_message
    )

def send_reset_password_email(user, request):
    print("Sending reset email")
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    reset_url = f"{settings.FRONTEND_URL}/choose-password/{user.pk}/{token}/"

    subject2 = "Reset Your Password"
    message2 = f"Click the link to reset your password: {reset_url}"  # Fallback plain text

    html_message2 = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Hello, {user.username}</h2>
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
        subject=subject2,
        message=message2,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        html_message=html_message2
    )
