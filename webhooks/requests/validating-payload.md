# Validating Payload Integrity

The `secret` specified when a Webhook is registered is used to compute a [Hash-based Message Authentication Code](http://en.wikipedia.org/wiki/HMAC) (or HMAC) of the request body.  The HMAC is delivered with the request via the `layer-webhook-signature` HTTP header.

When integrating a Layer Webhook with your application, it is recommended that you validate the signature given in the `layer-webhook-signature` header. This validation protects your server from unauthorized attempts to use your webhook endpoints.

Validation is done by feeding the `secret` you provided on registering the webhook, and the complete request body to a crypto library (such as OpenSSL) that is capable of computing an `HmacSHA1` digest.  If the request is valid and the body has not been tampered with, the computed signature will match the header value exactly.
