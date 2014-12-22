#Connecting

Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```

```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

Copy and paste the following into `application:didFinishLaunchingWithOptions:` in your `AppDelegate`.

```objectivec
NSUUID *appID = [[NSUUID alloc] initWithUUIDString:"@%%C-INLINE-APPID%%"];
self.layerClient = [LYRClient clientWithAppID:appID];
[self.layerClient connectWithCompletion:^(BOOL success, NSError *error) {
    if (!success) {
        NSLog(@"Failed to connect to Layer: %@", error);
    } else {
        NSString *userIDString = @"REPLACE_WITH_YOUR_USER_ID";
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
Please note, the source for `authenticateLayerWithUserID` is included in the next step in [Quick Start](https://developer.layer.com/docs/quick-start/ios#authenticate).
```