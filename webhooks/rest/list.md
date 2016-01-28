# Listing Webhooks

You can request a list of all of your webhooks from the API:

```request
GET /apps/:app_uuid/webhooks
```

### Response `200 (OK)`

```json
[
  {
    "id": "layer:///apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/f5ef2b54-0991-11e5-a6c0-1697f925ec7b",
    "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/f5ef2b54-0991-11e5-a6c0-1697f925ec7b",
    "version": "1.0",
    "target_url": "https://server.example.com/layeruser/foo",
    "events": [
        "conversation.created",
        "message.sent"
    ],
    "status": "active",
    "created_at": "2015-03-14T13:37:27Z",
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
  },
  {
    "id": "layer:///apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/g6ef2b54-0991-11e5-a6c0-1697f925ec7a",
    "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/g6ef2b54-0991-11e5-a6c0-1697f925ec7a",
    "version": "1.0",
    "target_url": "https://mydomain.com/my-webhook-endpoint",
    "events": [
        "conversation.deleted"
    ],
    "status": "inactive",
    "status_reason": "Deactivated by User",
    "created_at": "2015-05-14T13:37:27Z",
    "config": {}
  }
]
```
