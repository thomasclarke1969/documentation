#Authenticate

Once connected, Layer requires every user to be authenticated before they can send and recieve messages. The Authentication process lets you explicitly allow a given user to communicate with other users in your App. A user is defined by their User ID, which can be any sort of unique identifer, including ones that you are already using for user managment (this could be a UDID, username, email address, phone number, etc).

To authenticate a user, you must set up your own Authentication Web Service where you can validate a user's credentials and create an Identity Token. That Identity Token is returned to your App, and then passed on to the Layer servers. If the Identity Token is valid, the Authentication process will complete, and that user's message history will sync to the device. For more information about configuring your own Authentication Web Service check out the [Authentication Guide](/docs/ios/guides).

In general, you should authenticate when a user logs in to your app, and deauthenticate when they log out.

```emphasis
Keep in mind that the sample Identity Token endpoint provided in the [Quick Start App](/docs/ios/quick-start) is for testing purposes only and **cannot** be used in production. When building your own Identity Token web service, we have several examples for multiple platforms in the [Authentication Guide](/docs/ios/guides#authentication).
```

The authentication process starts when you call `requestAuthenticationNonceWithCompletion`, which connects to the Layer backend to generate a nonce. Once the nonce has been obtained, you use it and any user credentials you deem necessary to create an Identity Token with your own web service. After this is passed back to the app, you can finish the authentication process by calling `authenticateWithIdentityToken`.

![](ios_auth.png)

If you'd like to learn more about Authentication and the Authentication process, this [Knowledge Base article](https://support.layer.com/hc/en-us/articles/204225940-How-does-Authentication-work-) is a good place to start.

You can use this as a template to connect to your own Identity Service, which will return an Identity Token.

```objective-c
/*
 * 1. Request Authentication Nonce From Layer.  Each nonce is valid for 10 minutes after
 *    creation, after which you will have to generate a new one.
 */
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {

   /*
    * 2. Connect to your Identity Web Service to generate an Identity Token. In addition
    *    to your Layer App ID, User ID, and nonce, you can choose to pass in any other
    *    parameters that make sense (such as a password), depending on your App's login
    *    process.
    */
    NSString *identityToken = ...

    /*
     * 3. Submit identity token to Layer for validation
     */
     [layerClient authenticateWithIdentityToken:identityToken completion:^(NSString *authenticatedUserID, NSError *error) {
         if (authenticatedUserID) {
             NSLog(@"Authenticated as User: %@", authenticatedUserID);
         }
     }];
}];
```

<b>Note:</b> You should never cache the nonce or Identity Token. Both are designed to be used once, and once only. If a user has been authenticated and you request a nonce, the nonce will come back nil. Layer will cache the user so will only need to re-authenticate if the user has been deauthenticated.

You can choose to deauthenticate the User at any point by calling ``. This will effectively "log out" the User, preventing them from sending and receiving messages on the device (and they will not receive notifications). Deauthenticating will also delete any locally stored conversations and messages.

```objective-c
[self.layerClient deauthenticateWithCompletion:^(BOOL success, NSError *error) {
    if (!success) {
        NSLog(@"Failed to deauthenticate user: %@", error);
    } else {
        NSLog(@"User was deauthenticated");
    }
}];
```

```emphasis
**Best Practice**
If your app supports multiple users on a given device, Layer allows each user to send and receive their own messages. Just make sure you deauthenticate when a user logs out and wait for a successful completion before authenticating another user.
```
