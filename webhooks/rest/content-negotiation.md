# Content Negotiation

All requests against the Webhooks API must include an `Accept` header specifying the Layer Webhooks media type and API version:

```text
Accept: application/vnd.layer.webhooks+json; version=1.0
```

A request with any other `Accept` header will be rejected with a `406 (Not Acceptable)` [error response](/docs/webhooks/rest#errors).

`POST` content must be accompanied by the header:

```text
Content-Type: application/json
```

All responses from the Webhooks API (irrespective of version) will have the header:

```text
Content-Type: application/json
```
