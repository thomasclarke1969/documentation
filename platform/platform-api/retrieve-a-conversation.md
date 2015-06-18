# Retrieving Conversations

If you have a URL for a Conversation, you can download the Conversation object by using the following endpoint.

```request
GET /apps/:app_uuid/conversations/:conversation_uuid
```

### Successful Response `200 (OK)`

```json
{
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
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

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID
```