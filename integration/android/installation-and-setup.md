# Installation

The Layer Android SDK is built and designed to be used with [Android Studio](https://developer.android.com/sdk/index.html). The SDK is available via an AAR or JAR file hosted on [Github](https://github.com/layerhq/releases-android), and can be added to your project by refrencing the AAR remotely with maven, or by importing the JAR locally.

<b>Note:</b> If you are developing with Eclipse, you can follow [these instructions](https://support.layer.com/hc/en-us/articles/204177954-Building-Layer-with-Eclipse). When you are done, return here and continue with setting up the AndroidManifest.xml file in your app.


#### Option 1: AAR (referenced by maven)
Navigate to your `build.gradle` file at the app level (not project level) and ensure that you include the following:

```groovy
repositories {
    maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
}

dependencies {
    compile 'com.android.support:appcompat-v7:22.0.0'
    compile 'com.google.android.gms:play-services-base:6.5.+'
    compile 'com.layer.sdk:layer-sdk:%%ANDROID-SDK-VERSION%%'
    compile 'org.slf4j:slf4j-api:1.7.7'
}
```


#### Option 2: JAR (downloaded to local `libs` directory)

1. Download the latest Layer SDK JAR file from [Github](https://github.com/layerhq/releases-android/tree/master/releases/com/layer/sdk/layer-sdk)
2. Drag the JAR file into the /libs directory of your Android Studio application
3. Navigate to the JAR file in Android Studio navigatior, right click and select "Add As A Library..."
4. Navigate to your `build.gradle` file and ensure that you include the following:

```groovy
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:22.+'
    compile 'com.android.support:support-annotations:20.+'
    compile 'com.google.android.gms:play-services:5.+'
    compile 'org.slf4j:slf4j-api:1.7.7'
}
```


## Example AndroidManifest.xml
The Layer Android SDK requires some permissions and references from your app's `AndroidManifest.xml` file.  These permissions allow the SDK to monitor network state and receive Google Cloud Messaging messages.  Below is an example with a `com.myapp.newstandalone` package; replace with your own package when merging with your own manifest.

``` xml
<?xml version="1.0" encoding="utf-8"?>
<manifest
    package="com.myapp.newstandalone"
    xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Layer SDK uses these for monitoring network state and receiving GCM -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.GET_ACCOUNTS"/>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.READ_PHONE_STATE"/>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE"/>

    <!-- GCM permission for your app (replace [com.myapp.newstandalone] with your package name) -->
    <permission
        android:name="com.myapp.newstandalone.permission.C2D_MESSAGE"
        android:protectionLevel="signature"/>
    <uses-permission android:name="com.myapp.newstandalone.permission.C2D_MESSAGE"/>

    ...

    <application ... >

        <!-- Layer SDK has these for monitoring network, boot, and GCM -->
        <receiver android:name="com.layer.sdk.services.LayerReceiver">
            <intent-filter>
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE"/>
                <action android:name="android.intent.action.ANY_DATA_STATE"/>
                <action android:name="android.intent.action.BOOT_COMPLETED"/>
            </intent-filter>
        </receiver>
        <receiver
            android:name="com.layer.sdk.services.GcmBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
                <category android:name="com.myapp.newstandalone"/>
            </intent-filter>
        </receiver>
        <service android:name="com.layer.sdk.services.GcmIntentService"/>

        <!-- Listen for Layer-generated push Intents -->
        <receiver android:name=".LayerPushReceiver">
            <intent-filter>
                <action android:name="com.layer.sdk.PUSH"/>
                <category android:name="com.myapp.newstandalone"/>
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED"/>
                <category android:name="com.myapp.newstandalone"/>
            </intent-filter>
        </receiver>

    </application>
</manifest>
```

##Connecting

```emphasis
Skip this section if you've already done it in the Quick Start guide.
```

The `LayerClient` object is the primary interface for interacting with the Layer service. Only one instance of `LayerClient` should be instantiated and used at all times. The object is initialized with a Context, Application Key. You also have the capability to set specific flags with an Options parameter.

```emphasis
We have created an application for you titled %%C-INLINE-APPNAME%% and the sample code below contains your application's key.
```

Key's are application specific and should be kept private. Copy and paste the following code into the `onCreate()` method of your `Application` object or main `Activity`.

```java
// Create a LayerClient object
LayerClient.newInstance(context.getApplicationContext(), "%%C-INLINE-APPID%%");

//Create a LayerClient object with a GCM Sender ID (allows for push notifications)
LayerClient.Options options = new LayerClient.Options();
options.googleCloudMessagingSenderId("GCM Project Number");
LayerClient.newInstance(context.getApplicationContext(), "%%C-INLINE-APPID%%", options);
```

## Listeners
The `LayerClient` object leverages the listener pattern to notify your application to specific events. You will need to implement the `LayerConnectionListener` and `LayerAuthenticationListener` interfaces. Once implemented, register both on the `layerClient` object.

```java
layerClient.registerConnectionListener(this);
layerClient.registerAuthenticationListener(this);
```

## Connect The SDK
Once you have registered your listeners, you connect the SDK

```java
// Asks the LayerSDK to establish a network connection with the Layer service
layerClient.connect();
```

