# Installation

This quick start guide will get you up and running with sending messages as quickly as possible. However, once you have tested out Layer using this guide, you will need to alter how authentication is done by creating your own backend controller that generates an Identity Token.

```emphasis
Before you get started, we highly recommend that you download the [Android Quick Start project](https://github.com/layerhq/quick-start-android).
```

You can download the Quick Start Android source code by running the following command:

```console
git clone https://github.com/layerhq/quick-start-android.git
```

##Install the Layer SDK Jar

When building your project in [Android Studio](https://developer.android.com/sdk/index.html), you can include the Layer SDK through maven, or link directly to the JAR file. <b>Note:</b> If you are developing with Eclipse, you can follow [these instructions](https://support.layer.com/hc/en-us/articles/204177954-Building-Layer-with-Eclipse). When you are done, return here and continue with setting up the AndroidManifest.xml file in your app.

#### AAR (referenced by maven)
Navigate to the `build.gradle` file at the app level (not the project level) and ensure that you include the following:

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


#### JAR (downloaded to local `libs` directory)

1. Download the latest Layer SDK JAR file from [GitHub](https://github.com/layerhq/releases-android/tree/master/releases/com/layer/sdk/layer-sdk)
2. Drag the JAR file into the /libs directory of your Android Studio application
3. Navigate to the JAR file in Android Studio navigator, right click and select "Add As A Library..."
4. Navigate to the `build.gradle` file at the app level (not the project level) and ensure that you include the following:

```groovy
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.google.android.gms:play-services-gcm:7.5.0'
    compile 'org.slf4j:slf4j-nop:1.5.8'
}
```

## Example AndroidManifest.xml
Below is an example with a `com.myapp.package` package; replace with your own package when merging with your own manifest.

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
             <action android:name="com.google.android.c2dm.intent.REGISTRATION"/>
             <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
             <category android:name="com.myapp.package"/>
          </intent-filter>
       </receiver>
       <service android:name="com.layer.sdk.services.GcmIntentService"/>
    </application>
</manifest>
```

## Application State
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

