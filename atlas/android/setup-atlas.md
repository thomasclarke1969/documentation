&nbsp;
![](atlas-android-header.png)
# Atlas Overview
Atlas is a lightweight, flexible set of user interface components designed to enable developers to quickly and easily integrate native communications experiences into their applications. It was designed and built from the ground up to integrate with the Layer SDK. The Layer SDK provides developers with a simple, object oriented interface to the rich messaging capabilities provided by the Layer platform. Atlas, in turn, provides ready-made UI components that expose these capabilities directly to users.

## Step 1: Add the Modules to your Project

You can use Atlas with any new or existing native Android app. Both the Layer SDK and Atlas were built using Android Studio, and there are two ways you can import the modules into your project:

#### Option 1: Adding the Layer Atlas Modules with Git Submodule

Clone this repo as a submodule in the root of your Android Studio project.

``` sh
git submodule add git@github.com:layerhq/Atlas-Android
```

#### Option 2: Adding the Layer Atlas Modules Directly

Clone the Atlas-Android project somewhere outside of your application directory:

``` sh
git clone https://github.com/layerhq/Atlas-Android.git
```

Copy the `layer-atlas` folder to the root of your Android Studio project. Optionally, can also copy the `layer-atlas-messenger` folder if you would like to build the fully featured Messenger example app included with Atlas.

``` sh
/MyAtlasApp/layer-atlas
/MyAtlasApp/layer-atlas-messenger
```

## Step 2: Configure your Project Settings

You will need to ensure that the Layer SDK and Atlas modules are compiled into your project.

1. Add Layer's GitHub Maven repo to your root `build.gradle` (e.g. `/MyAtlasApp/build.gradle`):

    ``` groovy
    allprojects {
        repositories {
            maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
        }
    }
    ```

2. Add `layer-atlas` project reference to your app's `build.gradle` (e.g. `/MyAtlasApp/app/build.gradle`) along with the LayerSDK.

    ``` groovy
    dependencies {
        compile project(':layer-atlas')

        compile fileTree(dir: 'libs', include: ['*.jar'])
        compile 'com.android.support:appcompat-v7:22.1.1'
        compile 'com.google.android.gms:play-services-base:6.5.+'
        compile 'com.layer.sdk:layer-sdk:0.13.3'
        compile 'org.slf4j:slf4j-api:1.7.7'
    }
    ```
    **Optional:** If you are interested in building the fully featured Messenger example app included with Atlas, you can add this line to the dependencies: `compile project(':layer-atlas-messanger')`

4. Add `:layer-atlas` module to your project's root `settings.gradle` (e.g. `/MyAtlasApp/settings.gradle`):

    ``` groovy
    include ':app', ':layer-atlas'
    project(':layer-atlas').projectDir = new File('Atlas-Android/layer-atlas')
    ```

     **Optional:** If you are building the example Atlas Messanger app, simply add both the `:layer-atlas` and `:layer-atlas-messenger` modules to the `settings.gradle` like so:

    ``` groovy
    include ':app', ':layer-atlas', ':layer-atlas-messenger'
    project(':layer-atlas').projectDir = new File('Atlas-Android/layer-atlas')
    project(':layer-atlas-messenger').projectDir = new File('Atlas-Android/layer-atlas-messenger')
    ```

5. Click "Sync Project with Gradle Files" in Android Studio

Build and run your project to verify installation was successful.
For more information, check out [Atlas](https://github.com/layerhq/Atlas-Android) on Github.
