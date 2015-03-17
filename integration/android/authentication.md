#Authenticate

Once connected, Layer requires every user to be authenticated before they can send and recieve messages. The Authentication process lets you explicitly allow a given user to communicate with other users in your App. A user is defined by their User ID, which can be any sort of unique identifer, including ones that you are already using for user managment (this could be a UDID, username, email address, phone number, etc).

To authenticate a user, you must set up your own Authentication Web Service where you can validate a user's credentials and create an Identity Token. That Identity Token is returned to your App, and then passed on to the Layer servers. If the Identity Token is valid, the Authentication process will complete, and that user's message history will sync to the device. For more information about configuring your own Authentication Web Service check out the [Authentication Guide](https://developer.layer.com/docs/guides#authentication).

```emphasis
Keep in mind that the sample Web Service provided in the [Quick Start Guide](https://developer.layer.com/docs/quick-start/android) is for testing purposes only and **cannot** be used in production.
```

If you'd like to learn more about Authentication and the Authentication process, this [Knowledge Base article](https://support.layer.com/hc/en-us/articles/204225940-How-does-Authentication-work-) is a good place to start.

You can start the Authentication process in your App after the Layer SDK connects successfully. After connecting, the `ConnectionListener.onConnectionConnected()` method will be called and then you can execute `layerClient.authenticate()`.


```java
 @Override
 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient layerClient) {
     // Ask the LayerClient to authenticate. If no auth credentials are present,
     // an authentication challenge is issued
     layerClient.authenticate();
 }
```

Once you have called the `authenticate()` method, your application will receive a call to your `LayerAuthenticationListener`'s `onAuthenticationChallenge()` method. You can use the following implementation as a template to connect to your own Identity Service, which will return an Identity Token.

```java
/*
 * 1. Implement `onAuthenticationChallenge` in your Authentication Listener to acquire a 
 *    nonce. Each nonce is valid for 10 minutes after creation, after which you will have 
 *    to call authenticate() again to generate a new one.
 */

public void onAuthenticationChallenge(final LayerClient layerClient, final String nonce) {

  /*
   * 2. Connect to your Identity Web Service to generate an Identity Token. In addition 
   *    to your Layer App ID, User ID, and nonce, you can choose to pass in any other 
   *    parameters that make sense (such as a password), depending on your App's login 
   *    process.
   */

   String eit = generateToken(appID, userID, nonce);

  /*
   * 3. Submit identity token to Layer for validation
   */
   
   layerClient.answerAuthenticationChallenge(eit);
}
```

The final step is to verify that the Authentication process completed succesfully, or to handle any errors.

```java
//Called if there was a problem authenticating
//Common causes include a malformed identity token, missing parameters in the identity 
// token, missing or incorrect nonce
public void onAuthenticationError(LayerClient layerClient, LayerException e) {
    //Handle the case where the User ID could not be Authenticated
    System.out.println("There was an error authenticating: " + e);
}

//Called when the user has successfully authenticated
public void onAuthenticated(LayerClient client, String arg1) {
    //Handle the case where the User ID was Authenticated correctly (start the 
    // Conversation Activity, for example)
    System.out.println("Authentication successful");
}
```

You can choose to deauthenticate the User at any point by calling `layerClient.deauthenticate()`. This will effectively "log out" the User, preventing them from sending and receiving messages on the device (and they will not receive notifications). Deauthenticating will also delete any locally stored conversations and messages.

```java
//Called after the user has been deauthenticated
public void onDeauthenticated(LayerClient client) {
    //Handle the case where the user deauthenticated (return to your App's login 
    // screen, for example)
    System.out.println("User is deauthenticated");
}
```

```emphasis
**Best Practice**

If your app supports multiple users on a given device, Layer allows each user to send and receive their own messages. Just make sure you deauthenticate when a user logs out and wait for the appropriate callback before authenticating another user.
```
