# Push Notifications

For a comprehensive guide on configuring your application to leverage the Layer Push Notification service, please see the [Layer Push Notification Guide](/docs/resources#push-notification-guide).

Your application must register to receive for remote notifications. Call the following in `application:didFinishLaunchingWithOptions`.

```
[application registerForRemoteNotificationTypes:UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeBadge];
```

Your AppDelegate will be notified when your application that it has successfully registered with Apple’s Push Notification service via the following `UIApplicationDelegate` method. This method will provide a device token which must then be submitted to Layer. Copy and paste the following code into your AppDelegate.

```
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

The Layer Push Notification service will only send push notifications when the recipient application is in the background of the device. Your app will not receive push notifications while in the foreground.

##Triggering Alerts

By default, the Layer Push Notification service will deliver silent push notifications which wil not trigger any alerts for your users. However, you can configure your messages to trigger a system alert at the time of message send. To specify the alert text you would like the recipient of a message to receive, you can leverage the `Metadata` APIs on [LYRClient](/docs/api/ios#lyrclient) by setting a value for the `LYRMessagePushNotificationAlertMessageKey` key. This will tell the Layer Push Notification service to deliver a regular APN and trigger an alert for the user.

The following demonstrates setting the alert text to be the same as the text of the message being sent.

```
// Create a message with a string of text
NSString *messageText = @"Hi how are you?"
LYRMessagePart *part = [LYRMessagePart messagePartWithText:messageText];
LYRMessage *message = [LYRMessage messageWithConversation:self.conversation parts:@[ part ]];

// Configure the push notification text to be the same as the message text
[self.layerClient setMetadata:@{LYRMessagePushNotificationAlertMessageKey: messageText} onObject:message];

NSError *error;
[self.layerClient sendMessage:message error:&error];
```

Your application should also implement the following in your `UIApplicationDelegate` method to handle silent push notifications

```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NS
Dictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    NSError *error;
    BOOL success = [layerClient synchronizeWithRemoteNotification:userInfo completion:^(UIBackgroundFetchResult fetchResult, NSError *error) {
        if (!error) {
        	NSLog (@"Layer Client finished background sycn");
        }
        completionHandler(fetchResult);
    }];
}
```
