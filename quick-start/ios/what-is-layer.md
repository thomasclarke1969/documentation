# What is Layer?

The Layer SDKs represent the easiest way to add rich communication features to your application.
They handle the hard parts of messaging including synchronization of messages and message states across devices, offline message support, push notifications and more.

```emphasis
Please note, you have been given access to pre-production version of the Layer service. We do not recommend using the service in production applications at this time. Please contact [The Layer Growth Team](mailto:growth@layer.com) with questions about commercial terms and availability.
```

# Quick Start
This quick start guide will get you up and running with sending messages as quickly as possible. However, once you have tested out Layer using this guide, you will need to alter how authentication is done by creating your own backend controller that generates an Identity Token.

##Install the Layer SDK libraries using CocoaPods

```
//Install cocoapods if you don't have it
$ sudo gem install cocoapods

//Navigate to your project's root directory and run `pod init` to create a `Podfile`.
$ pod init
```

Open up the `Podfile` and add the following below your project's target

```
pod 'LayerKit'
```

Save the file and run the following to install LayerKit.

```
$ pod install --verbose
```

Cocoapods will create a .xcworkspace project. Open up that new workspace file using XCode.

#Connecting
Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```

```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

Copy and paste the following into `application:DidFinishLaunchingWithOptions:` in your `AppDelegate`.

```objectivec
// Initializes a LYRClient object
NSUUID *appID = [[NSUUID alloc] initWithUUIDString:@"%%C-INLINE-APPID%%"];
LYRClient *layerClient = [LYRClient clientWithAppID:appID];

// Tells LYRClient to establish a connection with the Layer service
[layerClient connectWithCompletion:^(BOOL success, NSError *error) {
    if (success) {
        NSLog(@"Client is Connected!");
    }
}];
```

#Authenticate
Once connected, the authentication process starts. Insert the following code and replace `INSERT_USER_ID` with a valid User Id.

```emphasis
Please note, the Identity Service is only available for testing purposes and cannot be used in production applications.
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

#Send a Message
Insert the following code somewhere in your application's logic.

```objectivec
// Declares a MIME type string
static NSString *const MIMETypeTextPlain = @"text/plain";

// Creates and returns a new conversation object with a single participant represented by
// your backend's user identifier for the participant
LYRConversation *conversation = [LYRConversation conversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]]];

// Creates a message part with a text/plain MIMEType
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];

// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];

// Sends the specified message
[layerClient sendMessage:message error:nil];
```

The main Layer messaging concepts and their function are the following:

* **Conversation** - represented by the [LYRConversation](/docs/api/ios#lyrconversation) object in LayerKit. Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent with LayerKit are sent within the context of conversation.

* **Message** - represented by the [LYRMessage](/docs/api/ios#lyrmessage) object in LayerKit. Messages can be made up of one or many individual pieces of content. Messages have a file size limit of 64kb.

* **Message Part** - represented by the [LYRMessagePart](/docs/api/ios#lyrmessagepart) object in LayerKit. Message parts represent the individual pieces of content embedded within a message. MessageParts take an `NSData` object and a MIME type string. LayerKit does not enforce any restrictions on the type of data you send, nor the MIME types your applications wishes to support.
