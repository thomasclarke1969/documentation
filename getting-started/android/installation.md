# Installation
The Layer Android SDK is built using the new Android build system. The Android SDK is available via an AAR or JAR file hosted on [Github](https://github.com/layerhq/releases-android). To install the SDK, perform one of following (either for local JAR or remote AAR).


#### AAR (referenced by maven)
Navigate to your `build.gradle` file and ensure that you include the following:

```groovy
repositories {
    maven { url "https://raw.githubusercontent.com/layerhq/releases-android/master/releases/" }
}

dependencies {
    compile 'com.layer.sdk:layer-sdk:0.7.16'
    compile 'org.slf4j:slf4j-api:1.7.7'
}
```


#### JAR (downloaded to local `libs` directory)

1. Download the `layer-sdk-0.7.16.jar` JAR file from [Github](https://github.com/layerhq/releases-android)
2. Drag the JAR file into the /libs directory of your Android Studio application
3. Navigate to the JAR file in Android Studio navigatior, right click and select "Add As A Library..."
4. Navigate to your `build.gradle` file and ensure that you include the following:

```groovy
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:20.+'
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
            </intent-filter>
        </receiver>

    </application>
</manifest>
```
