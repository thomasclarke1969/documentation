# Installation

This Quick Start guide will get you up and running with sending messages as quickly as possible. If you are interested in trying out Atlas, Layer's open source user interface components, visit [Experience Atlas](https://developer.layer.com/signup/atlas).

```emphasis
Before you get started, we highly recommend that you download the [Quick Start iOS Xcode project](https://github.com/layerhq/quick-start-ios). To install the Quick Start iOS Xcode project execute this command from your Terminal window:
```
```console
curl -L https://raw.githubusercontent.com/layerhq/quick-start-ios/master/install.sh | bash -s "%%C-INLINE-APPID%%"
```

The simplest way to install LayerKit is with [CocoaPods](http://cocoapods.org). If you don't want to use Cocoapods follow these manual import [instructions](https://support.layer.com/hc/en-us/articles/204256740-Can-I-use-LayerKit-without-Cocoapods-). If you have yet to install Cocoapods, you can do so via the following command.

```console
sudo gem install cocoapods
```

If this is your first time running Cocoapods, execute the setup command.

```console
pod setup
```

Next, create a [`Podfile`](http://guides.cocoapods.org/syntax/podfile.html) in the root of your project directory. Navigate to your project's root directory and run `pod init`. This will create `Podfile` for you.

```console
pod init
```

Open up the `Podfile` and add the following below your project's target

```
pod 'LayerKit'
```

Save the file and run the following command. Cocoapods will take care of installing LayerKit.

```console
pod install --verbose
```

Cocoapods will create a `.xcworkspace` project. Open up that new workspace file using Xcode.
