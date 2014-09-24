# Authentication

The Layer service is built to work with your existing backend application and existing users. Layer Authentication allows you to represent your users within the Layer service without sharing credentials. In order to do this, it requires that your backend server application generate identity tokens on behalf of your client application. 

For a comprehensive guide on setting up the backend portion of Layer Authentication, please visit the [Layer Authentication Guide](/docs/resources#authentication-guide). 

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

```emphasis
If you would like to test LayerKit without performing any backend setup, Layer provides a service that can generate identityTokens on behalf of your application. Please note, this service is only available for testing purposes and cannot be used in production applications. 
```

In order to acquire an identity token, you will need to post your `applciationID`, a `nonce` (obtained via a call to `requestAuthenticationNonce:completion`) and a `userID` to the identityToken service. The following code can be copied into your application. You must replace the values for `userIDString` and `nonce`.

```objectivec
NSString *appIDString = @"45cebb60-2899-11e4-8906-5cdb00004adc"; // Your Layer application ID
NSString *userIDString = @"INSERT_USER_ID"; // The userID representing the user attempting to authenticate
NSString *nonce = @"INSERT_NONCE"; // The nonce obtained from LayerKit
    
// Configure a Network Request
NSURL *identityTokenURL = [NSURL URLWithString:@"https://layer-identity-provider.herokuapp.com/identity_tokens"];
NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:identityTokenURL];
request.HTTPMethod = @"POST";
[request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
[request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    
NSDictionary *parameters = @{ @"app_id": appIDString, @"user_id": userIDString, @"nonce": nonce };
NSData *requestBody = [NSJSONSerialization dataWithJSONObject:parameters options:0 error:nil];
request.HTTPBody = requestBody;
    
NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
NSURLSession *session = [NSURLSession sessionWithConfiguration:sessionConfiguration];
[[session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        
    // Deserialize the resonse
    NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        
    /*
     *The identity token that must be subitted to layer for validation
     */
    NSString *identityToken = responseObject[@"identity_token"];  
        
}] resume];
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


