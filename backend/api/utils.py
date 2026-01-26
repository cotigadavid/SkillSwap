#these functions who async tasks using Celery

from api.tasks import send_confirmation_email_task, send_reset_password_email_task

def send_confirmation_email(user, request):
    send_confirmation_email_task.delay(user.id, user.username, user.email)


def send_reset_password_email(user, request):
    send_reset_password_email_task.delay(user.id, user.username, user.email)
