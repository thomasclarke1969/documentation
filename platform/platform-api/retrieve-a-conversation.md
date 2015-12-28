# Retrieving Conversations

Applications can retrieve conversations for a specific user or for a specific conversation URL. Use the following endpoint to request all conversations for a specific user.

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
