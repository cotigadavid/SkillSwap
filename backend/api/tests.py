from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class SkillAPITestCase(APITestCase):
    def test_create_skill_invalid_hours(self):

        url = reverse('skill-list')
        data = {
            "title": "Python",
            "difficulty": "easy",
            "hours_needed": -1
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('hours_needed', response.data)


    def test_create_skill_success(self):
        url = reverse('skill-list')
        data = {
            "title": "Python",
            "difficulty": "medium",
            "hours_needed": 30
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('hours_needed', response.data)