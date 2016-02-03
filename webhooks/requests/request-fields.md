# Request Fields

Every webhook request is sent with the following properties:

| Name | Description |
|--------|--------------|
| **event.created_at** | Time at which the event occurred |
| **event.type** | One of the [Event Types](introduction#event-types) |
| **event.id** | Unique ID which can be used for deduplication in case a request gets resent to your server. |

For certain events, the request will also include an `event.actor`, which reflects the user responsible for the event.  For example, in the case of `message.sent`, this is the user who sent the message.  In the case of `message.delivered`, this is the user who sent the delivery receipt.  When present, `event.actor` will have one (and only one) of the following properties:

| Name | Description |
|------|-------------|
| **event.actor.user_id** | The ID of the user, when a user caused the event |
| **event.actor.name** | The name of the system user, when a system user caused the event |

## Custom Configuration

If you specified `config` when [registering your webhook](/docs/webhooks/rest#register), it will be added to every request payload containing your config data.
