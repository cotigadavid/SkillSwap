from http.cookies import SimpleCookie

from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        token = None
        headers = dict(scope.get("headers") or [])
        cookie_header = headers.get(b"cookie")

        if cookie_header:
            cookie = SimpleCookie()
            cookie.load(cookie_header.decode())
            if "access_token" in cookie:
                token = cookie["access_token"].value

        if token:
            scope["user"] = await self._get_user(token)
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def _get_user(self, token):
        jwt_auth = JWTAuthentication()
        try:
            validated = jwt_auth.get_validated_token(token)
            return jwt_auth.get_user(validated)
        except (InvalidToken, TokenError):
            return AnonymousUser()
