# Push Notifications
The Layer Android SDK receives pushes through both the Layer push protocol and Google Cloud Messaging (GCM), depending on usage and other conditions. In order to enable your application to receive GCM push notifications, some setup must be performed in both the Google Developer Console and the Layer developer portal.

# Generating Google Cloud Messaging Credentials
If you do not already have an API Key and Project Number from Google for your app press the button below to learn how to retrieve them from Google.
```collapse
## Setup Google Cloud Messaging on the Web
Go to the [Google Developer Console](https://console.developers.google.com) and click `Create Project`.

![](android-push-0.jpg)

Name your project and click `Create`

![](android-push-1.jpg)

Select your newly created project from the project menu and note the numeric `Project Number`. You will need to input this number into the Layer Dashboard. It will also be used when initializing the Layer SDK in your application.

![](android-push-2.jpg)

Under your Project Settings

You must first turn on GCM for this project. To do so, on the left menu navigate to APIs & auth -> APIs.  Then find "Google Cloud Messaging for Android" and switch it from OFF to ON.

![](android-push-gcm.jpg)

Next, you must create a new Server API key under APIs & auth -> Credentials

![](android-push-3.jpg)

Under "Public API Access", click "Create new Key".

![](android-push-4.jpg)

In the popup, select "Server key"

![](android-push-5.jpg)

Type `0.0.0.0/0` in the "Accept requests from these server IP addresses" field, and click "Create"

![](android-push-6.jpg)


Note the alphanumeric `API Key`. You will need to input this key into the Layer Dashboard.

![](android-push-7.jpg)
```
# Setup Google Cloud Messaging in the Layer Dashboard

Navigate to the Layer Developer Portal and login with your credentials. Select the application for which you would like to upload certificates from the Application drop-down menu. Click on the “Push” section of the left hand navigation.

![](android-push-8.jpg)

Click the `Configure for Android` button.

![](android-push-9.jpg)

If you haven't already, create your project in the Google Developers Console and configure your credentials for GCM. Make a note of the Project Number and API Key. Otherwise, skip to the next step ("Add Credentials").

* Sender ID: the "Project Number" from your Google Developers Console project.
* API Key: the "API Key" from your Google Developers Console project.

![](android-push-10.jpg)

When your app is in the background, the LayerClient alerts you to pushes via a broadcast Intent with the `com.layer.sdk.PUSH` action.  Your BroadcastReceiver can then create and post the actual [UI notification](http://developer.android.com/guide/topics/ui/notifiers/notifications.html), or take another action.
