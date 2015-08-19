# Installation

The Layer Android SDK is built and designed to be used with [Android Studio](https://developer.android.com/sdk/index.html). The SDK is available via an AAR or JAR file hosted on [GitHub](https://github.com/layerhq/releases-android), and can be added to your project by referencing the AAR remotely with maven, or by importing the JAR locally.

<b>Note:</b> If you are developing with Eclipse, you can follow [these instructions](https://support.layer.com/hc/en-us/articles/204177954-Building-Layer-with-Eclipse). When you are done, return here and continue with setting up the AndroidManifest.xml file in your app.


#### Option 1: AAR (referenced by maven)
Navigate to your `build.gradle` file at the app level (not project level) and ensure that you include the following:

```groovy
repositories {
    maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
}

dependencies {
    compile 'com.layer.sdk:layer-sdk:%%ANDROID-SDK-VERSION%%'
    compile 'com.google.android.gms:play-services-gcm:7.5.0'
    compile 'org.slf4j:slf4j-nop:1.5.8'
}
```


#### Option 2: JAR (downloaded to local `libs` directory)

1. Download the latest Layer SDK JAR file from [GitHub](https://github.com/layerhq/releases-android/tree/master/releases/com/layer/sdk/layer-sdk)
2. Drag the JAR file into the /libs directory of your Android Studio application
3. Navigate to the JAR file in Android Studio navigator, right click and select "Add As A Library..."
4. Navigate to your `build.gradle` file and ensure that you include the following:

```groovy
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.google.android.gms:play-services-gcm:7.5.0'
    compile 'org.slf4j:slf4j-nop:1.5.8'
}
```


## Example AndroidManifest.xml
The Layer Android SDK requires some permissions and references from your app's `AndroidManifest.xml` file.  These permissions allow the SDK to monitor network state and receive Google Cloud Messaging messages.  Below is an example with a `com.myapp.package` package; replace with your own package when merging with your own manifest.

``` xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myapp.package">

    <!-- Standard permissions -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE"/>

    <!-- Signature-only permissions -->
    <permission android:name="com.myapp.package.permission.LAYER_PUSH"
       android:protectionLevel="signature"/>
    <uses-permission android:name="com.myapp.package.permission.LAYER_PUSH"/>
    <permission android:name="com.myapp.package.permission.C2D_MESSAGE"
       android:protectionLevel="signature"/>
    <uses-permission android:name="com.myapp.package.permission.C2D_MESSAGE"/>

    <!-- LayerClient.sendLogs() permissions -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.READ_LOGS"/>

    <application>
       <!-- Your custom "com.layer.sdk.PUSH" notification Receiver -->
       <receiver android:name=".LayerPushReceiver">
          <intent-filter>
             <action android:name="com.layer.sdk.PUSH"/>
             <category android:name="com.myapp.package"/>
          </intent-filter>
       </receiver>

       <!-- Layer's GCM Receiver and Service -->
       <receiver android:name="com.layer.sdk.services.GcmBroadcastReceiver"
          android:permission="com.google.android.c2dm.permission.SEND">
          <intent-filter android:priority="950">
             <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
             <category android:name="com.myapp.package"/>
          </intent-filter>
       </receiver>
       <service android:name="com.layer.sdk.services.GcmIntentService"/>
    </application>
</manifest>
```

## Connecting

```emphasis
Skip this section if you've already done it in the Quick Start guide.
```

The `LayerClient` object is the primary interface for interacting with the Layer service. Only one instance of `LayerClient` should be instantiated and used at all times. The object is initialized with a Context, Application Key. You also have the capability to set specific flags with an Options parameter.

```emphasis
We have created an application for you titled %%C-INLINE-APPNAME%% and the sample code below contains your application's key.
```

Key's are application specific and should be kept private. Copy and paste the following one of the following examples into the `onCreate()` method of your `Application` object or main `Activity`.

```java
// Create a LayerClient ready to receive push notifications through GCM
LayerClient layerClient = LayerClient.newInstance(context, "%%C-INLINE-APPID%%",
    new LayerClient.Options().googleCloudMessagingSenderId("GCM Project Number"));
```

### Application State
In order for the LayerClient to properly manage connection and notification states, it is necessary to call `LayerClient.applicationCreated(app)` from your `Application.onCreate()` method:

```java
public class MyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // Lets the LayerClient track Application state for connection and notification management.
        LayerClient.applicationCreated(this);
    }
}
```

### Listeners
The `LayerClient` object leverages the listener pattern to notify your application to specific events. You will need to implement the `LayerConnectionListener` and `LayerAuthenticationListener` interfaces. Once implemented, register both on the `layerClient` object.

```java
layerClient.registerConnectionListener(this)
layerClient.registerAuthenticationListener(this);
```

### Connect The SDK
Once you have registered your listeners, you connect the SDK

```java
// Asks the LayerSDK to establish a network connection with the Layer service
layerClient.connect();
```

