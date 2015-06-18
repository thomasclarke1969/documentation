# Authentication
Authentication for the Platform API will be based on a `TOKEN` generated from within the [Developer Dashboard](https://developer.layer.com/projects/keys) within the *Platform API tokens* section. The token can be revoked at any time by deleting it from the developer dashboard.

The Authorization header of each HTTP request will be the word "Bearer" followed by your token:
```text
Authorization: Bearer TOKEN
```
If the token is missing or invalid, the server will respond with:

```text
401 (Unauthorized)
```
