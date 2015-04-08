#Authenticate

Once connected, it is time to Authenticate a user in order to allow them to send and receive messages. Layer authentication requires that a backend server generate an `Identity Token` on behalf of the client. For testing purposes, Layer provides a sample backend that takes care of this. <b>Note:</b> You <b>cannot</b> use this sample backend with Production App IDs.

Once connected, the `onConnectionConnected()` method will be called. You can start the Authentication process by executing the `authenticate()` method on the `layerClient`. In general, you should authenticate and deauthenticate users based on your App's user management flow (ie, authenticate a user when they log in and deauthenticate them when they log out).

```java
 @Override
 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient layerClient) {
     // Ask the LayerClient to authenticate. If no auth credentials are present,
     // an authentication challenge is issued
     layerClient.authenticate();
 }
```

Once you have called the `authenticate()` method, your application will receive a call to your `LayerAuthenticationListener`'s `onAuthenticationChallenge()` method. You can use the following implementation which will connect to the Layer Identity Service to get an Identity Token.


```java
/*
 * 1. Implement `onAuthenticationChallenge` in your Authentication Listener to acquire a nonce
 */
@Override
public void onAuthenticationChallenge(final LayerClient layerClient, final String nonce) {

    //You can use any identifier you wish to track users, as long as the value is unique
    //This identifier will be used to add a user to a conversation in order to send them messages
    String mUserId = "USER_ID_HERE";

  /*
   * 2. Acquire an identity token from the Layer Identity Service
   */
    (new AsyncTask<Void, Void, Void>() {
        @Override
        protected Void doInBackground(Void... params) {
            try {
                HttpPost post = new HttpPost("https://layer-identity-provider.herokuapp.com/identity_tokens");
                post.setHeader("Content-Type", "application/json");
                post.setHeader("Accept", "application/json");

                JSONObject json = new JSONObject()
                        .put("app_id", layerClient.getAppId())
                        .put("user_id", mUserId)
                        .put("nonce", nonce );
                post.setEntity(new StringEntity(json.toString()));

                HttpResponse response = (new DefaultHttpClient()).execute(post);
                String eit = (new JSONObject(EntityUtils.toString(response.getEntity())))
                        .optString("identity_token");

            /*
             * 3. Submit identity token to Layer for validation
             */
                layerClient.answerAuthenticationChallenge(eit);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }
    }).execute();
}
```

```emphasis
Please note, the Layer Identity Service cannot be used in production applications. You will need to implement the backend portion of Layer authentication prior to launching into production. Please see the [Layer Authentication Guide](/docs/guides/android#authentication) for information on doing so.
```
