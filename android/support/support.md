# Support and Resources

There are several resources at your disposal when you have a question or need additional help with Layer.

## Questions about Plans and Pricing
If you have questions regarding your account, the pricing plans, billing, or other non-technical questions, email [growth@layer.com](mailto:growth@layer.com)

## Keeping track of updates
We recommend using [Sibbell](https://sibbell.com) to get an email notification of when we release new updates.

## The Help Center
If you have specific questions regarding features, integration, or troubleshooting, first check the Integration section of the documentation on [iOS](/docs/ios/integration) or [Android](/docs/android/integration). If you cannot find an answer to your question there, you can search commonly asked questions in the [Help Center](https://support.layer.com/hc).

You can find specific articles on the following topics, amongst others:

- Layer's [core features](https://support.layer.com/hc/en-us/articles/205652474)
- Troubleshooting push on [iOS](https://support.layer.com/hc/en-us/articles/204632870) or [Android](https://support.layer.com/hc/en-us/articles/206199650)
- Information on [querying distinct conversations](https://support.layer.com/hc/en-us/articles/204193200)
- Counting the number of [unread messages in a conversation](https://support.layer.com/hc/en-us/articles/204344664)
- Steps to go from [sandbox to production](https://support.layer.com/hc/en-us/articles/204471470)

## Logging on Android
On Android, you have the ability to enable logging and email the output. 

1. Call `LayerClient.setLoggingEnabled()` with `enabled` set to `true` before creating a new instance of the LayerClient object
2. Add a widget (button or menu item) that will call `LayerClient.sendLogs()` somewhere in your app
3. Deploy your app and authenticate a user
4. When you encounter a problem, you can tap the widget to call `sendLogs`
5. This will open the email client on the device with several attachments, including the logs, a screenshot, and a copy the local Layer database
6. In order to send the logs to layer:
    - Send the email to yourself (along with the body and all attachments)
    - Create a [support ticket](https://support.layer.com/hc/en-us/requests/new)
    - Add description of the issue you are trying to address along with detailed reproduction steps
    - Copy the data from the body of email below that
    - Attach all files that were sent with the email
    - Add any other relevant information
    - Submit the request

If you are encountering problems in a Release build, or if there is another reason you cannot modify the source code to enable logging, you can turn on verbose logging from the console: `adb shell setprop log.tag.LayerSDK VERBOSE`.

## Contact Us
If you still have questions, please fill out [this support form](https://support.layer.com/hc/en-us/requests/new), and our team will respond as soon as they are able.

For the fastest resolution, please include the following information:

- Platform (iOS, Android, Web Client, Platform API) and Layer SDK version number
- Debug output or code snippets
- A description of the issue you are trying to address
- Detailed reproduction steps
- Any other relevant information
