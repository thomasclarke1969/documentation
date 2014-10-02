# Quick Start
This quick start guide will get you up and running with sending messages as quickly as possible. However, once you have tested out Layer using this guide, you will need to alter how authentication is done by creating your own backend controller that generates an Identity Token.

##Install the Layer SDK libraries using CocoaPods

Install Cocoapods via the following command if you don't already have it.

```
$ sudo gem install cocoapods
```

Navigate to your project's root directory and run `pod init` to create a `Podfile`.

```
pod init
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
