# Verifying Webhooks

The first request that your new webhook will send to your server will be a verification request to confirm that Layer is communicating with the correct service.  This helps to avoid your information from leaking to unintended recipients.

The verification request will be a `GET` request with a `verification_challenge` query string parameter.  Its value will be a random string.  Your service should echo back the challenge parameter in the response body.  Once Layer receives a valid response, the endpoint is considered to be valid, the webhook will have its status set to `active`, and Layer will begin sending notifications to that endpoint.

Layer will not attempt to retry the verification request.  Failure to complete verification will cause your webhook's status to becomes `inactive`.

```request
GET https://mydomain.com/my-webhook-endpoint?verification_challenge=abcxyz
```

### Response `200 (OK)`

```
abcxyz
```

NOTE: Any `Content-Type` can be used in your response.
