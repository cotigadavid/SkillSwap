import hashlib
from django.core.cache import cache

CACHE_VERSION = "v1"

def make_cache_key(prefix: str, *args, query_params: dict = None) -> str:
    parts = [CACHE_VERSION, prefix]
    parts.extend(str(a) for a in args)
    
    if query_params:
        params = "&".join(f"{k}={v}" for k, v in sorted(query_params.items()) if v)
        if params:
            parts.append(params)
    
    key = ":".join(parts)
    
    if len(key) > 200:
        return f"{CACHE_VERSION}:{prefix}:{hashlib.md5(key.encode()).hexdigest()}"
    return key


def invalidate_pattern(pattern: str) -> int:
    try:
        from django_redis import get_redis_connection
        redis_client = get_redis_connection("default")
        deleted = 0
        cursor = 0
        while True:
            cursor, keys = redis_client.scan(cursor, match=pattern, count=100)
            if keys:
                deleted += redis_client.delete(*keys)
            if cursor == 0:
                break
        return deleted
    except Exception:
        return 0


def invalidate_search_cache():
    invalidate_pattern(f"{CACHE_VERSION}:search:*")


def invalidate_skills_cache():
    invalidate_pattern(f"{CACHE_VERSION}:skills:*")


def invalidate_reviews_cache():
    invalidate_pattern(f"{CACHE_VERSION}:reviews:*")


def invalidate_user_cache(user_id):
    invalidate_pattern(f"{CACHE_VERSION}:user:*:{user_id}*")
    invalidate_pattern(f"{CACHE_VERSION}:requests:*:{user_id}*")


def warm_cache():
    from django.core.cache import cache
    from .models import Skill
    from .serializers import SkillSerializer
    
    try:
        skills = Skill.objects.select_related('user').prefetch_related('reviews')[:50]
        cache_key = make_cache_key("skills", "list")
        serializer = SkillSerializer(skills, many=True)
        cache.set(cache_key, serializer.data, 300)
        return True
    except Exception:
        return False
