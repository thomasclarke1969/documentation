# Push Notification
The Layer Android SDK receives pushes through both the Layer push protocol and Google Cloud Messaging (GCM), depending on usage and other conditions. In order to enable your application to receive GCM push notifications, some setup must be performed in both the Google Developer Console and the Layer developer portal.

# Generating Google Cloud Messaging Credentials
If you do not already have an API Key and Project Number from Google for your app press the button below to learn how to retrieve them from Google.
```collapse
## Setup Google Cloud Messaging on the Web
Go to the [Google Developer Console](https://console.developers.google.com) and click `Create Project`.

![image alt text](android-push-0.jpg)

Name your project and click `Create`

![image alt text](android-push-1.jpg)

Select your newly created project from the project menu and note the numeric `Project Number`. You will need to input this number into the Layer Dashboard. It will also be used when initializing the Layer SDK in your application.

![image alt text](android-push-2.jpg)

Under your Project Settings

You must first turn on GCM for this project. To do so, on the left menu navigate to APIs & auth -> APIs.  Then find "Google Cloud Messaging for Android" and switch it from OFF to ON.

![image alt text](android-push-gcm.jpg)

Next, you must create a new Server API key under APIs & auth -> Credentials

![image alt text](android-push-3.jpg)

Under "Public API Access", click "Create new Key".

![image alt text](android-push-4.jpg)

In the popup, select "Server key"

![image alt text](android-push-5.jpg)

Type `0.0.0.0/0` in the "Accept requests from these server IP addresses" field, and click "Create"

![image alt text](android-push-6.jpg)


Note the alphanumeric `API Key`. You will need to input this key into the Layer Dashboard.

![image alt text](android-push-7.jpg)
```
# Setup Google Cloud Messaging in the Layer Dashboard

Navigate to the Layer Developer Portal and login with your credentials. Select the application for which you would like to upload certificates from the Application drop-down menu. Click on the “Push” section of the left hand navigation.

![image alt text](android-push-8.jpg)

Click the `Add Credentials` button.

![image alt text](android-push-9.jpg)

Enter you GCM credentials.

  * Sender ID: the "Project Number" from your Google Developers Console project.
  * API Key: the "API Key" from your Google Developers Console project.

![image alt text](android-push-10.jpg)

When your app is in the background, the LayerClient alerts you to pushes via a broadcast Intent with the `com.layer.sdk.PUSH` action.  Your BroadcastReceiver can then create and post the actual [UI notification](http://developer.android.com/guide/topics/ui/notifiers/notifications.html), or take another action.

## Initializing GCM in your Android App
Use the "Project Number" from your Google Developers Console project as your GCM Sender ID when creating new LayerClient instances:

``` java
LayerClient layerClient = LayerClient.newInstance(context, "[your APP ID]", "[your GCM sender ID]");
```


## Sending Push Notifications
The sending client can now generate push notifications by specifying special metadata keys when sending messages:

   1. **layer-push-message**: A string value intended to specify the notification message to display.
   2. **layer-push-sound**: A string value intended to represent a sound resource to play.

``` java
private void sendTextMessage(String text) {
    Message message = Message.newInstance(mConversation, MessagePart.newInstance("text/plain", text.getBytes()));
    Map<String, String> metadata = new HashMap<String, String>();
    metadata.put("layer-push-message", text);
    mLayerClient.setMetadata(message, metadata);
    mLayerClient.sendMessage(message);
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
