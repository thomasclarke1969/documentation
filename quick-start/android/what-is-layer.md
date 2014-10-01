# What is Layer?

The Layer SDKs represent the easiest way to add rich communication features to your application.
They handle the hard parts of messaging including synchronization of messages and message states across devices, offline message support, push notifications and more.

```emphasis
Please note, you have been given access to pre-production version of the Layer service. We do not recommend using the service in production applications at this time. Please contact [The Layer Growth Team](mailto:growth@layer.com) with questions about commercial terms and availability.
```

#Quick Start
This quick start guide will get you up and running with sending messages as quickly as possible. However, once you have tested out Layer using this guide, you will need to alter how authentication is done by creating your own backend controller that generates an Identity Token.

##Install the Layer SDK Jar


#### JAR (downloaded to local `libs` directory)

1. Download the latest Layer SDK `layer-sdk-0.7.21.jar` JAR file from [Github](https://github.com/layerhq/releases-android)
2. Add the JAR file into the /libs directory of your project
3. Make sure the Jar file is added as a library that your project can reference. i.e in Android Studio, navigate to the JAR file and click on "Add As A Library..."

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
            </intent-filter>
        </receiver>

    </application>
</manifest>
```

#Initialize
```emphasis
We have created an application for you titled %%C-INLINE-APPNAME%% and the sample code below contains your application's key.
```

This key is specific to your application and should be kept private at all times. Copy and paste the following code into your `Application` object's `onCreate()` method.

```java
// Instatiates a LayerClient object
UUID appID = UUID.fromString("%%C-INLINE-APPID%%")
LayerClient layerClient = LayerClient.newInstance(this, appID, "GCM ID");
```

## Listeners
The `LayerClient` object leverages the listener pattern to notify your application to specific events. You will need to implement the `LayerConnectionListener` and `LayerAuthenticationListener` interfaces. Once implemented, register both on the `layerClient` object.

```java
layerClient.registerConnectionListener(this).registerAuthenticationListener(this);
```

## Connect The SDK
Once you have registered your listeners, you connect the SDK

```java
// Asks the LayerSDK to establish a network connection with the Layer service
layerClient.connect();
```

#Authenticate
Once you have connected to Layer, the `onConnectionConnected()` method will be called, at which time you should call the `authenticate()` method on the layerClient.

```java
 @Override
 // Called when the LayerClient establishes a network connection
 public void onConnectionConnected(LayerClient layerClient) {
     // Ask the LayerClient to authenticate. If no auth credentials are present,
     // an authentication challenge is issued
     layerClient.authenticate();
 }
```

Once you have called the `authenticate()` method, your application will receive a call to your `LayerAuthenticationListener`'s `onAuthenticationChallenge()` method. The following code will connect to the Layer Identity service to get an Identity Token.

```emphasis
Please note, the Identity Service is only available for testing purposes and cannot be used in production applications.
```

```
/*
 * 1. Implement `onAuthenticationChallenge` to acquire a nonce
 */
@Override
public void onAuthenticationChallenge(final LayerClient layerClient, final String nonce) {
    String mUserId = "USER_ID_HERE";

  /*
   * 2. Acquire an identity token from the Layer Identity Service
   */
    (new AsyncTask<Void, Void, Void>() {
        @Override
        protected Void doInBackground(Void... params) {
            try {
                HttpPost post = new HttpPost("https://layer-identity-provider.herokuapp.com/identity_tokens");
                post.setHeader("Content-Type", "application/json");
                post.setHeader("Accept", "application/json");

                JSONObject json = new JSONObject()
                        .put("app_id", layerClient.getAppId())
                        .put("user_id", mUserId)
                        .put("nonce", nonce );
                post.setEntity(new StringEntity(json.toString()));

                HttpResponse response = (new DefaultHttpClient()).execute(post);
                String eit = (new JSONObject(EntityUtils.toString(response.getEntity())))
                        .optString("identity_token");

        /*
             * 3. Submit identity token to Layer for validation
             */
                layerClient.answerAuthenticationChallenge(eit);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }
    }).execute();
}
```

#Send a Message
Insert the following code somewhere in your application's logic.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = Conversation.newInstance(Arrays.asList("948374839"));

// Create a message part with a string of text
MessagePart messagePart = MessagePart.newInstance("text/plain", "Hi, how are you?".getBytes());

// Creates and returns a new message object with the given conversation and array of message parts
Message message = Message.newInstance(conversation, Arrays.asList(messagePart));

//Sends the specified message
client.sendMessage(message);
```

The main Layer messaging concepts and their function are the following:

* **Conversations** - represented by the `Conversation` object in the Layer SDK. Conversations coordinate all messaging within Layer. All messages sent with the Layer SDK are sent within the context of conversation, and all participants of that conversation will receives those messages.

* **Messages** - represented by the `Message` in the Layer SDK. Messages can be made up of one or many individual pieces of content.

* **Message Parts** - represented by the `MessagePart` object in the Layer SDK. Message Parts are the atomic object in the Layer universe. They represent the individual pieces of content embedded with a message. MessageParts take a `byte[]` object and a MIME type string. The Layer SDK does not put any restrictions on the type of data you send, nor the MIME types your applications wishes to support.
