#Connecting

Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```

The [LYRClient](docs/api/ios#lyrclient) object is the primary interface for interacting with the Layer service. Only one instance of [LYRClient](docs/api/ios#lyrclient) should be instantiated and used at all times. The object is initialized with an application key.

```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

Key's are application specific and should be kept private. Copy and paste the following into `application:DidFinishLaunchingWithOptions:` in your `AppDelegate`.

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

You can inspect `LayerKit`'s connection state via the public property `isConnected` on [LYRClient](/docs/api/ios#lyrclient). This is useful on subsequent application launches.

```
if (layerClient.isConnected) {
	// LayerKit is connected, no need to call connectWithCompletion:
}
```
