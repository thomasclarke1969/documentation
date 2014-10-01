# Authentication

The Layer service is built to work with your existing backend application and existing users. Layer Authentication allows you to represent your users within the Layer service without sharing credentials. In order to do this, it requires that your backend server application generate identity tokens on behalf of your client application.

##Client Authentication Flow
The Layer Identity Token must be obtained via a call to your backend application. The identity token must include a nonce value that was obtained from the SDK via a call to the public method on the `[LYRClient](api/ios#lyrclient) object`, `requestAuthenticationNonceWithCompletion`. The token must then be submitted to Layer via another `[LYRClient](api/ios#lyrclient)` method `authenticateWithIdentityToken:completion`.

Procedurally, the flow looks like the following.

1. Request an authentication nonce from LayerKit via a call to `requestAuthenticationNonceWithCompletion:`.

2. Post the authentication nonce to your backend in order to generate an identity token.

3. Submit the identity token returned from your backend application to Layer for validation via a call to `authenticateWithIdentityToken:completion`.

```objectivec
/*
 * 1. Request Authentication Nonce From Layer
 */
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {
   NSLog(@"Authentication nonce %@", nonce);

   /*
    * 2. Upon receipt of nonce, post to your backend and acquire a Layer identityToken  
    */

   /*
    * 3. Submit identity token to Layer for validation
    */
  [layerClient authenticateWithIdentityToken:@"generatedIdenityToken" completion:^(NSString *authenticatedUserID, NSError *error) {
     NSLog(@"Authenticated as %@", authenticatedUserID);
  }];
}];
```

For a comprehensive guide on generating identity tokens via your backend application, please visit the [Identity Tokens](/docs/getting-started#identity-tokens) section.
