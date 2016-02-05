# Webhook requests

Every time an [event](/docs/webhooks/introduction#event-types) that you subscribed to happens, our server will send an `HTTP POST` request to your server target URL.

Each event type has a specific payload with relevant information about the event. The payload for each event is described in [Event Payloads](payloads).
