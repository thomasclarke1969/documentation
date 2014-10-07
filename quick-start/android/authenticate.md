#Authenticate

Once connected, the `onConnectionConnected()` method will be called, followed by the `authenticate()` method on the `layerClient`.

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

```emphasis
Please note, the Identity Service is only available for testing purposes and cannot be used in production applications.
```

```java
/*
 * 1. Implement `onAuthenticationChallenge` in your Authentication Listener to acquire a nonce
 */
@Override
public void onAuthenticationChallenge(final LayerClient layerClient, final String nonce) {
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
