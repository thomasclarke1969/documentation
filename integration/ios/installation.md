# Installation

The simplest way to add LayerKit to your application is with [CocoaPods](http://www.cocoapods.org). CocoaPods provides a simple, versioned dependency management system that automates configuring libraries and frameworks. You can install Cocoapods via the following command.

```
$ sudo gem install cocoapods
```

Navigate to your project's root directory and run `pod init` to create a `Podfile`.

```
pod init
```

Open up the `Podfile` and add the following:

```
pod 'LayerKit'
```

Save the file and run the following to install LayerKit.

```
$ pod install
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
    * `MobileCoreServices.framwork`
    * `Security.framework`
    ![image alt text](ios-installation-5.jpg)

  3. Navigate to your "Build Settings" tab and add the `-ObjC` and `-lz` flag to the "Other Linker Flags" setting.
    ![image alt text](ios-installation-6.jpg)
    
```

