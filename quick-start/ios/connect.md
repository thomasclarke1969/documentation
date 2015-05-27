#Connecting

Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```
```objectivec
//Please note, You must set `LYRClient *layerClient` as a property of the AppDelegate.
@property (nonatomic) LYRClient *layerClient;
```
```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

Copy and paste the following into `application:didFinishLaunchingWithOptions:` in your `AppDelegate`.

```objectivec

NSUUID *appID = [[NSUUID alloc] initWithUUIDString:@"%%C-INLINE-APPID%%"];
self.layerClient = [LYRClient clientWithAppID:appID];
[self.layerClient connectWithCompletion:^(BOOL success, NSError *error) {
    if (!success) {
        NSLog(@"Failed to connect to Layer: %@", error);
    } else {
    	  // For the purposes of this Quick Start project, let's authenticate as a user named 'Device'.  Alternatively, you can authenticate as a user named 'Simulator' if you're running on a Simulator.
        NSString *userIDString = @"Device";
        // Once connected, authenticate user.
        // Check Authenticate step for authenticateLayerWithUserID source
        [self authenticateLayerWithUserID:userIDString completion:^(BOOL success, NSError *error) {
            if (!success) {
                NSLog(@"Failed Authenticating Layer Client with error:%@", error);
            }
        }];
    }
}];
```

```emphasis
The source for `authenticateLayerWithUserID` is included in the next step in [Quick Start](/docs/quick-start/ios#authenticate).
```
