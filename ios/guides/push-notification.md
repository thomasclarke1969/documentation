# Push Notifications
The Layer Push Notification Service can be used to keep your application’s data up to date at all times. This guide will walk you through integrating the Layer Push Notification service into your application.

# Generating Apple Push Certificate
If you do not already have a .p12 certificate press the button below to learn how to generate them from Apple.
## Enable Your App for Push notifications
Navigate to the [Apple Developer Portal](https://developer.apple.com/) and Log In. Select Certificates, Identifiers, & Profiles on the right side of the page.

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

## Create A Signing Request

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

## Upload the Signing Request

Navigate back to the Apple Developer Portal and select `Create Certificate` in the `Development SSL Certificate` section.

![image alt text](ios-push-upload2.jpg)

As you have already created a signing request, you can click on the `Continue` button in the following window.

![image alt text](ios-push-upload3.jpg)

Click on `Choose File` to select your certificate from your desktop and upload. Once uploaded, click the Generate button to generate your development `SSL Certificate`.

![image alt text](ios-push-upload4.jpg)

Click the Download button to download your certificate to your computer, then click Done.

![image alt text](ios-push-upload5.jpg)

Once your certificate is downloaded, double click on the certificate to automatically add it to your Keychain.

## Export Certificate from Keychain

Open up the Keychain Access application and locate your certificate. Right click on the certificate and select “Export “YOUR_CERTIFICATE_NAME”.

![image alt text](ios-push-upload8.jpg)

Save the certificate to your desktop as layer-dev-cert.

![image alt text](ios-push-upload9.jpg)

You will be prompted to enter a password.  Remember this password as you will need to provide it to Layer when you upload your certificate.

![image alt text](ios-push-upload10.jpg)

You will then be asked to enter the admin password for your computer to complete the export process.

![image alt text](ios-push-upload11.jpg)

## Creating/Refreshing a Provisioning Profile

 1. Navigate back to the Apple Developer Portal.  Select Provisioning Profiles.
 2. Click on the `+` button in the upper right corner to create a new provisioning profile.
 3. Select "iOS App Development" as your profile if you are still in development.  If you are ready to submit you will need to select "Ad Hoc" or "App Store".
 4. Select the App ID for your application.
 5. Add the appropriate test devices to the profile.
 6. Name the provisioning profile.  We suggest using a descriptive name such as "APP_NAME-PROFILE_TYPE".
 7. Generate the profile, and download it to your local machine.
 8. Double click on the downloaded profile to install it.

If you have already created a Provisioning Profile in the past you will need to refresh it once you've created your Push Certificate.

# Upload Your Certificate to Layer

```emphasis
Please note, Layer supports both production and development Apple Push Notifications. Layer will automatically detect the type of certificate you've uploaded and use the correct one at runtime.
```

Navigate to the Layer [Developer Dashboard](https://developer.layer.com) and login with your credentials. Select the application for which you would like to upload certificates from the Projects drop-down menu. Click on the “Push” section of the left hand navigation.

![image alt text](ios-push-uploadCert3.jpg)

Click on the `Configure for iOS` button.

![image alt text](ios-push-uploadCert4.jpg)

You will be presented with a tutorial. If you click on `Upload Certificate` to skip the tutorial. Next, click on the `Choose File` button and select the certificate you saved to your desktop.

![image alt text](ios-push-uploadCert5.jpg)

You will also be prompted by Layer to input your certificate password. This is the same password you chose when you exported your certificate from the Keychain Access application.  This field is optional and is only required if you have a password on your .p12 file.

##Layer Push Integration
Now that you have successfully uploaded your Apple Push Notification certificate to Layer, it is time to configure your application to support push notifications in XCode. Open your application in XCode and navigate to Project Settings → your application Target → Capabilities.

Expand the section titled “Background Modes”.

If the “Background Modes” on/off switch is toggled to “off”, make sure you toggle it to “ON”. Select the radio buttons next to “Background Fetch” and “Remote Notifications”. This will add the necessary background modes to your application’s Info.plist.

![image alt text](ios-push-xcode-background.jpg)
