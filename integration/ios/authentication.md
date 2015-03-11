#Authentication

To work with Layer we require a backend server that generates an `Identity Token` on behalf of the client application for security purposes. For more information about configuring your backend check out the [Authentication Guide](https://developer.layer.com/docs/guides#authentication).

```emphasis
**Best Practice**

If your app supports multiple users on a given device, Layer allows each user to send and receive their own messages. Just make sure you deauthenticate when a user logs out and wait for the appropriate callback before authenticating another user. [Click here](https://support.layer.com/hc/en-us/articles/204225940-How-does-Authentication-work-) to learn more.
```

