#Authentication

Layer authentication requires that a backend server generate an `Identity Token` on behalf of the client application. For testing purposes, Layer provides a sample backend that takes care of this. 

The following code snippet connects to the sample `Layer Identity Service`,  generates an `Identity Token` on behalf your applicaion, and authenticates the `LYRClient`. Copy and paste the entire snippet into your application. You will need to replace `REPLACE_WITH_USER_ID` with `string` of your chosing (typically a user identifier).

```objective-c
NSString *userIDString = @"REPLACE_WITH_USER_ID";

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

    NSDictionary *parameters = @{ @"app_id": [layerClient.appID UUIDString], @"user_id": userIDString, @"nonce": nonce };
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

```emphasis
Please note, the Layer Identity Service cannot be used in production applications. You will need to implement the backend portion of Layer authentication prior to launching into production. Please see the [Layer Authentication Guide](#authentication-guide) for information on doing so.
```

