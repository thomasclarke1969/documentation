# Authentication

Once connected, Layer requires every user to be authenticated before they can send and receive messages. The Authentication process lets you explicitly allow a given user to communicate with other users in your App. A user is defined by their User ID, which can be any sort of unique identifier, including ones that you are already using for user management (this could be a UDID, username, email address, phone number, etc).

To authenticate a user, you must set up your own Authentication Service where you can validate a user's credentials and create an Identity Token. That Identity Token is returned to your App, and then passed on to the Layer servers. If the Identity Token is valid, the Authentication process will complete. For more information about configuring your own Authentication Service check out the [Authentication Guide](/docs/websdk/guides).

```emphasis
When building your own Identity Token service, we have several examples for multiple platforms in the [Authentication Guide](/docs/websdk/guides).
```

## Standard Authentication Process

The Standard Authentication Process depends upon:

* An Authentication Web Service provided by you
* The Layer Web SDK

The authentication process starts when you instantiate the Layer Client which connects to the Layer backend to generate a nonce.

Once this has been obtained, the `challenge` event is triggered with the nonce. You then use that nonce and any user credentials or session information you deem necessary to create an Identity Token with your own web service.

After this is passed back to the app, you can finish the authentication process by calling the `challenge` event's `callback(token)`.  This will enable the Client to generate a session and then trigger a `ready` event.

<a href="https://s3.amazonaws.com/static.layer.com/web/docs/websdk_auth.png" target="_blank"><img src="https://s3.amazonaws.com/static.layer.com/web/docs/websdk_auth.png" alt="Authentication flow on Web SDK"></a>


If you'd like to learn more about Authentication and the Authentication process, this [Knowledge Base article](https://support.layer.com/hc/en-us/articles/204225940-How-does-Authentication-work) is a good place to start.


```javascript
/*
 * 1. Instantiate your client.  The client will obtain a nonce automatically.
 *    Each nonce is valid for 10 minutes after creation, after which you will have
 *    to call `login()` to generate a new one.
 */
var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%",
    isTrustedDevice: false
});

/*
 * 2. On receiving a nonce via the `challenge` event,
 *    Connect to your Identity Web Service to generate an Identity Token. In addition
 *    to your Layer App ID, User ID, and nonce, you can choose to pass in any other
 *    parameters that make sense (such as a password), depending on your App's login
 *    process.
 */
client.on('challenge', function(evt) {
    // evt has properties `evt.nonce` and `evt.callback`.
    getIdentityToken(evt.nonce, function(identityToken) {
        /*
         * 3. Submit identity token to Layer for validation
         */
        evt.callback(identityToken);
    })
});

/*
 * 4. The `ready` event is triggered once the identity token has been
 *    validated and a Layer session created.
 */
client.on('ready', function() {
    renderMyUI(client);
});

/*
 * 5. When your ready, start the authentication process.
 */
client.connect(myUserId);
```

## The Alternate Authentication Process

The [Client API](/docs/client/introduction#authentication) documents how to use the REST API to get a nonce, Identity Token and Session Token.  All of this may be done by your server as part of your user logging into your site.

1. User sends userid and password to your server
2. Your server requests a nonce from Layer
3. Your server uses the nonce to create an identity token
4. Your server submits that identity token to Layer's servers and gets a Session Token
5. Your server sends its normal responses to logging in back to the browser.  Your server will ALSO send the Layer Session Token.
6. Client initializes with your Session Token

```javascript
var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%"
});
client.connectWithSession(yourUserId, sessionTokenFromYourServer);
```

What are the trade-offs between the standard authentication process and this alterative?

* The standard process lets authentication happen at any time; for sites where chat may not be the first thing the user does, this may be ideal.
* Requiring that logging in wait for a request for a nonce, and then a request for a session token means slower logins.
* The main advantage of the alternate process is that the time spent logging in makes a nice and simple place to do any additional authentication and be done with it.

## Trusted Devices

The Client constructor takes a property `isTrustedDevice` which defaults to `false`.  Setting this to true
will cause the Client to store your Layer Session Token in persistent memory.  Calling the constructor with `isTrustedDevice: true` and `userId` property will cause the Client to attempt to restore that Session Token.  Suppose that `isTrustedDevice` is `true` and `userId` is `TestUser`, the Client will perform the following tests:

* If there is no session cached for the user named "TestUser", then the `challenge` event handler will be called allowing authentication to procede.
* If there is a session for the user named "TestUser" but its expired, then your `challenge` event handler will be called allowing authentication to procede.
* If there is a session for "TestUser" and its valid, then your `ready` event handler will be called.

Both authentication processes above can work with both

```javascript
var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%",
    isTrustedDevice: true
});
```
and
```javascript
var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%",
    isTrustedDevice: false
});
```

Further, you can change the property prior to calling `connect()` or `connectWithSession()`:

```javascript
var client = new layer.Client({
    appId: "%%C-INLINE-APPID%%"
});
client.isTrustedDevice = true;
client.connect(userId);
```

## Additional Notes

1. Nonces expires after 10 minutes.
2. Identity Tokens expires when their nonces expire; any Identity Token you generate will expire 10 minutes after you got your nonce.

    This can cause concerns if you generate a nonce when rendering a login screen; after all, the user may take more than 10 minutes doing other things before returning and completing the login.

3. Session Tokens expire after roughly one month, after which a `deauthenticated` event will be triggered:

    ```javascript
    client.on('deauthenticated', function() {
        showMyLoginPage();
    });
    ```

4. You can choose to deauthenticate the User at any point by calling `client.logout()`. This will effectively "log out" the User, deleting their session and any access to their account through that session. As above, it will also trigger the `deauthenticated` event.
