&nbsp;
![](atlas-android-header.png)
# Atlas overview
Atlas is a lightweight, flexible set of user interface components designed to enable developers to quickly and easily integrate native communications experiences into their applications. It was designed and built from the ground up to integrate with the Layer SDK. The Layer SDK provides developers with a simple, object oriented interface to the rich messaging capabilities provided by the Layer platform. Atlas, in turn, provides ready-made UI components that expose these capabilities directly to users.


```emphasis
**Important**
Atlas for Android is currently in Preview Release (Beta). There are many planned changes to the codebase, and support will not be offered until it is deemed ready for General Availability. However, if you wish to use Atlas for Android in your project, it is available through GitHub as is, along with the following documentation.
```

## Setup

Atlas is built on top of the Layer SDK, and both are required to develop a fully featured messaging experience. The Atlas repository is open source, and you can find it [here on GitHub](https://github.com/layerhq/Atlas-Android) if you would like to take a closer look at the project before starting the integration process.

To integrate, you will first need to add the Atlas classes to your project, and then compile with the Layer SDK. After completing this two step process, you can take advantage of all that Layer and Atlas have to offer.

### Step 1: Add the Modules to your Project

You can use Atlas with any new or existing native Android app. Both the Layer SDK and Atlas were built using Android Studio, and there are two ways you can import the modules into your project: you can either use Git Submodule, or add Atlas to your project directly.

#### Option 1: Adding the Layer Atlas modules with Git Submodule

Clone this repo as a submodule in the root of your Android Studio project.

``` sh
git submodule add git@github.com:layerhq/Atlas-Android
```

#### Option 2: Adding the Layer Atlas Modules directly

Clone the Atlas-Android project somewhere outside of your application directory:

``` sh
git clone https://github.com/layerhq/Atlas-Android.git
```

Copy the `layer-atlas` folder to the root of your Android Studio project. Optionally, can also copy the `layer-atlas-messenger` folder if you would like to build the fully featured Messenger example app included with Atlas.

``` sh
/MyAtlasApp/layer-atlas
/MyAtlasApp/layer-atlas-messenger
```

### Step 2: Configure your project settings

You will need to ensure that the Layer SDK and Atlas modules are compiled into your project.

1. Add Layer's GitHub Maven repo to your root `build.gradle` (e.g. `/MyAtlasApp/build.gradle`):

    ``` groovy
    allprojects {
        repositories {
            maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
        }
    }
    ```

2. Add `layer-atlas` project reference to your app's `build.gradle` (e.g. `/MyAtlasApp/app/build.gradle`) along with the LayerSDK:

    ``` groovy
    dependencies {
        compile project(':layer-atlas')

        compile fileTree(dir: 'libs', include: ['*.jar'])
        compile 'com.android.support:appcompat-v7:22.1.1'
        compile 'com.layer.sdk:layer-sdk:%%ANDROID-SDK-VERSION%%'
        compile 'com.google.android.gms:play-services-gcm:7.5.0'
        compile 'org.slf4j:slf4j-nop:1.5.8'
    }
    ```
    **Optional:** If you are interested in building the fully featured Messenger example app included with Atlas, you can add this line to the dependencies: `compile project(':layer-atlas-messenger')`

4. Add `:layer-atlas` module to your project's root `settings.gradle` (e.g. `/MyAtlasApp/settings.gradle`):

    ``` groovy
    include ':app', ':layer-atlas'
    project(':layer-atlas').projectDir = new File('Atlas-Android/layer-atlas')
    ```

     **Optional:** If you are building the example Atlas Messenger app, simply add both the `:layer-atlas` and `:layer-atlas-messenger` modules to the `settings.gradle` like so:

    ``` groovy
    include ':app', ':layer-atlas', ':layer-atlas-messenger'
    project(':layer-atlas').projectDir = new File('Atlas-Android/layer-atlas')
    project(':layer-atlas-messenger').projectDir = new File('Atlas-Android/layer-atlas-messenger')
    ```

5. Click "Sync Project with Gradle Files" in Android Studio.

Build and run your project to verify installation was successful.

Now, you can build and run the Atlas Messenger sample app, or start integrating Layer and Atlas functionality directly into your own app.
