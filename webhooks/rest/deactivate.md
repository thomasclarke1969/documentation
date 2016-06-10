# Deactivating Webhooks

If you want to pause activity around a webhook, you can deactivate it, and then reactivate it later.

```request
POST /apps/:app_uuid/webhooks/:webhook_uuid/deactivate
```

### Response `200 (OK)`

```json
{
    "id": "layer:///apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/f5ef2b54-0991-11e5-a6c0-1697f925ec7b",
    "url": "https://api.layer.com/apps/082d4684-0992-11e5-a6c0-1697f925ec7b/webhooks/f5ef2b54-0991-11e5-a6c0-1697f925ec7b",
    "version": "2.0",
    "target_url": "https://mydomain.com/my-webhook-endpoint",
    "events": [
        "conversation.created",
        "message.sent"
    ],
    "status": "inactive",
    "created_at": "2015-03-14T13:37:27Z",
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
}
```
