# Authentication

Authentication for the Webhooks API will be based on a `TOKEN` generated from within the [Developer Dashboard](https://developer.layer.com/projects/integrations) within the *Platform API* section. The token can be revoked at any time by deleting it from the developer dashboard.

The Authorization header of each HTTP request will be the word "Bearer" followed by your token:

```text
Authorization: Bearer TOKEN
```

If the token is missing or invalid, the server will respond with:

```text
401 (Unauthorized)
```

## Platform API Token Security

The Platform API tokens provide administrator level access to your app’s resources and as such should be kept secure.
