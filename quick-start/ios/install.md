#Installation

The simplest way to install LayerKit is with [CocoaPods](http://cocoapods.org). If you have yet to install Cocoapods, you can do so via the following command.

```console
$ sudo gem install cocoapods
```

Next, create a [`Podfile`](http://guides.cocoapods.org/syntax/podfile.html) in the root of your project directory. Navigate to your project's root directory and run `pod init`. This will create `Podfile` for you.

```console
$ pod init
```

Open up the `Podfile` and add the following below your project's target

```
pod 'LayerKit'
```

Save the file and run the following command. Cocoapods will take care of installing LayerKit.

```console
$ pod install --verbose
```

Cocoapods will create a `.xcworkspace` project. Open up that new workspace file using XCode.
