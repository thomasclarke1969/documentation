# Responding to a Webhook

The server receiving the Layer webhook request is expected to:

* Respond with a 2xx status code
* Respond within 1 second
* Accept HTTP/1.1 and keepalive requests

Failure of any of these will cause the delivery to be considered a failure.  Failures will be retried with exponential backoff delay for a period of up to approximately 30 minutes.

Retries will have the same value for the `layer-webhook-request-id` header, and the target server must be able to handle duplicate transmissions of webhook requests.

If the webhook request fails to get a response after the retry period expires, the webhook will be transitioned to `inactive` status.  From there, it may be reactivated using the [activate API](/docs/webhooks/rest#activate).  You can open Layer's Developer Dashboard to see the reason why a webhook was deactivated, or you can examine the `status_reason` when using the [get](/docs/webhooks/rest#get) or [list](/docs/webhooks/rest#list) APIs.

## Response Content

Your server does not need to return any response content.  In fact, we encourage you to respond with `204 (No Content)`.
