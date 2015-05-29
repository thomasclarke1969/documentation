&nbsp;
![](atlas-ios-header.png)
# Atlas Overview
Atlas is a lightweight, flexible set of user interface components designed to enable developers to quickly and easily integrate native communications experiences into their applications. It was designed and built from the ground up to integrate with LayerKit, the native iOS SDK for accessing the Layer communications platform. LayerKit provides developers with a simple, object oriented interface to the rich messaging capabilities provided by the Layer platform. Atlas, in turn, provides ready-made UI components that expose these capabilities directly to users.

## Installation

Atlas can be installed directly into your application via CocoaPods or by directly importing the source code files. Please note that Atlas has a direct dependency on LayerKit that must be satisfied in order to build the components.

#### CocoaPods Installation

The recommended path for installation is [CocoaPods](http://cocoapods.org/). You can add Atlas to your project via CocoaPods by adding the following line to your Podfile:

```ruby
pod 'Atlas'
```

Complete the installation by executing:

```sh
$ pod install
```

#### Source Code Installation

If you wish to install Atlas directly into your application from source, then clone the [repository](https://github.com/layerhq/Atlas-iOS) and add code and resources to your application:

1. Drag and drop the files from the `Code` and `Resources` directories onto your project, instructing Xcode to copy items into your destination group's folder.
2. Update your project settings to include the linker flags: `-ObjC -lz`
3. Add the following Cocoa SDK frameworks to your project: `'CFNetwork', 'Security', 'MobileCoreServices', 'SystemConfiguration', 'CoreLocation'`

Build and run your project to verify installation was successful.
For more information, check out the [Atlas](https://github.com/layerhq/Atlas-iOS) on Github.