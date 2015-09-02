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
    options.pushNotificationMessage(MainActivity.getUserID() + ": " + text);

    //Creates and returns a new message containing the message parts
    Message message = layerClient.newMessage(options, Arrays.asList(messagePart));

    //Sends the message
    mConversation.send(message);
}
```


## Receiving Push Notifications
Receiving clients access push notifications via broadcast Intents.  It is up to your app to implement a BroadcastReceiver for generating and posting notifications from these Intents, which contain the following extras:

   1. **layer-push-message**: A string value set by the sender to specify the notification message.
   2. **layer-push-sound**: A string value set by the sender to represent the sound resource to play.
   3. **layer-conversation-id**: A parceled Uri representing the conversation ID associated with the pushed message.
   4. **layer-message-id**: A parceled Uri representing the message ID associated with the pushed message.


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

public class LayerPushReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {

        //Don't show a notification on boot
        if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED)
            return;

        // Get notification content
        Bundle extras = intent.getExtras();
        String message = "";
        Uri conversationId = null;
        if (extras.containsKey("layer-push-message")) {
            message = extras.getString("layer-push-message");
        }
        if (extras.containsKey("layer-conversation-id")) {
            conversationId = extras.getParcelable("layer-conversation-id");
        }

        // Build the notification
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context)
                .setSmallIcon(R.drawable.layer_launcher)
                .setContentTitle(context.getResources().getString(R.string.app_name))
                .setContentText(message)
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
             <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
             <category android:name="com.myapp.package"/>
          </intent-filter>
       </receiver>
       <service android:name="com.layer.sdk.services.GcmIntentService"/>
    </application>
</manifest>
```

You can use your Layer Dashboard log to help debug push notifications from the Layer server's perspective.

## Multiple GCM Senders in the Same App
Google does support multiple GCM senders (Layer, etc.) for a single app, but you have to account for it.  If not, one or more GCM sender will fail to send GCM intents, and GCM intents that do come in may randomly fail to reach GCM receivers in your manifest.

### GCM Registration
GCM registration happens in two phases.  First, the device supplies a `Sender ID` to Google, and Google gives the device back a `Registration ID`.  The `Registration ID` is what the device sends to Layer so we can send GCM to that device.  The trick is, each app can only have one current `Registration ID` assigned by Google at a time; previously assigned `Registration ID`s will no longer work.  And, the `Registration ID` is based on the `Sender ID` supplied at registration time.  So, if multiple senders (e.g. Layer and another service) register for GCM, one will register last and invalidate the other.

#### Option 1: Handling GCM Registration Yourself
The first method is documented:

```
	To make this possible, all you need to do is have each sender
	generate its own project number. Then include those IDs in
	the sender field, separated by commas, when requesting a
	registration.  Finally, share the registration ID with your
	partners, and they'll be able to send messages to your
	application using their own authentication keys.

	Note that there is limit of 100 multiple senders.
```

This approach requires your app to handle its own GCM registration, providing all GCM `Sender ID`s during that process, like so:

``` java
	Intent intent = new Intent(GCMConstants.INTENT_TO_GCM_REGISTRATION);
	intent.setPackage(GSF_PACKAGE);
	intent.putExtra(GCMConstants.EXTRA_APPLICATION_PENDING_INTENT,
	        PendingIntent.getBroadcast(context, 0, new Intent(), 0));
	String senderIds = "968350041068,652183961211";
	intent.putExtra(GCMConstants.EXTRA_SENDER, senderIds);
	context.startService(intent);
```

And then hand the resulting `Registration ID` to all senders (e.g. Layer and the other service).  However, all sender libraries must accept a `Registration ID` (rather than a `Sender ID`) to support this method.  Though Layer supports it through the `LayerClient.setGcmRegistrationId()` method, most libraries do not.  So we've found an undocumented work-around.

#### Option 2: Supply Sender ID List to Libraries
The second (though undocumented) method is to supply a comma-separated list of `Sender ID`s to each library as their `Sender ID`, and allow each library to handle their own GCM registration as usual.  So, if Layer has `Sender ID` "123456", and the other has "654321", you would supply both libraries with "123456,654321" as the `Sender ID`.  It's important to supply the same concatenation to all libraries so they don't invalidate the others' `Registration ID`.  This method works because Google hands back the same `Registration ID` for the same `Sender ID`, so although multiple libraries register GCM, they each supply the same `Sender ID` concatenation, and receive the same `Registration ID` back from Google.

### GCM Receiver Priority
Once registration is sorted out, you may need to take one more step to ensure all GCM receivers play nicely together.  GCM intents are "ordered" -- that is, they get handled by receivers one at a time, and each receiver can either consume the intent or pass it on to the next receiver.  Layer does a good job handling its GCM intents and passing non-Layer intents down the chain, but not all libraries are good citizens in this way, and simply consume all intents.  The workaround is to add a `priority` to each GCM receiver, and prioritize Layer above the offending receivers.  For example:

``` xml
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

Note the `android:priority="470"` attribute in the Layer GCM receiver -- higher priorities get the GCM intents first.  This will allow Layer to receive GCM intents, consume them if they are Layer intents, and pass them on down the priority chain if they are not Layer intents.
