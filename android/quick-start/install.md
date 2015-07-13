#Installation

This quick start guide will get you up and running with sending messages as quickly as possible. However, once you have tested out Layer using this guide, you will need to alter how authentication is done by creating your own backend controller that generates an Identity Token.

```emphasis
Before you get started, we highly recommend that you download the [Android Quick Start project](https://github.com/layerhq/quick-start-android).
```

You can download the Quick Start Android source code by running the following command:

```console
$ git clone https://github.com/layerhq/quick-start-android.git
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
    compile 'com.android.support:appcompat-v7:22.0.0'
    compile 'com.google.android.gms:play-services-gcm:+'
    compile 'com.layer.sdk:layer-sdk:%%ANDROID-SDK-VERSION%%'
    compile 'org.slf4j:slf4j-api:1.7.7'
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
    compile 'com.android.support:appcompat-v7:22.+'
    compile 'com.android.support:support-annotations:20.+'
    compile 'com.google.android.gms:play-services:5.+'
    compile 'org.slf4j:slf4j-api:1.7.7'
}
```

## Example AndroidManifest.xml
Below is an example with a `com.myapp.newstandalone` package; replace with your own package when merging with your own manifest.

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
