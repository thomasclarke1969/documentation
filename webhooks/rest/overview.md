# Webhooks REST API

There are two ways to register and configure your webhooks:

1. The [Developer Dashboard](https://developer.layer.com/projects/integrations)
2. The REST API

This section describes the REST API for creating, verifying, listing, disabling and deleting your webhooks.

To get started, you're going to want to register a webhook, a process which has two steps.

1. **Register the webhook**: Registers a new webhook with status `unverified`.
2. **Verify the webhook**: Sets the webhook status to `active`; it now sends events to your server.

All API access is over `HTTPS`, and accessed from the following domain:

```text
https://api.layer.com
```

Before going into detail on registering webhooks, you'll need to be able to send authenticated requests to the API.
