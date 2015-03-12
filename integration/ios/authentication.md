#Authenticate

Once connected, Layer requires every user to be authenticated before they can send and recieve messages. The Authentication process lets you explicitly allow a given user to communicate with other users in your App. A user is defined by their User ID, which can be any sort of unique identifer, including ones that you are already using for user managment (this could be a UDID, username, email address, phone number, etc).

To authenticate a user, you must set up your own Authentication Web Service where you can validate a user's credentials and create an Identity Token. That Identity Token is returned to your App, and then passed on to the Layer servers. If the Identity Token is valid, the Authentication process will complete, and that user's message history will sync to the device. For more information about configuring your own Authentication Web Service check out the [Authentication Guide](https://developer.layer.com/docs/guides#authentication). 

```emphasis
Keep in mind that the sample Web Service provided in the [Quick Start Guide](https://developer.layer.com/docs/quick-start/android) is for testing purposes only and **cannot** be used in production.
```

If you'd like to learn more about Authentication and the Authentication process, this [Knowledge Base article](https://support.layer.com/hc/en-us/articles/204225940-How-does-Authentication-work-) is a good place to start. 

You can use this as a template to connect to your own Identity Service, which will return an Idenity Token.

```objective-c
NSString *userIDString = @"REPLACE_WITH_USER_ID";

/*
* 1. Request Authentication Nonce From Layer
*/
[layerClient requestAuthenticationNonceWithCompletion:^(NSString *nonce, NSError *error) {

    /*
    * 2. Connect to your Identity Web Service. In addition to your Layer App ID, User ID, and nonce, you can
    *    choose to pass in any other parameters that make sense (such as a password), depending on your App's 
    *    login process.
    */
    NSURL *identityTokenURL = [NSURL URLWithString:@"https://your-identity-provider.com/authenticate"];
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
**Best Practice**

If your app supports multiple users on a given device, Layer allows each user to send and receive their own messages. Just make sure you deauthenticate when a user logs out and wait for the appropriate callback before authenticating another user.
```
