from django.core.management.base import BaseCommand
from api.models import CustomUser
from faker import Faker
import random

fake = Faker('ro_RO')  # 🇷🇴 România

ORASE_SI_JUDETE = {
    "Cluj-Napoca": "Cluj",
    "Constanța": "Constanța",
    "Iași": "Iași",
    "Brașov": "Brașov",
    "Timișoara": "Timiș",
    "Bacău": "Bacău",
    "Oradea": "Bihor",
    "Craiova": "Dolj",
    "Buzău": "Buzău",
    "Sibiu": "Sibiu",
    "Ploiești": "Prahova",
    "Satu Mare": "Satu Mare",
    "Alba Iulia": "Alba",
    "Arad": "Arad",
    "Baia Mare": "Maramureș",
    "Botoșani": "Botoșani"
}


class Command(BaseCommand):
    help = 'Populează baza de date cu utilizatori români (cu first_name, last_name și email generat)'

    def handle(self, *args, **kwargs):
        numar_utilizatori = 10  # poți modifica

        for _ in range(numar_utilizatori):
            first_name = fake.first_name()
            last_name = fake.last_name()
            birth_date = fake.date_of_birth(minimum_age=18, maximum_age=60)

            base_username = f"{first_name.lower()}{last_name.lower()}"
            username = base_username
            suffix = 1

            # Asigură unicitate username
            while CustomUser.objects.filter(username=username).exists():
                suffix += 1
                username = f"{base_username}{suffix}"

            email = f"{username}@example.com"
            
            # Asigură unicitate email
            while CustomUser.objects.filter(email=email).exists():
                suffix += 1
                username = f"{base_username}{suffix}"
                email = f"{username}@example.com"

            city = random.choice(list(ORASE_SI_JUDETE.keys()))
            county = ORASE_SI_JUDETE[city]

            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password='test1234'
            )

            user.first_name = first_name
            user.last_name = last_name
            user.phone_number = fake.msisdn()[:10]
            user.birth_date = birth_date
            user.residing_city = city
            user.residing_county = county
            user.save()

            self.stdout.write(f'✅ {first_name} {last_name} ({username}) | {email} | {city}, {county}')
