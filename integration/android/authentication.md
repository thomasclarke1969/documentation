# Authentication

The Layer service is built to work with your existing backend application and existing users. Layer Authentication allows you to represent your users within the Layer service without sharing credentials. In order to do this, it requires that your backend server application generate identity tokens on behalf of your client application. 

To kick off the authentication flow, your application should ask the SDK to authenticate upon recieving a call to the `LayerConnectionListener`'s `onConnectedConnected()` method by calling `authenticate()`.

```java
 @Override
 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient client) {
     // Ask the LayerClient to authenticate. If no auth credentials are present, 
     // an authentication challenge is issued
     client.authenticate();
 }
```	

On first run, your application will recieve a call to your `LayerAuthenticationListener`'s `onAuthenticationChallenge()` method. Your application must then perform the following. 

1. Acquire an authentication nonce from the Layer SDK. This nonce is passed to your application in your implementation of `onAuthenticationChallenge()`.

2. Post the authentication nonce to your backend in order to generate an identity token. 

3. Submit the identity token returned from your backend application to Layer for validation via a call to `answerAuthenticationChallenge()`.

##Identity Token 
For a comprehensive guide on generating identity tokens via your backend application, please visit the [Layer Authentication Guide](/docs/resources#authentication-guide). For convenince, Layer also provides an Identity Service that can generate identity tokens on behalf of your application. 

```emphasis
Please note, the Identity Service is only available for testing purposes and cannot be used in production applications.
```

The following code can be implemented in your application and can be used to generate identity tokens. 

```
/*
 * 1. Implement `onAuthenticationChallenge` to acquire a nonce
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

On subsequent runs, the Layer SDK will cache authentication credentials. Your application should be prepared however to handle calls to `onAuthenticationChallenge` at all times.

