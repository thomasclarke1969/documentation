# Installation

The simplest way to add LayerKit to your application is with [CocoaPods](http://www.cocoapods.org). CocoaPods provides a simple, versioned dependency management system that automates configuring libraries and frameworks. You can install Cocoapods via the following command. If you don't want to use Cocoapods follow these manual import [instructions](https://support.layer.com/hc/en-us/articles/204256740-Can-I-use-LayerKit-without-Cocoapods-).

```emphasis
LayerKit requires CocoaPods v0.39 or higher.
```

```console
$ sudo gem install cocoapods
```

Navigate to your project's root directory and run `pod init` to create a `Podfile`.

```console
$ pod init
```

Open up the `Podfile` and add `LayerKit` to your project's target. LayerKit is a [dynamic framework](http://blog.cocoapods.org/CocoaPods-0.36/) so the `use_frameworks!` tag also needs to be added to your Podfile. Here's an example Podfile:

```
platform :ios, '8.0'
use_frameworks!

target 'MyAwesomeApp' do
  pod 'LayerKit'
end
```

Save the file and run the following to install LayerKit.

```console
$ pod install --verbose
```

Cocoapods will download and install LayerKit and also create a .xcworkspace project.

If you're are supporting iOS 9 (regardless if you're using Cocoapods or not) you need to follow [these instructions](https://support.layer.com/hc/en-us/articles/205034154) and update your Info.plist.

## Connect LayerKit

Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```

The [LYRClient](docs/ios/api#lyrclient) object is the primary interface for interacting with the Layer service. Only one instance of [LYRClient](docs/ios/api#lyrclient) should be instantiated and used at all times. The object is initialized with an application key.

```objectivec
//Please note, You should set `LYRClient *layerClient` as a property of the AppDelegate.
@interface AppDelegate () <LYRClientDelegate>
@property (nonatomic) LYRClient *layerClient;
@end
```

```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

Key's are application specific and should be kept private. Copy and paste the following into `application:didFinishLaunchingWithOptions:` in your `AppDelegate`.

```objectivec
// Initializes a LYRClient object
NSURL *appID = [NSURL URLWithString:@"%%C-INLINE-APPID%%"];
self.layerClient = [LYRClient clientWithAppID:appID];

// Tells LYRClient to establish a connection with the Layer service
[self.layerClient connectWithCompletion:^(BOOL success, NSError *error) {
    if (success) {
        NSLog(@"Client is Connected!");
    }
}];
```

You can inspect `LayerKit`'s connection state via the public property `isConnected` on [LYRClient](/docs/ios/api#lyrclient). This is useful on subsequent application launches.

```
if (self.layerClient.isConnected) {
	// LayerKit is connected, no need to call connectWithCompletion:
}
```

