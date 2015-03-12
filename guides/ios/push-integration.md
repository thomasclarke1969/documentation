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

If the options parameter is `nil`, the Layer push notification service will deliver your message via a silent push notification. Your application should also implement the following in your `UIApplicationDelegate` method to handle silent push notifications

```objective-c
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NS
Dictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    NSError *error;

    BOOL success = [self.applicationController.layerClient synchronizeWithRemoteNotification:userInfo completion:^(NSArray *changes, NSError *error) {
        [self setApplicationBadgeNumber];
        if (changes) {
            if ([changes count]) {
                [self processLayerBackgroundChanges:changes];
          // Get the message from userInfo
          message = [self messageFromRemoteNotification:userInfo];
          NSString *alertString = [[NSString alloc] initWithData:[message.parts[0] data] encoding:NSUTF8StringEncoding];

          // Show a local notification
          UILocalNotification *localNotification = [UILocalNotification new];
          localNotification.alertBody = alertString;
          [[UIApplication sharedApplication] presentLocalNotificationNow:localNotification];
            completionHandler(UIBackgroundFetchResultNewData);
            } else {
                completionHandler(UIBackgroundFetchResultNoData);
            }
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

To enable this feature, go to the Push section of the [Dashboard](http://developer.layer.com) and turn on "Show unread in badges".
![](badges.png)
Please note that when you flip the switch the change may take a few minutes to propogate.

To retrieve the badge count in your application, use
```
NSInteger badgeCount = application.applicationIconBadgeNumber;
```
