from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Skill, Review
from .cache import invalidate_search_cache, invalidate_skills_cache, invalidate_reviews_cache


@receiver(post_save, sender=Skill)
def invalidate_on_skill_save(sender, instance, **kwargs):
    invalidate_search_cache()
    invalidate_skills_cache()


@receiver(post_delete, sender=Skill)
def invalidate_on_skill_delete(sender, instance, **kwargs):
    invalidate_search_cache()
    invalidate_skills_cache()


@receiver(post_save, sender=Review)
def invalidate_on_review_save(sender, instance, **kwargs):
    invalidate_reviews_cache()


@receiver(post_delete, sender=Review)
def invalidate_on_review_delete(sender, instance, **kwargs):
    invalidate_reviews_cache()
