# Push Notifications
The Layer Android SDK receives pushes through both the Layer push protocol and Google Cloud Messaging (GCM), depending on usage and other conditions. In order to enable your application to receive GCM push notifications, some setup must be performed in both the Google Developer Console and the Layer developer portal.

## Setup Google Cloud Messaging on the Web
1. Go to the [Google Developer Console](https://console.developers.google.com) and click `Create Project`.

![image alt text](android-push-0.jpg)

2. Name your project and click `Create`

![image alt text](android-push-1.jpg)

2. Select your newly created project from the project menu and note the numeric `Project Number`. You will need to input this number into the Layer Dashboard. It will also be used when initializing the Layer SDK in your application.

![image alt text](android-push-2.jpg)

3. Next, you must create a new Server API key. To do so, on the left menu navigate to APIS & AUTH -> Credentials

![image alt text](android-push-3.jpg)

4. Under "Public API Access", click "Create new Key".

![image alt text](android-push-4.jpg)

5. In the popup, select "Server key"

![image alt text](android-push-5.jpg)

6. Type `0.0.0.0/0` in the "Accept requests from these server IP addresses" field, and click "Create"

![image alt text](android-push-6.jpg)

7. Note the alphanumeric `API Key`. You will need to input this key into the Layer Dashboard.

![image alt text](android-push-7.jpg)

## Setup Google Cloud Messaging in the Layer Dashboard

1. Navigate to the Layer Developer Portal and login with your credentials. Select the application for which you would like to upload certificates from the Application drop-down menu. Click on the “Push” section of the left hand navigation.

![image alt text](android-push-8.jpg)

2. Click the `Add Credentials` button.

![image alt text](android-push-9.jpg)

3. Enter you GCM credentials.
	* Sender ID: the "Project Number" from your Google Developers Console project.
	* API Key: the "API Key" from your Google Developers Console project.

![image alt text](android-push-10.jpg)

## Initializing GCM in your Android App
Use the `Project Number` from your Google Developers Console project as your GCM Sender ID when creating new LayerClient instances:

``` java
LayerClient layerClient = LayerClient.newInstance(context, "%%C-INLINE-APPID%%", "GCM ID");
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

## Example LayerNotificationCallback

When your app is in the background, the LayerClient alerts your app to pushes via your attached LayerNotificationCallback.  Your callback can then create and post the actual [UI notification](http://developer.android.com/guide/topics/ui/notifiers/notifications.html) or take another action.

``` java
layerClient.setNotificationCallback(new LayerClient.LayerNotificationCallback() {
    @Override
    public void onLayerNotification(LayerClient client, String message) {
        // Set basic notification parameters
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentTitle(context.getResources().getString(R.string.app_name))
                .setContentText(message)
                .setAutoCancel(true)
                .setLights(context.getResources().getColor(R.color.blue), 100, 1900)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setDefaults(NotificationCompat.DEFAULT_SOUND | NotificationCompat.DEFAULT_VIBRATE);

        // Set the activity to launch when the notification gets pressed
        Intent resultIntent = new Intent(context, ConversationsActivity.class);
        resultIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent resultPendingIntent = PendingIntent.getActivity(context, 0, resultIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        mBuilder.setContentIntent(resultPendingIntent);

        // Notify!
        NotificationManager mNotifyMgr = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        mNotifyMgr.notify(1, mBuilder.build());
    }
});
```
