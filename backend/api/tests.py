from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
from .models import Skill, SkillSwapRequest, Conversation, Message, Review

User = get_user_model()

class SkillSwapAPITests(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="pass123", email="alice@example.com", is_active=True)
        self.user2 = User.objects.create_user(username="bob", password="pass123", email="bob@example.com", is_active=True)

    def auth_cookie_login(self, username, password):
        url = reverse("token_obtain_pair")  # your JWT token obtain endpoint name
        res = self.client.post(url, {"username": username, "password": password}, format="json")
        self.assertEqual(res.status_code, 200)
        # Set cookies manually for authenticated requests
        if "access_token" in res.cookies:
            self.client.cookies["access_token"] = res.cookies["access_token"].value
        if "refresh_token" in res.cookies:
            self.client.cookies["refresh_token"] = res.cookies["refresh_token"].value

    def test_register_and_confirm_email(self):
        with patch("api.views.send_confirmation_email") as mock_email:
            res = self.client.post(reverse("register"), {
                "username": "charlie",
                "password": "Testpass123!",
                "email": "charlie@example.com"
            })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="charlie")
        self.assertFalse(user.is_active)
        mock_email.assert_called_once()

    def test_login_and_create_skill(self):
        self.auth_cookie_login("alice", "pass123")
        res = self.client.post(reverse("skills-list"), {
            "title": "Python Tutoring",
            "difficulty": "easy",
            "hours_needed": 20,
            "description": "Teach Python basics"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Skill.objects.filter(user=self.user1).count(), 1)

    def test_skill_public_list(self):
        Skill.objects.create(user=self.user1, title="Django", difficulty="medium", hours_needed=15)
        Skill.objects.create(user=self.user2, title="Cooking", difficulty="easy", hours_needed=5)
        self.auth_cookie_login("alice", "pass123")
        res = self.client.get(reverse("skills-list"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_skill_swap_request_flow(self):
        self.auth_cookie_login("alice", "pass123")
        skill1 = Skill.objects.create(user=self.user1, title="Guitar", description="Teach guitar")
        skill2 = Skill.objects.create(user=self.user2, title="Cooking", description="Teach cooking")

        res = self.client.post(reverse("requests-list"), {
            "receiver": self.user2.id,
            "offered_skill": [skill1.id],
            "requested_skill": [skill2.id]
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Accept as receiver
        self.auth_cookie_login("bob", "pass123")
        req = SkillSwapRequest.objects.first()
        res = self.client.patch(reverse("requests-detail", args=[req.id]), {
            "status": "accepted"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        req.refresh_from_db()
        self.assertEqual(req.status, "accepted")

    def test_skill_swap_request_decline(self):
        self.auth_cookie_login("alice", "pass123")
        skill1 = Skill.objects.create(user=self.user1, title="Guitar", description="Teach guitar")
        skill2 = Skill.objects.create(user=self.user2, title="Cooking", description="Teach cooking")
        req = SkillSwapRequest.objects.create(sender=self.user1, receiver=self.user2)
        req.offered_skill.add(skill1)
        req.requested_skill.add(skill2)

        self.auth_cookie_login("bob", "pass123")
        res = self.client.patch(reverse("requests-detail", args=[req.id]), {
            "status": "declined"
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        req.refresh_from_db()
        self.assertEqual(req.status, "declined")

    def test_received_and_sent_requests_endpoints(self):
        self.auth_cookie_login("alice", "pass123")
        # Create two requests to test filtering
        skill1 = Skill.objects.create(user=self.user1, title="Guitar")
        skill2 = Skill.objects.create(user=self.user2, title="Cooking")
        SkillSwapRequest.objects.create(sender=self.user1, receiver=self.user2)
        SkillSwapRequest.objects.create(sender=self.user2, receiver=self.user1)

        res = self.client.get(reverse("requests-list"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.get(reverse("requests-list"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_conversation_and_message_flow(self):
        self.auth_cookie_login("alice", "pass123")
        res = self.client.post(reverse("conversations-create-conversation"), {
            "receiver_id": self.user2.id,
            "sender_id": self.user1.id
        }, format="json")
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        convo_id = res.data["id"]

        msg_res = self.client.post(reverse("messages-list"), {
            "conversation": convo_id,
            "text": "Hello Bob!"
        }, format="json")
        self.assertEqual(msg_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)

    def test_mark_conversation_as_read(self):
        convo = Conversation.objects.create(sender=self.user1, receiver=self.user2)
        msg = Message.objects.create(conversation=convo, text="Hello")
        self.auth_cookie_login("alice", "pass123")
        res = self.client.post(reverse("mark-read"), {"conversation_id": convo.id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        msg.refresh_from_db()
        self.assertTrue(msg.is_read)

    def test_mark_conversation_as_received(self):
        convo = Conversation.objects.create(sender=self.user1, receiver=self.user2)
        msg = Message.objects.create(conversation=convo, text="Hello")
        self.auth_cookie_login("alice", "pass123")
        res = self.client.post(reverse("mark-received"), {"conversation_id": convo.id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        msg.refresh_from_db()
        self.assertTrue(msg.is_received)

    def test_review_creation(self):
        skill = Skill.objects.create(user=self.user1, title="Piano", difficulty="hard", hours_needed=30)
        self.auth_cookie_login("alice", "pass123")
        res = self.client.post(reverse("reviews-list"), {
            "stars": 5,
            "user": self.user1.id,
            "skill": skill.id,
            "comment": "Great skill!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_confirm_email(self):
        user = User.objects.create_user(username="newuser", email="newuser@example.com", password="pass123", is_active=False)
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        res = self.client.get(reverse("confirm-email", args=[uidb64, token]))
        # Expect a redirect (302) to frontend URL or 200 if handled differently
        self.assertIn(res.status_code, [302, 200])

    @patch("api.views.send_reset_password_email")
    def test_password_reset_flow(self, mock_send_email):
        res = self.client.post(reverse("reset-password"), {"email": self.user1.email})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        mock_send_email.assert_called_once()

    def test_choose_password(self):
        user = User.objects.create_user(username="choosepw", email="choosepw@example.com", password="oldpass", is_active=True)
        from django.contrib.auth.tokens import default_token_generator
        token = default_token_generator.make_token(user)
        new_password = "newSecurePass123!"

        res = self.client.post(reverse("choose-password", args=[user.pk, token]), {"newPassword": new_password})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Verify password changed
        user.refresh_from_db()
        self.assertTrue(user.check_password(new_password))

    def test_cookie_token_refresh(self):
        # First login to get refresh token cookie
        login_res = self.client.post(reverse("token_obtain_pair"), {"username": "alice", "password": "pass123"}, format="json")
        refresh_token = login_res.cookies.get("refresh_token").value

        self.client.cookies["refresh_token"] = refresh_token
        res = self.client.post(reverse("token_refresh"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", res.cookies)

