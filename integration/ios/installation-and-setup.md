# Installation

```emphasis
Skip this section if you've already done it in the Quick Start guide.
```

The simplest way to add LayerKit to your application is with [CocoaPods](http://www.cocoapods.org). CocoaPods provides a simple, versioned dependency management system that automates configuring libraries and frameworks. You can install Cocoapods via the following command.

```console
$ sudo gem install cocoapods
```

Navigate to your project's root directory and run `pod init` to create a `Podfile`.

```console
$ pod init
```

Open up the `Podfile` and add the following below your project's target

```
pod 'LayerKit'
```

Save the file and run the following to install LayerKit.

```console
$ pod install --verbose
```

Cocoapods will download and install LayerKit and also create a .xcworkspace project.

If you do not want to use CocoaPods, you can also clone the LayerKit repository from [Github](https://github.com/layerhq/releases-ios) and install the framework directly.


```collapse
## Setup

If you clone the `LayerKit` repos or download the source, you will need to drag the framework directly into your project.

  1. Open up LayerKit and locate LayerKit.embeddedframework
    ![image alt text](ios-installation-1.jpg)

  2. Drag LayerKit.embeddedframework into the Frameworks folder in your XCode project
    ![image alt text](ios-installation-2.jpg)

  3. Make sure "Copy items into destination group's folder" option is checked
    ![image alt text](ios-installation-3.jpg)

## Link Dependencies

LayerKit needs a few other frameworks to be included in your project in order to function properly.

  1. In XCode, navigate to your Target Settings
    ![image alt text](ios-installation-4.jpg)

  2. Select the "Build Phases" section and expand the "Link Binary With Libraries". Add the following frameworks to your project:

    * `SystemConfiguration.framework`
    * `CFNetwork.framework`
    * `MobileCoreServices.framework`
    * `Security.framework`
    ![image alt text](ios-installation-5.jpg)

  3. Navigate to your "Build Settings" tab and add the `-ObjC` and `-lz` flag to the "Other Linker Flags" setting.
    ![image alt text](ios-installation-6.jpg)

```

##Connect LayerKit

Import the LayerKit headers into your `AppDelegate.h`

```objectivec
#import <LayerKit/LayerKit.h>
```

The [LYRClient](docs/api/ios#lyrclient) object is the primary interface for interacting with the Layer service. Only one instance of [LYRClient](docs/api/ios#lyrclient) should be instantiated and used at all times. The object is initialized with an application key.

```emphasis
We have created an application for you titled, %%C-INLINE-APPNAME%%, and the sample code below contains your application's key.
```

Key's are application specific and should be kept private. Copy and paste the following into `application:didFinishLaunchingWithOptions:` in your `AppDelegate`.

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

