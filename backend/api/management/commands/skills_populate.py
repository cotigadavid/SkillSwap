from django.core.management.base import BaseCommand
from api.models import Skill, CustomUser
from faker import Faker
import random

fake = Faker()

DIFFICULTY_HOURS = {
    'easy': (1, 20),
    'medium': (20, 50),
    'hard': (50, 100),
    'serious': (101, 300)
}

SKILL_DETAILS = {
    'Cooking': 'Discover the joy of cooking by mastering everything from basic kitchen skills to gourmet recipes. Whether you’re sautéing vegetables or baking your first cake, this skill will help you turn everyday ingredients into something truly delicious and satisfying.',
    
    'Painting': 'Unleash your inner artist by learning how to express emotion and beauty through paint. From understanding brush techniques and color theory to creating your own canvas masterpiece, painting is a relaxing and fulfilling way to bring your imagination to life.',
    
    'Guitar': 'Pick up the guitar and learn how to turn strings into songs. From simple chords to more complex solos, this skill will give you the confidence to play your favorite tunes or even create your own music. Perfect for both relaxation and creative expression.',
    
    'Piano': 'Dive into the world of music by learning piano — a foundational instrument for many genres. You’ll start with simple melodies and gradually develop coordination, music reading, and emotional expression through keys that come alive under your fingers.',
    
    'Crocheting': 'Experience the therapeutic rhythm of crocheting as you create scarves, blankets, and more with just a hook and yarn. This timeless skill combines creativity with patience and leaves you with handmade gifts full of warmth and meaning.',
    
    'Gardening': 'Connect with nature by learning how to grow and nurture your own plants. From herbs on a windowsill to a full vegetable patch, gardening is a peaceful and rewarding way to understand the cycles of life and bring green into your everyday.',
    
    'Programming': "Step into the digital world and learn how to build things from scratch using code. Whether you're curious about web apps, games, or data, programming empowers you to solve problems, think logically, and bring your ideas to life in the virtual space.",
    
    'Public Speaking': 'Gain the confidence to speak clearly and persuasively in front of any audience. You’ll learn how to structure your thoughts, engage listeners, and overcome nerves — an invaluable skill for both professional and personal growth.',
    
    'Photography': 'Learn how to see the world through a new lens. From lighting and composition to editing and storytelling, photography helps you capture moments and emotions, preserving memories and beauty in every shot you take.',
    
    'Speed Learning': 'Train your brain to absorb information faster and more efficiently. This skill is perfect for students, professionals, or anyone looking to improve their ability to learn new things and retain knowledge in today’s fast-paced world.',
    
    'Creative Writing': 'Unlock your imagination and learn to tell stories that move people. Whether it’s fiction, poetry, or personal essays, creative writing is a way to explore emotions, build worlds, and connect with others through the power of words.',
    
    'Self-defense': 'Equip yourself with practical techniques to stay safe and feel confident in any situation. Self-defense training focuses on awareness, control, and simple movements that can make a real difference in moments of danger.',
    
    'Meditation': 'Find peace amidst the chaos by learning how to center your mind and calm your body. Meditation helps you manage stress, focus better, and cultivate inner balance — a skill that benefits every aspect of your life.',
    
    'Graphic Design': "Combine aesthetics and function by learning the principles of visual communication. Whether you're designing for print or digital, graphic design gives you the tools to create visuals that inform, inspire, and stand out.",
    
    'Math': 'Sharpen your problem-solving skills and logical thinking through math. From basic arithmetic to advanced concepts, this skill helps you build a strong foundation that applies to science, finance, and everyday decisions.',
    
    'German Language': "Open the door to a new culture by learning German. You'll explore grammar, pronunciation, and everyday phrases that help you communicate confidently and appreciate the richness of German-speaking countries.",
    
    'Japanese Language': 'Embark on a journey into the Japanese language and culture. You’ll learn to read hiragana, katakana, and kanji while practicing real-life conversation skills that bring you closer to a unique and fascinating world.',
    
    'Sculpture': 'Shape your ideas into tangible forms through sculpture. This hands-on art form teaches patience, precision, and creativity as you mold clay, carve stone, or explore modern materials to create expressive 3D works.',
    
    'Dancing': 'Move your body and express yourself through rhythm and movement. Whether it’s hip-hop, ballroom, or freestyle, dancing is a joyful way to stay active, build confidence, and connect with others on and off the dance floor.',
    
    'Video Editing': 'Tell compelling stories through video by learning how to cut, trim, and enhance footage. Video editing is a blend of technical skill and artistic vision, perfect for content creators, aspiring filmmakers, or social media enthusiasts.'
}


class Command(BaseCommand):
    help = 'Populate the database with random skills for users with IDs between 8 and 27'

    def handle(self, *args, **kwargs):
        users = list(CustomUser.objects.filter(id__gte=25, id__lte=44))
        random.shuffle(users) 

        if not users:
            self.stdout.write(self.style.ERROR('No users found with IDs between 8 and 27.'))
            return

        total_skills = 0

        for _ in range(50): 
            user = random.choice(users)
            title = random.choice(list(SKILL_DETAILS.keys()))
            difficulty = random.choice(list(DIFFICULTY_HOURS.keys()))
            min_hours, max_hours = DIFFICULTY_HOURS[difficulty]
            

            possible_hours = [h for h in range(min_hours, max_hours + 1) if h % 5 == 0]
            hours_needed = random.choice(possible_hours)

            description = SKILL_DETAILS[title]

            skill = Skill.objects.create(
                user=user,
                title=title,
                description=description,
                difficulty=difficulty,
                hours_needed=hours_needed
            )

            total_skills += 1
            self.stdout.write(f'Skill "{title}" ({difficulty}, {hours_needed}h) created for user {user.id}')
