# Fetching Webhooks

You can get the details and status of a single webhook by requesting it from the API:

```request
GET /apps/:app_id/webhooks/:webhook_id
```

### Response `200 (OK)`

```json
{
    "id": "layer:///apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/f5ef2b54-0991-11e5-a6c0-1697f925ec7b",
    "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/f5ef2b54-0991-11e5-a6c0-1697f925ec7b",
    "version": "1.0",
    "target_url": "https://mydomain.com/my-webhook-endpoint",
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
}
```
