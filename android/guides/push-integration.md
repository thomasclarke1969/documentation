#Initializing GCM in your Android App
Use the "Project Number" from your Google Developers Console project as your GCM Sender ID when creating new LayerClient instances:

``` java
LayerClient.Options options = new LayerClient.Options();
options.googleCloudMessagingSenderId("[your GCM sender ID]");
LayerClient layerClient = LayerClient.newInstance(context, "[your APP ID]", options);
```


## Sending Push Notifications
The sending client can now generate push notifications by specifying special metadata keys when sending messages:

   1. **layer-push-message**: A string value intended to specify the notification message to display.
   2. **layer-push-sound**: A string value intended to represent a sound resource to play.

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

Note that this BroadcastReceiver must filter for the `com.layer.sdk.PUSH` action.  To ensure that the reciever is activated on device start (not just after app launch), you can also filter for the `android.intent.action.BOOT_COMPLETED` action. One way to do so is through your app's AndroidManifest.xml (replace `com.myapp.newstandalone` with your own package name):

``` xml
<application ... >
    ...
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
```

You can use your Layer Dashboard log to help debug push notifications from the Layer server's perspective.
