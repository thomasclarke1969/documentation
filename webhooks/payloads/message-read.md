# Message Read

A `message.read` event is sent when a Message recipient acknowledges having read a Message.  For a Conversation with 6 participants, you should receive up to 5 of these per message (the sender of a message does not send a read receipt).

```request
POST https://mydomain.com/my-webhook-endpoint
```

```json
{
    "event": {
        "created_at": "2015-09-17T20:46:47.561Z",
        "type": "message.read",
        "id": "c12f340d-3b62-4cf1-9b93-ef4d754cfe69",
        "actor": {
            "user_id": "999"
        }
    },
    "message": {
        "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
        "conversation": {
            "id": "layer:///conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f",
            "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f"
        },
        "parts": [
            {
                "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0",
                "mime_type": "text/plain",
                "body": "This is the message."
            }
        ],
        "sent_at": "2014-09-09T04:44:47+00:00",
        "sender": {
            "user_id": "12345"
        },
        "recipient_status": {
            "12345": "read",
            "999": "read",
            "111": "delivered"
        }
    },
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
}
```
