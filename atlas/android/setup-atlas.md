![Image](https://github.com/layerhq/Atlas-Android/blob/master/assets/atlas-github-header.png)

# Atlas Overview
Atlas is a lightweight, flexible set of user interface components designed to enable developers to quickly and easily integrate native communications experiences into their applications. It was designed and built from the ground up to integrate with the Layer SDK. The Layer SDK provides developers with a simple, object oriented interface to the rich messaging capabilities provided by the Layer platform. Atlas, in turn, provides ready-made UI components that expose these capabilities directly to users.

## Installation

Create a new project in Android Studio called "MyAtlasApp". Make sure you specify that you are building for Phones and Tablets, and add a Blank Activity to your project. Now you can import the Layer SDK and Atlas into your project.

There are two ways to import Atlas in Android Studio:

#### Option 1: Adding Layer Atlas with Git Submodule
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
        compile 'com.google.android.gms:play-services-base:6.5.+'
        compile 'com.layer.sdk:layer-sdk:0.13.3'
        compile 'org.slf4j:slf4j-api:1.7.7'
    }
    ```

3. Clone this repo as a submodule in the root of your Android Studio project.

    ``` sh
    git submodule add git@github.com:layerhq/Atlas-Android
    ```

    Note: If git is not initialized, you may need to call `git init` before adding the submodule.

4. Add `:layer-atlas` module to your project's root `settings.gradle` (e.g. `/MyAtlasApp/settings.gradle`):

    ``` groovy
    include ':app', ':layer-atlas', ':layer-atlas-messenger'
    project(':layer-atlas').projectDir = new File('Atlas-Android/layer-atlas')
    project(':layer-atlas-messenger').projectDir = new File('Atlas-Android/layer-atlas-messenger')
    ```

5. Click "Sync Project with Gradle Files" in Android Studio

#### Option 2: Without Git Submodule
1. Add Layer's GitHub Maven repo to your root `build.gradle` (e.g. `/MyAtlasApp/build.gradle`):

    ``` groovy
    allprojects {
        repositories {
            maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
        }
    }
    ```

2. Add `layer-atlas` project reference to your app's `build.gradle` (e.g. `/MyAtlasApp/app/build.gradle`) along with the Layer SDK:

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

3. Clone the Atlas-Android project somewhere outside of your application directory:

    ``` sh
    git clone https://github.com/layerhq/Atlas-Android.git
    ```
    Note: If git is not initialized, you may need to call `git init` before cloning the repository.

4. Copy the `layer-atlas` and `layer-atlas-messager` folders to the root of your AndroidStudio project:

    ``` sh
    /MyAtlasApp/layer-atlas
    /MyAtlasApp/layer-atlas-messenger
    ```

5. Add `:layer-atlas` and `:layer-atlas-messenger` modules to your project's root `settings.gradle` (e.g. `/MyAtlasApp/settings.gradle`):

    ``` groovy
    include ':app', ':layer-atlas', ':layer-atlas-messenger'
    ```

6. Click "Sync Project with Gradle Files" in Android Studio

Build and run your project to verify installation was successful.
For more information, check out [Atlas](https://github.com/layerhq/Atlas-Android) on Github.
