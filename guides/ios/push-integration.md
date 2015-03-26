#Register Your App to Receive Remote Notifications

Your application must register to receive for remote notifications. To support device registration for both iOS 7 and iOS 8, your application must implement the following. We recommend you do this in  `application:didFinishLaunchingWithOptions`.

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

Your AppDelegate will be notified when your application has successfully registered with Apple’s Push Notification service via the following `UIApplicationDelegate` method. This method will provide a device token which must then be submitted to Layer. Copy and paste the following code into your AppDelegate.

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

##Triggering Alerts

By default, the Layer Push Notification service will deliver silent push notifications which will not trigger any alerts for your users. However, you can configure your messages to trigger a system alert at the time of message send. To specify the alert text you would like the recipient of a message to receive, you set the `options` dictionary when initializing the [LYRMessage](/docs/api/ios#lyrmessage) object.  In the `options` dictionary you will need to set push text as the value for the `LYRMessagePushNotificationAlertMessageKey` key. This will tell the Layer Push Notification service to deliver a Text APN and trigger an alert for the user.

The following demonstrates setting the alert text to be the same as the text of the message being sent.

```objective-c
// Create a message with a string of text
NSString *messageText = @"Hi how are you?"
LYRMessagePart *part = [LYRMessagePart messagePartWithText:messageText];

// Configure the push notification text to be the same as the message text

LYRMessage *message = [layerClient newMessageWithParts:@[part] options:@{LYRMessagePushNotificationAlertMessageKey: messageText} error:nil];

NSError *error;
[self.layerClient sendMessage:message error:&error];
```

If the options parameter is `nil`, the Layer push notification service will deliver your message via a silent push notification (see the [WARNING](#warning) below about silent notifications).

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
The conversation identifier is contained in `layer.conversation_identifier` and the message identifer is contained in `layer.message_identifier`.

The following code will retrieve the LYRMessage object from a push notification:

```objective-c
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NS
Dictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    NSError *error;

    BOOL success = [self.applicationController.layerClient synchronizeWithRemoteNotification:userInfo completion:^(NSArray *changes, NSError *error) {
        if (changes) {
            if ([changes count]) {
                [self processLayerBackgroundChanges:changes];
          // Get the message from userInfo
          message = [self messageFromRemoteNotification:userInfo];
        } else {
            completionHandler(UIBackgroundFetchResultFailed);
        }
    }];
    if (!success) {
        completionHandler(UIBackgroundFetchResultNoData);
    }

- (LYRMessage *)messageFromRemoteNotification:(NSDictionary *)remoteNotification
{
    // Fetch message object from LayerKit
    NSURL *identifier = [NSURL URLWithString:[remoteNotification valueForKeyPath:@"layer.message_identifier"]];
  LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
  query.predicate = [LYRPredicate predicateWithProperty:@"identifier" operator:LYRPredicateOperatorIsEqualTo value:identifier];
  return [[self.layerClient executeQuery:query error:nil] lastObject];
}
```

##<a name="badges"></a>Showing unread counts as Badges

Manually keeping track of unread message counts can be a real pain. Layer can automatically set the badge count to the number of unread messages across all conversations.

To enable this feature, go to the Push section of the [Dashboard](https://developer.layer.com) and turn on "Show unread in badges".
![](badges.png)
Please note that when you flip the switch the change may take a few minutes to propogate.

To retrieve the badge count in your application, use
```
NSInteger badgeCount = application.applicationIconBadgeNumber;
```

##<a name="warning"></a>
```emphasis
**WARNING about silent and local notifications:**

We currently recommend that developers do not rely on silent notifications. We’ve done extensive testing on silent notifications internally with various combinations of sound, alert, and content-available flags and the net outcome is that there is no way to guarantee that iOS will wake the app up in response to a push notification. We believe this is because of how iOS handles power management.  For example: if you plug the device into a power source it will get woken up on every push. When its not plugged in we've perceived that whether or not the app will be awakened is unpredictable.

If you want reliable, immediate delivery of push notifications we recommend utilizing the LYRMessagePushNotificationAlertMessageKey option to set Alert text and to use the "Show unread in badges" feature in the dashboard. If you try to use silent notifications and emit local notifications then you will always be subject to latency and a variable amount of batching. Unfortunately, the behavior is out of our control at this time.
```
