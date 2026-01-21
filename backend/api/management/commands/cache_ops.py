from django.core.management.base import BaseCommand
from django.core.cache import cache


class Command(BaseCommand):
    help = 'Cache operations: stats, clear'

    def add_arguments(self, parser):
        parser.add_argument('action', choices=['stats', 'clear'])

    def handle(self, *args, **options):
        if options['action'] == 'stats':
            self.show_stats()
        elif options['action'] == 'clear':
            self.clear_cache()

    def show_stats(self):
        try:
            from django_redis import get_redis_connection
            redis_client = get_redis_connection("default")
            info = redis_client.info()
            
            hits = info.get('keyspace_hits', 0)
            misses = info.get('keyspace_misses', 0)
            total = hits + misses
            hit_rate = (hits / total * 100) if total > 0 else 0
            
            self.stdout.write(f"\n=== Redis Cache Stats ===")
            self.stdout.write(f"Memory: {info.get('used_memory_human', 'N/A')}")
            self.stdout.write(f"Hits: {hits:,} | Misses: {misses:,}")
            self.stdout.write(f"Hit Rate: {hit_rate:.1f}%")
            
            search_keys = len(list(redis_client.scan_iter(match="*search*", count=100)))
            self.stdout.write(f"Cached searches: {search_keys}\n")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))

    def clear_cache(self):
        cache.clear()
        self.stdout.write(self.style.SUCCESS("Cache cleared!"))
