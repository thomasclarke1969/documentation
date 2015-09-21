# Support

There are several resources at your disposal when you have a question or need additional help with Layer.

## Questions about Plans and Pricing
If you have questions regarding your account, the pricing plans, billing, or other non-technical questions, email [growth@gmail.com](mailto:growth@layer.com)

## The Help Center
If you have specific questions regarding features, integration, or troubleshooting, first check the Integration section of the documentation on [iOS](/docs/ios/integration) or [Android](/docs/android/integration). If you cannot find an answer to your question there, you can search commonly asked questions in the [Help Center](https://support.layer.com/hc).

You can find specific articles on the following topics, amongst others:

- Layer's [core features](https://support.layer.com/hc/en-us/articles/205652474)
- Troubleshooting push on [iOS](https://support.layer.com/hc/en-us/articles/204632870) or [Android](https://support.layer.com/hc/en-us/articles/206199650)
- Information on [querying distinct conversations](https://support.layer.com/hc/en-us/articles/204193200)
- Counting the number of [unread messages in a conversation](https://support.layer.com/hc/en-us/articles/204344664)
- Steps to go from [sandbox to production](https://support.layer.com/hc/en-us/articles/204471470)

## Logging on Android
On Android, you have the ability to enable logging and email the output to yourself or [support@layer.com](mailto:support@layer.com) for further analysis.

1. Call `LayerClient.enableLogging()` before creating a new instance of the LayerClient object
2. Add a widget (button or menu item) that will call `LayerClient.sendLogs()` somewhere in your app
3. Deploy your app and authenticate a user
4. When you encounter a problem, you can tap the widget to call `sendLogs`
5. This will open the email client on the device with several attachments, including the logs, a screenshot, and a copy the local Layer database
6. You can send that email (along with the body and all attachments) to [support@layer.com](mailto:support@layer.com) with the following information:
    - An existing ticket number in the subject (if applicable)
    - A description of the issue you are trying to address
    - Detailed reproduction steps
    - Any other relevant information

## Contact Us 
If you still have questions, please fill out [this support form](https://support.layer.com/hc/en-us/requests/new) and our team will respond as soon as they are able during US Pacific timezone business hours. 

For the fastest resolution, please include the following information:
    - Debug output or code snippets
    - A description of the issue you are trying to address 
    - Detailed reproduction steps
    - Any other relevant information