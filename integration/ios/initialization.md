# Initialization

Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```

The [LYRClient](docs/api/ios#lyrclient) object represents the primary interface for interacting with the Layer service. Your application should only instantiate one instance of [LYRClient](docs/api/ios#lyrclient) and should retain the instance at all times. The object is initialized with an application key. 

```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

This key is specific to your application and should be kept private at all times. Copy and paste the following into `application:DidFinishLaunchingWithOptions:` in your `AppDelegate`.

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

On subsequent application launches, `LayerKit` will attempt to establish a network connection on its own. You can inspect `LayerKit`'s connection state via the public property `isConnected` on [LYRClient](/docs/api/ios#lyrclient) 

```
if (layerClient.isConnected) {
	// LayerKit is connected, no need to call connectWithCompletion:
} 
```

You can create additional Layer applications by visiting our [developer dashboard](/dashboard/project/new).
