import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.core.serializers.json import DjangoJSONEncoder

from .models import Conversation, Message, MessageAttachment
from .serializers import MessageSerializer

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            user = self.scope.get("user")
            logger.info(f"WebSocket connect attempt, user: {user}")

            if not user or isinstance(user, AnonymousUser) or user.is_anonymous:
                logger.warning("WebSocket rejected: anonymous user")
                await self.close(code=4001)
                return

            self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
            logger.info(f"User {user.id} connecting to conversation {self.conversation_id}")

            can_access = await self._user_can_access(user.id, self.conversation_id)
            if not can_access:
                logger.warning(f"User {user.id} denied access to conversation {self.conversation_id}")
                await self.close(code=4003)
                return

            self.group_name = f"chat_{self.conversation_id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            
            logger.info(f"WebSocket accepted for user {user.id} on conversation {self.conversation_id}")

        except Exception as e:
            logger.error(f"WebSocket connect error: {e}", exc_info=True)
            await self.close(code=4000)

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        message_type = content.get("type")
        if message_type == "ping":
            await self.send_json({"type": "pong"})
            return

        if message_type == "message":
            text = (content.get("text") or "").strip()
            attachment_keys = content.get("attachment_keys") or []
            attachments = content.get("attachments") or []

            if attachments:
                await self.send_json({
                    "type": "error",
                    "detail": "Direct file upload over WebSocket is disabled. Upload to S3 and send attachment_keys.",
                })
                return

            if not text and not attachment_keys:
                await self.send_json({
                    "type": "error",
                    "detail": "Message text or attachments required.",
                })
                return

            message_payload = await self._create_message(
                conversation_id=self.conversation_id,
                text=text,
                attachment_keys=attachment_keys,
            )

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat_message",
                    "message": message_payload,
                }
            )
            return

    async def chat_message(self, event):
        await self.send_json({
            "type": "message",
            "data": event.get("message"),
        })

    @database_sync_to_async
    def _user_can_access(self, user_id, conversation_id):
        try:
            conversation = Conversation.objects.select_related("sender", "receiver").get(id=conversation_id)
        except Conversation.DoesNotExist:
            return False

        if conversation.sender_id != user_id and conversation.receiver_id != user_id:
            return False

        return True

    @database_sync_to_async
    def _create_message(self, conversation_id, text, attachment_keys):
        message = Message.objects.create(
            conversation_id=conversation_id,
            text=text,
        )

        for key in attachment_keys:
            MessageAttachment.objects.create(
                message=message,
                file=key,
                filename=key.split("_")[-1],
            )

        payload = MessageSerializer(message).data
        return json.loads(json.dumps(payload, cls=DjangoJSONEncoder))
