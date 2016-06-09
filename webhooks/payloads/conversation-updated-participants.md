# Conversation Participant Change

A `conversation.updated.participants` event is sent whenever there is a change to any Conversation's pariticipant list.  The event is triggered for changes made by users and by the Platform API.

```request
POST https://mydomain.com/my-webhook-endpoint
```

```json
{
    "event": {
        "created_at": "2015-09-17T20:46:47.561Z",
        "type": "conversation.updated.participants",
        "id": "c12f340d-3b62-4cf1-9b93-ef4d754cfe69"
    },
    "conversation": {
        "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
        "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f",
        "created_at": "2014-09-15T04:44:47+00:00",
        "messages_url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/conversations/c12fd916-1390-464b-850f-1380a051f7c8/messages",
        "distinct": false,
        "participants": [
            {
              "id": "layer:///identities/1234",
              "url": "https://api.layer.com/identities/1234",
              "user_id": "1234",
              "display_name": "One Two Three Four",
              "avatar_url": "https://mydomain.com/images/1234.gif"
            },
            {
              "id": "layer:///identities/5678",
              "url": "https://api.layer.com/identities/5678",
              "user_id": "5678",
              "display_name": "Five Six Seven Eight",
              "avatar_url": "https://mydomain.com/images/5678.gif"
            }
        ],
        "metadata": {
            "favorite": "true",
            "background_color": "#3c3c3c"
        }
    },
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
}
```
