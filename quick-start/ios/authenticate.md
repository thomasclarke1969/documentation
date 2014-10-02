#Authenticate
Once connected, you will need to start the authentication process. The following code will complete the authentication process by connecting to the Layer Identity Serivce.
You will need to replace `INSERT_USER_ID` with a valid User Id.

```emphasis
Please note, the following code is only for testing purposes. It connects to the Layer Identity Service which is only available for testing purposes and cannot be used in production applications. You will need to create your own backend controller to generate an Identity Token once you've finished testing.
```

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

        // Deserialize the response
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
