# Retrieving Conversations

Applications can retrieve conversations for a specific user or for a specific conversation URL. User-specific requests will return conversation and message attributes that correspond to the user, such as `last_message` and `unread_message_count`.

Use the following endpoint to request all conversations for a specific user.

```request
GET /apps/:app_uuid/users/:user_id/conversations
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations
```


Use the following endpoint to request a specific Conversation for a user.

```request
GET /apps/:app_uuid/users/:user_id/conversations/:conversation_uuid
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations/CONVERSATION_UUID
```

### Successful Response `200 (OK)`

```json
{
    "id": "layer:///conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10",
    "url": "https://api.layer.com/apps/1ab339a8-adb6-11e5-ad04-192ee3134c94/users/1234567/conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10",
    "messages_url": "https://api.layer.com/apps/1ab339a8-adb6-11e5-ad04-192ee3134c94/users/1234567/conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10/messages",
    "created_at": "2015-12-28T22:59:57.433Z",
    "participants": [
        "2222222",
        "1234567"
    ],
    "metadata": {
        "background_color": "#3c3c3c"
    },
    "distinct": true,
    "last_message": {
        "id": "layer:///messages/62a1469c-4257-4515-a3e9-3f816dd0e3c5",
        "position": 5494669312,
        "conversation": {
            "id": "layer:///conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10",
            "url": "https://api.layer.com/apps/1ab339a8-adb6-11e5-ad04-192ee3134c94/users/1234567/conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10"
        },
        "parts": [
            {
                "id": "layer:///messages/62a1469c-4257-4515-a3e9-3f816dd0e3c5/parts/0",
                "mime_type": "text/plain",
                "body": "hello"
            }
        ],
        "sent_at": "2015-12-28T23:07:51.112Z",
        "received_at": "2015-12-28T23:07:51.123Z",
        "sender": {
            "user_id": "1234567"
        },
        "is_unread": false,
        "recipient_status": {
            "2222222": "sent",
            "1234567": "read"
        }
    },
    "unread_message_count": 0
}
```

Alternatively, if you have a URL for a Conversation, you can request the Conversation by using the following endpoint.

```request
GET /apps/:app_uuid/conversations/:conversation_uuid
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID
```

### Successful Response `200 (OK)`

```json
{
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "messages_url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/messages",
    "created_at": "2014-09-15T04:44:47+00:00",
    "participants": [
        "1234",
        "5678"
    ],
    "distinct": false,
    "metadata": {
        "background_color": "#3c3c3c"
    }
}
```

### Unsuccessful Response `404`

If you try to retrieve a conversation that doesn't exist you'll get a `404` response code.

### Successful Response `410 (GONE)`

If you try to retrieve a conversation that has been deleted you'll get a `410` response code.
