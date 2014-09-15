# Authentication

Layer Authentication requires that your backend server application generate identity tokens on behalf of your client application. Please see the [Layer Authentication Guide](/docs/resources#authentication-guide) for a comprehsive guide on setting up Layer Authentication.

The native authentication methods your application will need to implement are the following.

```objectivec
// Requests an authentication nonce from Layer. The nonce is used in the generation of a 
// Layer Identity Token 
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {
   NSLog(@"Authentication nonce %@", nonce);
   
   /*
    * Upon receipt of nonce, post to your backend and acquire a Layer identityToken
    */
   
	// Submit the identity token to Layer for approval. Updon successful completion,
	// LayerKit is authenticated and ready to start sending messages
	[layerClient authenticateWithIdentityToken:@"generatedIdenityToken" completion:^(NSString *authenticatedUserID, NSError *error) {
	    NSLog(@"Authenticated as %@", authenticatedUserID);
	}];
}];
```

Once authenticated, LayerKit caches credentials and will attempt to reauthenticate itself on subsequent sessions. You can check to see if your [LYRClient](/docs/api/ios#lyrclient) object is authenticated by inspecting the public property `authenticatedUserID`.

```objectivec
// authenticatedUserID will return non-nil is LayerKit is authenticated
if (layerClient.authenticatedUserID) {
	NSLog(@"Layer Client is authenticated and can send messages");
} else {
	NSLog(@"Layer Client is not authenticated, attempt to reauthenticate");
}
```

## Client Delegate 

[LYRClient](/docs/api/ios#lyrclient)  declares a delegate protocol which alerts your application to specific events occurring within the SDK. These include authentication events. We recommend you set up a `LYRCLientDelegate` controller object (`NSObject`) which your application should retain in order to handle delegate calls.    

```objectivec
@interface ExampleLayerController : NSObject <LYRClientDelegate>

@end

@implementation ExampleLayerController

// The only required LYRClientDelegate method. Called when LayerKit receives an 
// authentication challenge. Method implmentation should attempt to reauthenticate
// LayerKit. See the Layer Authentication Guide for more information on an authentication
// challenge.
- (void)layerClient:(LYRClient *)client didReceiveAuthenticationChallengeWithNonce:(NSString *)nonce
{
	NSLog(@"Client Did Receive Authentication Challenge with Nonce %@", nonce);
}

// Called when your application has succesfully authenticated a user via LayerKit
- (void)layerClient:(LYRClient *)client didAuthenticateAsUserID:(NSString *)userID
{
    NSLog(@"Client Did Authenticate As %@", userID);
}

// Called when you succesfully logout a user via LayerKit
- (void)layerClientDidDeauthenticate:(LYRClient *)client
{
	NSLog(@"Client did deauthenticate the user");
} 
```


