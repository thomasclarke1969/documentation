# Authentication

The Layer service is built to work with your existing backend application and existing users. Layer Authentication allows you to represent your users within the Layer service without sharing credentials. In order to do this, it requires that your backend server application generate identity tokens on behalf of your client application.

Once you have connected to Layer, the 'onConnectionConnected()' method will be called, at which time you should call the 'authenticate()' method on the layerClient.

```java
 @Override
 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient layerClient) {
     // Ask the LayerClient to authenticate. If no auth credentials are present,
     // an authentication challenge is issued
     layerClient.authenticate();
 }
```

Once you have called the 'authenticate()' method, your application will receive a call to your `LayerAuthenticationListener`'s `onAuthenticationChallenge()` method.

```
/*
 * 1. Implement `onAuthenticationChallenge`
 */
@Override

public void onAuthenticationChallenge(final LayerClient layerClient, final String nonce) {
    String mUserId = "USER_ID_HERE";

  /*
   * 2. Post the nonce to your backend and acquire an Identity Token  
   */

  /*
     * 3. Submit identity token to Layer for validation
      */
      layerClient.answerAuthenticationChallenge("IDENTITY_TOKEN");
}
```

For a comprehensive guide on generating identity tokens via your backend application, please visit the [Identity Tokens](/docs/getting-started#identity-tokens) section.

On subsequent runs, the Layer SDK will cache authentication credentials. Your application should be prepared however to handle calls to `onAuthenticationChallenge` at all times.
