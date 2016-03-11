# Authenticating Users

Authentication for the Platform API will be based on a `TOKEN` generated from within the [Developer Dashboard](https://developer.layer.com/projects/integrations) within the *Platform API* section. The token can be revoked at any time by deleting it from the developer dashboard.

The Authorization header of each HTTP request will be the word "Bearer" followed by your token:
```text
Authorization: Bearer TOKEN
```
If the token is missing or invalid, the server will respond with:

```text
401 (Unauthorized)
```

## Platform API Token Security

The Platform API tokens provide administrator level access to your app’s resources and as such should be kept secure. One important precaution is to avoid using them from a Web Browser. While traffic may be encoded and encrypted, anyone with access to your browser can open a javascript console, copy your tokens and gain unrestricted access to all of your user's data.

If you wish to expose actions in your application that in turn trigger integrations with the Platform API, you should expose endpoints on your application and enforce suitable access controls. Your users can then interact with your backend application, which then interacts with the Layer Platform API on their behalf.
