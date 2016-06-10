# Registering Webhooks

You can register a new webhook using the following endpoint.

### Parameters

| Name    | Type   | Description |
|---------|:------:|-------------|
| **version**    | string   | The version of the Layer Webhooks protocol to use |
| **target_url**    | string   | Destination URL for the webhook (must be HTTPS) |
| **events** | string[] | Types of [events](/docs/webhooks/introduction#event-types) that will cause this webhook to be triggered |
| **secret** | string  | String used to generate an hash of each webhook payload to allow your server to [verify its authenticity](#secrets) |
| **config**   | dictionary   | A free form dictionary of supplemental data specific to the webhook |

```request
POST /apps/:app_uuid/webhooks
```

### Example Request: Register a Webhook

```json
{
    "version": "2.0",
    "target_url": "https://mydomain.com/my-webhook-endpoint",
    "events": [
        "conversation.created",
        "message.sent",
    ],
    "secret": "1697f925ec7b1697f925ec7b",
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

### Response `201 (Created)`

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
    "status": "unverified",
    "created_at": "2015-03-14T13:37:27Z",
    "config": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

Note that this results in an `unverified` webhook; the webhook must be verified before it receives events.

### Secrets

The `secret` you provide helps to secure your webserver's endpoint from unauthorized access.  Generate an arbitrary string, and provide it to Layer when creating the webhook.  That secret can then be used for validating all data sent via the webhook to your server.  This is explained in more detail in [Validating Payload](/docs/webhooks/requests#validating-payload).

Please do not use an easily guessed string such as "secret", nor should your secret show up in public spaces such as a public github repo.
