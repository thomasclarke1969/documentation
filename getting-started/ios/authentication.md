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


## Client Delegate

[LYRClient](/docs/api/ios#lyrclient)  declares a delegate protocol which alerts your application to specific events occurring within the SDK. These include authentication events. We recommend you set up a `LYRCLientDelegate` controller object (`NSObject`) which your application should retain in order to handle delegate calls.

```objectivec
@interface ExampleLayerController : NSObject <LYRClientDelegate>

@end

@implementation ExampleLayerController

// The only required LYRClientDelegate method. Called when LayerKit receives an
// authentication challenge. Method implementation should attempt to re-authenticate
// LayerKit. See the Layer Authentication Guide for more information on an authentication
// challenge.
- (void)layerClient:(LYRClient *)client didReceiveAuthenticationChallengeWithNonce:(NSString *)nonce
{
	NSLog(@"Client Did Receive Authentication Challenge with Nonce %@", nonce);
}

// Called when your application has successfully authenticated a user via LayerKit
- (void)layerClient:(LYRClient *)client didAuthenticateAsUserID:(NSString *)userID
{
    NSLog(@"Client Did Authenticate As %@", userID);
}

// Called when you successfully logout a user via LayerKit
- (void)layerClientDidDeauthenticate:(LYRClient *)client
{
	NSLog(@"Client did de-authenticate the user");
}
```

##Authentication Challenge
At certain times throughout the lifecycle of a Layer application, the Layer service may issue an authentication challenge to LayerKit. This challenge can occur for many reasons including expiration of tokens. Upon receiving a challenge, LayerKit effectively goes into an ‘offline state’ until you re-authenticate. Your application must implement the following LYRClientDelegate method in order to handle authentication challenges.

```objectivec
- (void)layerClient:(LYRClient *)client didReceiveAuthenticationChallengeWithNonce:(NSString *)nonce
{
  // Make a call to your backend server to obtain a Layer Identity Token including the nonce
}
```

The challenge delegate method supplies a nonce for you, so there is no need to request another one from from the SDK. Instead you should proceed with generating the `Identity Token` and then submit to LayerKit for validation via

```objectivec
// Authenticates a Layer application with an Identity Token. Upon completion of this
// method, the LayerKit is ready to start sending and receiving messages
[self.client authenticateWithIdentityToken:@"IDENTITY_TOKEN" completion:^(NSString *remoteUserID, NSError *error) {
    if (!error) {
       NSLog(@"Successful Auth with userID %@", remoteUserID);
    } else {
      NSLog(@"Client did fail authentication with Error:%@", error);
    }
}];
```
