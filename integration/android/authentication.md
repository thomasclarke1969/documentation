# Authentication

Layer Authentication requires that your backend server generate identity tokens on behalf of your application. Please see the [Layer Authentication Guide](/docs/resources#authentication-guide) for a comprehensive guide on setting up Layer authentication.

Upon establishing a network connection, your application will be notified via a call to your `LayerConnectionListener`'s `onConnectionConnectedMethod`. Upon receiving this call, you attempt to authenticate the client.

```java
 @Override

 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient client) {
 	// Asks the LayerClient to authenticate. If no auth credentials are present,
 	// an authentication challenge is issued
     client.authenticate();
 }
```

On first run, the LayerSDK will not have any authentication credentials so your application will receive an authentication challenge. This comes in the form of a call to your `LayerAuthListener` object's `onAuthenticationChallenge()` method.

```java
@Override
// Called during an authentication challenge
public void onAuthenticationChallenge(LayerClient client, String nonce) {
   /*
   * Upon receipt of nonce, post to your backend and acquire a Layer identityToken
   */

   client.answerAuthenticationChallenge(identityToken);
}
```

On subsequent runs, the Layer SDK will cache authentication credentials. Your application should be prepared however to handle calls to `onAuthenticationChallenge` at all times.
