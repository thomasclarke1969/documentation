# Register Your App to Receive Remote Notifications

Your application must register to receive remote notifications. To support device registration for both iOS 7 and iOS 8, your application must implement the following. We recommend you do this in  `application:didFinishLaunchingWithOptions`.

```objective-c
// Checking if app is running iOS 8
if ([application respondsToSelector:@selector(registerForRemoteNotifications)]) {
  // Register device for iOS8
  UIUserNotificationSettings *notificationSettings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound categories:nil];
  [application registerUserNotificationSettings:notificationSettings];
  [application registerForRemoteNotifications];
} else {
  // Register device for iOS7
  [application registerForRemoteNotificationTypes:UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeBadge];
}
```

Your AppDelegate will be notified when your application has successfully registered with Apple’s Push Notification service via the `UIApplicationDelegate` method. This method will provide a device token which must then be submitted to Layer. Copy and paste the following code into your AppDelegate.

```objective-c
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSError *error;
  BOOL success = [self.applicationController.layerClient updateRemoteNotificationDeviceToken:deviceToken error:&error];
  if (success) {
    NSLog(@"Application did register for remote notifications");
  } else {
    NSLog(@"Error updating Layer device token for push:%@", error);
  }
}
```

```emphasis
To unregister a user from receiving push notifications, you can pass `nil` to the `updateRemoteNotificationDeviceToken` method.
```

## Triggering Alerts

By default, the Layer Push Notification service will deliver silent push notifications which will not trigger any alerts for your users. However, you can configure your messages to trigger a system alert at the time of message send. In the `options` dictionary you will need to set the push configuration as the value for the `LYRMessageOptionsPushNotificationConfigurationKey` key.

The following demonstrates setting the alert text to be the same as the text of the message being sent.

```objective-c
// Create a message with a string of text
NSString *messageText = @"Hi how are you?"
LYRMessagePart *part = [LYRMessagePart messagePartWithText:messageText];

// Configure the push notification text to be the same as the message text
LYRPushNotificationConfiguration *defaultConfiguration = [LYRPushNotificationConfiguration new];
defaultConfiguration.alert = messageText;
defaultConfiguration.sound = @"layerbell.caf";
NSDictionary *messageOptions = @{ LYRMessageOptionsPushNotificationConfigurationKey: defaultConfiguration };

LYRMessage *message = [layerClient newMessageWithParts:@[part] options:messageOptions error:nil];

//Sends the specified message
NSError *error = nil;
BOOL success = [conversation sendMessage:message error:&error];
if (success) {
  NSLog(@"Message enqueued for delivery");
} else {
  NSLog(@"Message send failed with error: %@", error);
}
```

If the options parameter is `nil`, the Layer push notification service will deliver your message via a silent push notification (see the [WARNING](#warning) below about silent notifications).

## User-specific Push Messages

You can use `setPushConfiguration` method of LYRPushNotificationConfiguration to specify user-specific messages.

```objective-c
// Push message for User 1
LYRPushNotificationConfiguration *user1PushConfiguration = [LYRPushNotificationConfiguration new];
user1PushConfiguration.title = @"hey user1";
user1PushConfiguration.alert = @"alert";
user1PushConfiguration.sound = @"sound.caff";

// Push message for User 2
LYRPushNotificationConfiguration *user2PushConfiguration = [LYRPushNotificationConfiguration new];
user2PushConfiguration.title = @"hey user2";
user2PushConfiguration.alert = @"alert";
user2PushConfiguration.sound = @"sound.caff";

// Only User 1 and User 2 will get a push. Everyone else will get the message without a Push notification.
LYRPushNotificationConfiguration *configuration = [LYRPushNotificationConfiguration new];
[configuration setPushConfiguration:user1PushConfiguration forParticipant:@"user1"];
[configuration setPushConfiguration:user2PushConfiguration forParticipant:@"user2"];

NSDictionary *messageOptions = @{ LYRMessageOptionsPushNotificationConfigurationKey: configuration };
LYRMessage *message = [self.layerClient newMessageWithParts:@[messagePart] options:messageOptions error:nil];
```

<a name="warning"></a>
```emphasis
**WARNING about silent and local notifications:**

We currently recommend that developers do not rely on silent notifications. We’ve done extensive testing on silent notifications internally with various combinations of sound, alert, and content-available flags and the net outcome is that there is no way to guarantee that iOS will wake the app up in response to a push notification. We believe this is because of how iOS handles power management.  For example: if you plug the device into a power source it will get woken up on every push. When it's not plugged in we've perceived that whether or not the app will be awakened is unpredictable.

If you want reliable, immediate delivery of push notifications we recommend utilizing the LYRMessagePushNotificationAlertMessageKey option to set Alert text and to use the "Show unread in badges" feature in the dashboard. If you try to use silent notifications and emit local notifications then you will always be subject to latency and a variable amount of batching. Unfortunately, the behavior is out of our control at this time.
```

## Notification Actions

In iOS 8 Apple introduced the ability to have custom actions appear when someone taps on a push notification on the iPhone and Apple Watch. For more information, check out the [Apple documentation](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW26) on push categories. You can set the push category in `LYRPushNotificationConfiguration`. The following example shows how you can you add a Accept/Ignore button when someone taps on a push.

```objective-c
    // Constants
    NSString *const LQSCategoryIdentifier = @"category_lqs";
    NSString *const LQSAcceptIdentifier = @"ACCEPT_IDENTIFIER";
    NSString *const LQSIgnoreIdentifier = @"IGNORE_IDENTIFIER";

- (void)setupPushNotificationOptions
{
    UIMutableUserNotificationAction *acceptAction =
    [[UIMutableUserNotificationAction alloc] init];
    acceptAction.identifier = LQSAcceptIdentifier;
    acceptAction.title = @"Show me!";
    acceptAction.activationMode = UIUserNotificationActivationModeBackground;
    acceptAction.destructive = NO;

    UIMutableUserNotificationAction *ignoreAction =
    [[UIMutableUserNotificationAction alloc] init];
    ignoreAction.identifier = LQSIgnoreIdentifier;
    ignoreAction.title = @"Ignore";
    ignoreAction.activationMode = UIUserNotificationActivationModeBackground;
    ignoreAction.destructive = YES;

    UIMutableUserNotificationCategory *category = [[UIMutableUserNotificationCategory alloc]init];
    category.identifier = LQSCategoryIdentifier;
    [category setActions:@[acceptAction, ignoreAction]
                    forContext:UIUserNotificationActionContextDefault];
    [category setActions:@[acceptAction, ignoreAction] forContext:UIUserNotificationActionContextMinimal];

    NSSet *categories = [NSSet setWithObjects:category, nil];

    UIUserNotificationType types = UIUserNotificationTypeAlert | UIUserNotificationTypeSound |UIUserNotificationTypeBadge;
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types
                                                                             categories:categories];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
}
```
When you send the message, you just need add the category name to the push configuration.
```objective-c
    // Creates and returns a new message object with the given conversation and array of message parts
    NSString *pushMessage= [NSString stringWithFormat:@"%@ says %@",self.layerClient.authenticatedUserID ,messageText];

    LYRPushNotificationConfiguration *defaultConfiguration = [LYRPushNotificationConfiguration new];
    defaultConfiguration.alert = pushMessage;
    //The following dictionary will appear in push payload
    defaultConfiguration.category = LQSCategoryIdentifier;
    NSDictionary *messageOptions = @{ LYRMessageOptionsPushNotificationConfigurationKey: defaultConfiguration };

    LYRMessage *message = [self.layerClient newMessageWithParts:@[messagePart] options:messageOptions error:nil];
```

## Additional Push Configuration

Layer also lets you configure any element of Push Payload including
* alert, title, sound
* localized push information
* additional APNS parameters like ` launch-image`
* any custom key/value pairs defined by your application

For more information about all these other options check out the [API Reference](https://developer.layer.com/docs/ios/api#lyrpushnotificationconfiguration) for `LYRPushNotificationConfiguration`.

## Receiving pushes

The following is an example of a push payload from Layer:
```json
{
    "aps" :  {
        "alert" : "This is the message text.",
        "badge" : 1,
        "sound" : "layerbell.caf",
        "content-available" : 1
    },
    "layer" :     {
        "conversation_identifier" : "layer:///conversations/7b3e0109-c411-434e-965d-f07b62705bc1",
        "event_url" : "layer:///conversations/7b3e0109-c411-434e-965d-f07b62705bc1/messages/4",
        "message_identifier" : "layer:///messages/3ae07c1c-fb90-4207-a533-743929b5e724"
    }
}
```
The conversation identifier is contained in `layer.conversation_identifier` and the message identifier is contained in `layer.message_identifier`.

```emphasis
** Performing actions after a push has been tapped.**
A common use case is to switch to a conversation list or conversation view immediately after someone taps on a push notification. However, if you try to navigate to the conversation view before the sync has completed the new messages may not appear until the sync has finished. To remedy this `LYRClient` provides a method called `synchronizeWithRemoteNotification`. The code block inside `synchronizeWithRemoteNotification` will get executed immediately after the sync has finished. So we recommend navigating to the conversation list or conversation view  from within this method.
```

The following code prints out the contents of LYRMessage object from a push notification:

```objective-c
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    NSError *error;
    BOOL success = [self.layerClient synchronizeWithRemoteNotification:userInfo completion:^(LYRConversation * _Nullable conversation, LYRMessage * _Nullable message, NSError * _Nullable error) {
        if (conversation || message) {
            LYRMessagePart *messagePart = message.parts[0];
            if([messagePart.MIMEType  isEqual: @"text/plain"]) {
                NSLog(@"Pushed Message Contents: %@",[[NSString alloc] initWithData:messagePart.data encoding:NSUTF8StringEncoding]);
            } else if ([messagePart.MIMEType  isEqual: @"image/png"]){
                NSLog(@"Pushed Message Contents was an image");
            }
            completionHandler(UIBackgroundFetchResultNewData);
        } else {
            completionHandler(error ? UIBackgroundFetchResultFailed : UIBackgroundFetchResultNoData);
        }
    }];

    if (success) {
        NSLog(@"Application did complete remote notification sync");
    } else {
        NSLog(@"Failed processing push notification with error: %@", error);
        completionHandler(UIBackgroundFetchResultNoData);
    }
}
```

## Badging

![](ios-badge-count-options.jpg)

Layer makes it easy to  update your application icon badge count automatically. To enable this feature, go to the Push section in the [Developer Dashboard](http://developer.layer.com/). Layer provides 4 options for the badge count:
*  Unread messages count - The total unread message count across all conversations
*  Unread conversations count - The count of conversations that contain unread messages
*  External count only - The externally set badge count available via the [Platform API](/docs/platform#managing-notification-badges)
*  Don't send badge count - Badge count is untouched

Want to include [Announcements](/docs/platform#send-an-announcement) with your badge count? Make sure you check the following checkbox:

* Include announcements - Count announcements in addition with one of the above options

The default setting is "Unread messages count". The above setting is a server-side change, and requires no client-side iOS code changes. Please note that when you update the setting the change may take a few minutes to propagate.

To retrieve the badge count in your application, use
```
NSInteger badgeCount = application.applicationIconBadgeNumber;
```

<a name="warning"></a>
```emphasis
**Troubleshooting Push**

If you are running into issues with Push Notifications we recommend checking out our [Push Notifications Troubleshooting Guide](https://support.layer.com/hc/en-us/articles/204632870-How-do-I-troubleshoot-issues-with-Push-Notifications-on-iOS-)
```
