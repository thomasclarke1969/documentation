&nbsp;
![](atlas-android-header.png)
# Atlas overview
Atlas is a lightweight, flexible set of user interface components designed to enable developers to quickly and easily integrate native communications experiences into their applications. It was designed and built from the ground up to integrate with the Layer SDK. The Layer SDK provides developers with a simple, object oriented interface to the rich messaging capabilities provided by the Layer platform. Atlas, in turn, provides ready-made UI components that expose these capabilities directly to users.

## Setup

Atlas is built on top of the Layer SDK, and both are required to develop a fully featured messaging experience. The Atlas repository is open source, and you can find it [here on GitHub](https://github.com/layerhq/Atlas-Android). Check the GitHub repo for documentation and reference material. For a fully-featured messaging app, see the open source [Atlas Messenger](https://github.com/layerhq/Atlas-Android-Messenger) project, which uses this Atlas library and the Layer SDK.

#### Maven Installation

The recommended path for installation is to include the AAR via Maven. Add the following to the project's `build.gradle` file:

```groovy
repositories {
    maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
    maven { url "https://raw.githubusercontent.com/layerhq/Atlas-Android/master/releases/" }
}

dependencies {
    compile 'com.layer.atlas:layer-atlas:0.2.10'
}
```
