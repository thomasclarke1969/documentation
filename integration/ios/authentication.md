# Authentication

The Layer service is built to work with your existing backend application and existing users. Layer Authentication allows you to represent your users within the Layer service without sharing credentials. In order to do this, it requires that your backend server application generate identity tokens on behalf of your client application. 

The steps to authenticate a user with Layer are the following:

1. Request an authentication nonce from LayerKit via a call to the `LYRClient` method, `requestAuthenticationNonceWithCompletion:`. 

2. Post the authentication nonce to your backend in order to generate an identity token. 

3. Submit the identity token returned from your backend application to Layer for validation via a call to `authenticateWithIdentityToken:completion`.


##Identity Token 

For a comprehensive guide on generating identity tokens via your backend application, please visit the [Layer Authentication Guide](/docs/resources#authentication-guide). For convenince, Layer also provides an Identity Service that can generate identity tokens on behalf of your application. 


```emphasis
Please note, the Identity Service is only available for testing purposes and cannot be used in production applications.
```

The following code can be implemented in your application and can be used to generate identity tokens. 

```
NSString *userIDString = @"INSERT_USER_ID";

/*
 * 1. Request Authentication Nonce From Layer
 */
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {
    
    /*
     * 2. Acquire identity Token from Layer Identity Service
     */
    NSURL *identityTokenURL = [NSURL URLWithString:@"https://layer-identity-provider.herokuapp.com/identity_tokens"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:identityTokenURL];
    request.HTTPMethod = @"POST";
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    
    NSDictionary *parameters = @{ @"app_id": layerClient.appID, @"user_id": userIDString, @"nonce": nonce };
    NSData *requestBody = [NSJSONSerialization dataWithJSONObject:parameters options:0 error:nil];
    request.HTTPBody = requestBody;
    
    NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:sessionConfiguration];
    [[session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        
        // Deserialize the resonse
        NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *identityToken = responseObject[@"identity_token"];
        
        /*
         * 3. Submit identity token to Layer for validation
         */
        [layerClient authenticateWithIdentityToken:identityToken completion:^(NSString *authenticatedUserID, NSError *error) {
            if (authenticatedUserID) {
                NSLog(@"Authenticated as User: %@", authenticatedUserID);
            }
        }];
        
    }] resume];
}];
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


