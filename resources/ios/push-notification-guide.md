#Layer Push Notification Guide
The Layer Push Notification Service can be used to keep your application’s data up to date at all times. This guide will walk you through integrating the Layer Push Notification service into your application.

##Enable Your App for Push notifications 
Navigate to the [Apple Developer Portal](https://developer.apple.com/) and Log In. Select Cerificates, Identifiers, & Profiles on the right side of the page.

![image alt text](ios-push-enable2.jpg)

Click Identifiers in the iOS Apps section on the left side of the window.

![image alt text](ios-push-enable3.jpg)

Select the App ID for your application and you will see a drop-down menu. 

![image alt text](ios-push-enable4.jpg)

*Note - Wild Card App IDs do not support push notifications. Ensure you Application Identifier is not a Wild Card ID.*

Scroll down to the `Push Notification` line item. If your application is already enabled for push notifications, the dots next to `Enabled` will be green. If they are gray, you must enable your application to support push notification. Select the `Edit` at the bottom of the drop-down menu.

![image alt text](ios-push-enable5.jpg)

Scroll down to `Push Notifications` section and click the checkbox to enable.

![image alt text](ios-push-enable6.jpg)

Once your application is enabled for push notifications, you will need to generate both a Production SSL Certificate and a Development SSL Certificate and upload them to Apple. To do so, you must first create a `Certificate Signing Request (CSR)` for both. 

**Keep the Apple Developer window open as you will need to return here to upload your `CSRs`**

##Create A Signing Request
 
Open the Keychain Access application on your Mac. This can be found in Applications → Utilities, or by searching via Spotlight.

![image alt text](ios-push-create2.jpg)

Once in Keychain Access, navigate to Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority

![image alt text](ios-push-create3.jpg)

In the Certificate Information window, enter the following information. The select `Continue`:

	* In the `User Email Address` field, enter your email address.
	* In the `Common Name` field, create a name for your private key (e.g., app-key).
	* The `CA Email Address` field should be left empty.
	* In the "Request is" group, select the `Saved to disk` option.
	
![image alt text](ios-push-create4.jpg)
	
You will be prompted save the certificate. Give you certificate a name and save it to your desktop. 

![image alt text](ios-push-create5.jpg)

**Note that you must create separate `CSRs` for Production and Development certificates. Follow steps 1 - 5 again to create a second certificate.**

##Upload the Signing Request

Navigate back to the Apple Developer Portal and select `Create Certificate` in the `Development SSL Certificate` section.

![image alt text](ios-push-upload2.jpg)

As you have already created a signing request, you can click on the `Continue` button in the following window. 

![image alt text](ios-push-upload3.jpg)

Click on `Choose File` to select your certificate from your desktop and upload. Once uploaded, click the Generate button to generate your development `SSL Certificate`. 

![image alt text](ios-push-upload4.jpg)

Click the Download button to download your certificate to your computer, then click Done. 

![image alt text](ios-push-upload5.jpg)

Once your certificate is downloaded, double click on the certificate to automatically add it to your Keychain. 

##Export Certificate from Keychain

Open up the Keychain Access application and locate your certificate. Right click on the certificate and select “Export “YOUR_CERTIFICATE_NAME”. 

![image alt text](ios-push-upload8.jpg)

Save the certificate to your desktop as layer-dev-cert.

![image alt text](ios-push-upload9.jpg)

You will be prompted to enter a password.  Remember this password as you will need to provide it to Layer when you upload your certificate. 

![image alt text](ios-push-upload10.jpg)

You will then be asked to enter the admin password for your computer to complete the export process.

![image alt text](ios-push-upload11.jpg)

##Upload Your Certificate to Layer

**Please note, Layer supports both production and development Apple Push Notifications. Only one certificate can be uploaded to the Layer developer portal at a time however, so please ensure that you have the correct certificate uploaded for your application at all times.**

Navigate to the [Layer Developer Portal](https://preview.layer.com ) and login with your credentials. Select the application for which you would like to upload certificates from the Application drop-down menu. Click on the “Push” section of the left hand navigation.

![image alt text](ios-push-uploadCert3.jpg) 

Click on the `Add Certificate` button.

![image alt text](ios-push-uploadCert4.jpg) 

Click on the `Choose File` button and select the certificate you saved to your desktop.

![image alt text](ios-push-uploadCert5.jpg) 

You will be prompted by Layer to input your certificate password. This is the same password you chose when you exported your certificate from the KeyChain Access application.  

##Layer Push Integration 

Now that you have succesfully uploaded your Apple Push Notification certificate to Layer, it is time to configure your application to support push notifications in XCode. Open your application in XCode and navigate to Project Settings → your application Target → Capabilities. 

Expand the section titled “Background Modes”.

If the “Background Modes” on/off switch is toggled to “off”, make sure you toggle it to “ON”. Select the radio buttons next to “Background Fetch” and “Remote Notifications”. This will add the necessary background modes to your application’s Info.plist.

##Register Your App to Receive Remote Notifications

In your AppDelegate, you must register the device to recieve push notifications. In order to support push notifications on both iOS 8 and iOS 7, you must implement the following. We recommend that you do this in `application:DidFinishLaunchingWithOptions:`

```
// Checking if app is running iOS 8
if ([application respondsToSelector:@selector(registerForRemoteNotifications)]) {
    // Register device for iOS8
    UIUserNotificationSettings *notificationSettings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound
                                                                                             categories:nil];
    [application registerUserNotificationSettings:notificationSettings];
    [application registerForRemoteNotifications];
} else {
    // Register device for iOS7
    [application registerForRemoteNotificationTypes:UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeBadge];
}
```

The following AppDelegate method notifies your application that it has successfully registered with Apple’s Push Notification service. Your application is given a device token which must then be submitted to Layer. Copy and paste the following code into your AppDelegate. 

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

If an error occurs when attempting to register to receive push notification, your application will be notified via the following AppDelegate method. If your application receives an error, please carefully revisit the Layer Push Notification guide.

```
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    NSLog(@"Application failed to register for remote notifications with error %@", error);
}
```

##Receiving Push Notifications
The Layer service only sends push notifications when the recipient application is in the background of the device. Your app will not receive push notifications while in the foreground. 

By default, the Layer Push Notification service will deliver silent push notifications. Your application will receive silent push notification for multiple synchronization events including new message delivery. This allows Layer to keep all of your application's content up to date at all times. 

Your application should implement the following in your AppDelegate to handle silent push notifications. 

```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
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

**Note - You should always check to make sure that a push is a Layer push notification.**

##Triggering Push Notification Alerts
Silent push notifications by default will not trigger any system notification UI. If you would like your users to be notified when new messages arrive via LayerKit, you do so at the time of message send via the public method `setMetadata:onObject` on [LYRClient](/docs/api/ios#lyrclient).

To specify the alert you would like the recipient of a message to receive, you can leverage the `Metadata` APIs on LYRClient. You must set a value for the  `LYRMessagePushNotificationAlertMessageKey`. 

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


