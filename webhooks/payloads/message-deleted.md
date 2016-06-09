# Message Deleted

A `message.deleted` event is sent when a Message is globally deleted.  This will be triggered for Messages deleted by both users and via the Platform API.  Note that there are other forms of deletion; these do not at this time trigger a webhook event.

```request
POST https://mydomain.com/my-webhook-endpoint
```

```json
{
    "event": {
        "created_at": "2015-09-17T20:46:47.561Z",
        "type": "message.deleted",
        "id": "c12f340d-3b62-4cf1-9b93-ef4d754cfe69",
        "actor": {
            "id": "layer:///identities/111",
            "url": "https://api.layer.com/identities/111",
            "user_id": "111",
            "display_name": "Number One, You have the Bridge",
            "avatar_url": "https://mydomain.com/images/111.gif"
        }
    },
    "message": {
        "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
        "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/messages/940de862-3c96-11e4-baad-164230d1df67",
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
          "id": "layer:///identities/1234",
          "url": "https://api.layer.com/identities/1234",
          "user_id": "1234",
          "display_name": "One Two Three Four",
          "avatar_url": "https://mydomain.com/images/1234.gif"
        },
        "recipient_status": {
            "layer:///identities/1234": "read",
            "layer:///identities/999": "read",
            "layer:///identities/111": "read"
        }
    },
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
}
```
