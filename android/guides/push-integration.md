# Initializing GCM in your Android App
Use the "Project Number" from your Google Developers Console project as your GCM Sender ID when creating new LayerClient instances:

``` java
LayerClient.Options options = new LayerClient.Options();
options.googleCloudMessagingSenderId("[your GCM sender ID]");
LayerClient layerClient = LayerClient.newInstance(context, "[your APP ID]", options);
```


## Sending Push Notifications
The sending client can now generate push notifications by specifying special options when sending the message:

``` java
private void sendTextMessage(String text) {

    //Put the text into a message part, which has a MIME type of "text/plain" by default
    MessagePart messagePart = layerClient.newMessagePart(text);

    //Formats the push notification text
    MessageOptions options = new MessageOptions();
    PushNotificationPayload payload = new PushNotificationPayload.Builder()
    	.text(MainActivity.getUserID() + ": " + text)
    	.build();
    options.defaultPushNotificationPayload(payload);

    //Creates and returns a new message containing the message parts
    Message message = layerClient.newMessage(options, Arrays.asList(messagePart));

    //Sends the message
    mConversation.send(message);
}
```


## Receiving Push Notifications
Receiving clients access push notifications via broadcast Intents.  It is up to your app to implement a BroadcastReceiver for generating and posting notifications from these Intents, which contain the following extras:

   1. **layer-conversation-id**: A parceled Uri representing the conversation ID associated with the pushed message.
   2. **layer-message-id**: A parceled Uri representing the message ID associated with the pushed message.
   3. Extra strings defined by keys in `PushNotificationPayload`. These can be queried directly or by using the helper method `PushNotificationPayload.fromGcmIntentExtras()`.

### Example BroadcastReceiver
``` java
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;

import com.layer.sdk.messaging.Message;
import com.layer.sdk.messaging.PushNotificationPayload;

public class LayerPushReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {

        //Don't show a notification on boot
        if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED)
            return;

        // Get notification content
        Bundle extras = intent.getExtras();
        PushNotificationPayload payload = PushNotificationPayload.fromGcmIntentExtras(extras);
        Uri conversationId = null;
        if (extras.containsKey("layer-conversation-id")) {
            conversationId = extras.getParcelable("layer-conversation-id");
        }

        // Build the notification
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context)
                .setSmallIcon(R.drawable.layer_launcher)
                .setContentTitle(context.getResources().getString(R.string.app_name))
                .setContentText(payload.getText())
                .setAutoCancel(true)
                .setLights(context.getResources().getColor(R.color.blue), 100, 1900)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setDefaults(NotificationCompat.DEFAULT_SOUND | NotificationCompat.DEFAULT_VIBRATE);

        // Set the action to take when a user taps the notification
        Intent resultIntent = new Intent(context, ConversationsActivity.class);
        resultIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        resultIntent.putExtra("layer-conversation-id", conversationId);
        PendingIntent resultPendingIntent = PendingIntent.getActivity(context, 0, resultIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        mBuilder.setContentIntent(resultPendingIntent);

        // Show the notification
        NotificationManager mNotifyMgr = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        mNotifyMgr.notify(1, mBuilder.build());
    }
}
```

Note that this BroadcastReceiver must filter for the `com.layer.sdk.PUSH` action.  One way to do so is through your app's AndroidManifest.xml (replace `com.myapp.package` with your own package name):

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

You can use your Layer Dashboard log to help debug push notifications from the Layer server's perspective.

## Multiple GCM senders in the same app
Google does support multiple GCM senders in a single app, but you have to account for it. If not, one or more GCM senders will fail to send GCM intents, and GCM intents that do come in may randomly fail to reach GCM receivers in your manifest.

The best way to do this is to handle GCM registration yourself, rather than letting individual libraries perform the registration. Note that you would use `gcm_defaultSenderId` or `googleCloudMessagingSenderId` on the Layer client; instead, you'll have to join the sender IDs of each library with a comma:

```java
public class RegistrationIntentService extends IntentService {
	@Override
	public void onHandleIntent(Intent intent) {
		InstanceID instanceID = InstanceID.getInstance(this);
		// Comma-concatenated sender IDs
		String senderIDs = "SENDER_ID_1,SENDER_ID_2";
		String token = instanceID.getToken(senderIDs, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
		// ...
	}
}
```
See the [GCM docs](https://developers.google.com/cloud-messaging/android/client#sample-register) for more details.

Next, provide the GCM registration ID to Layer (via `LayerClient.setGcmRegistrationId()`) and the other provider libraries.

Finally, configure the receiver priorities such that Layer receives the push first. GCM intents are **ordered** — that is, they get handled by receivers one at a time, and each receiver can either consume the intent or pass it to the next receiver. Layer does a good job handling its GCM intents and passing non-Layer intents down the chain, but not all libraries are good citizens in this way, and simply consume all intents. The workaround is to add a priority to each GCM receiver, and prioritize Layer above the offending receivers. For example:

```xml
<receiver
    android:name="com.layer.sdk.services.GcmBroadcastReceiver"
    android:permission="com.google.android.c2dm.permission.SEND">
    <intent-filter android:priority="470">
        <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
        <action android:name="com.google.android.c2dm.intent.REGISTRATION"/>
        <action android:name="com.google.android.c2dm.intent.REGISTER"/>
        <category android:name="com.my.app"/>
    </intent-filter>
</receiver>

<receiver
    android:name="com.another.service.GcmBroadcastReceiver"
    android:permission="com.google.android.c2dm.permission.SEND">
    <intent-filter android:priority="1">
        <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
        <action android:name="com.google.android.c2dm.intent.REGISTRATION"/>
        <action android:name="com.google.android.c2dm.intent.REGISTER"/>
        <category android:name="com.my.app"/>
    </intent-filter>
</receiver>
```

Note the `android:priority="470"` attribute in the Layer GCM receiver — higher priorities get the GCM intents first. This will allow Layer to receive GCM intents, consume them if they are Layer intents, and pass them on down the priority chain if they are not Layer intents.
