#Quick Start
Layer is the full-stack building block for communications.<br/>
This Quick Start guide will get you up and running with a project powered by Layer as fast as possible. When you're done, you'll be able to send messages between a physical Device and an Emulator, see typing indicators, and synchronize metadata. You will need a Layer account to complete the Quick Start Guide so if you don't have an account yet, [Sign Up](https://developer.layer.com/signup).
## Set up the Quick Start project
To get the Quick Start project running you will need [Android Studio](https://developer.android.com/sdk/index.html) and Maven installed.

1. Clone the project from Github:

  ```console
  $ git clone https://github.com/layerhq/quick-start-ios.git
  ```
2. Open the workspace in Android Studio
3. Replace LAYER_APP_ID in MainActivity.java (line 40) with your App ID from http://developer.layer.com.<br/>
**Warning: If you skip this step you will get an error on app launch.**
4. (Optional) To enable Push Notifications, replace GCM_ID with your own Google Cloud Messaging ID (instructions can be found here in the [Push Notification Guide](https://developer.layer.com/docs/guides#push-notification))

## See Layer in Action
Open the workspace if it's not already open. Build and run the Quick Start application on an Emulator and a physical Device to start a 1:1 conversation between them.
### Send Messages
Go ahead and send a few messages between your Device and Emulator. In this example your message is just text, but with Layer you can send **anything**, as long as you can turn it into binary data, between participants.
### Typing Indicators
Start typing on your Device. The Emulator's text field will say "Device is typing..."<br/>
This is an example of typing indicators in Layer. To see how easy it is to use them, check out the `onTypingIndicator` methods in `ConversationViewController.java`
### Delivery and Read Receipts
Now that you've sent a few messages take a look at the status next to the Sender's name.  With Layer, you can easily see if a message has been sent, delivered, or read. Check out the `createStatusImage` method in `MessageView.java` for information about read receipts.<br/>
With Delivery and Read Receipts, you no longer need to wonder if a message was delivered or read.
### Offline Support
Next try putting your Device in Airplane mode.  Send a message from the Emulator. The message will be marked as Sent in the Emulator.  Now, take the Device off airplane mode.  The message from the Emulator should now automatically appear on the Device, and the message will be marked as Read on the Emulator.<br/>
Cool, right? You get offline support out of the box with Layer. Layer handles all network connectivity so you don't need to worry about it. No additional coding is necessary.
### Metadata
Tap on the menu bar at the top. Notice that the navigation bar changes color, _and_ that the Emulator's navigation bar also changes color?<br/>
This is another great feature that Layer provides: metadata. With metadata, you can attach any extra content that you want to a Conversation (e.g. a title for the Conversation), and that data will be synchronized between Participants.
To see how easy it is to add metadata to a Conversation, check out `setTopBarMetaData` method in `ConversationViewController.java`.
## What's Next
Now that you've seen just a sample of what Layer can do, check out the [Integration](https://developer.layer.com/docs/integration) docs to learn more about the concepts behind Layer.
