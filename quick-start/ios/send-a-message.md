#Send a Message
The following demonstrates the logic needed to create a conversation and send a message between 3 users named "Device", "Simulator", and "Dashboard".

```objectivec
- (void)sendMessage:(NSString *)messageText{
    // If no conversations exist, create a new conversation object with two participants
     // For the purposes of this Quick Start project, the 3 participants in this conversation are 'Device'  (the authenticated user id), 'Simulator', and 'Dashboard'.
    if (!self.conversation) {
        NSError *error = nil;
        self.conversation = [self.layerClient newConversationWithParticipants:[NSSet setWithArray:@[ @"Simulator", @ "Dashboard" ]] options:nil error:&error];
        if (!self.conversation) {
            NSLog(@"New Conversation creation failed: %@", error);
        }
    }

    // Creates a message part with text/plain MIME Type
    LYRMessagePart *messagePart = [LYRMessagePart messagePartWithText:messageText];

    // Creates and returns a new message object with the given conversation and array of message parts
    LYRMessage *message = [self.layerClient newMessageWithParts:@[messagePart] options:@{LYRMessageOptionsPushNotificationAlertKey: messageText} error:nil];

    // Sends the specified message
    NSError *error;
    BOOL success = [self.conversation sendMessage:message error:&error];
    if (success) {
        NSLog(@"Message queued to be sent: %@", messageText);
    } else {
        NSLog(@"Message send failed: %@", error);
    }
}
```

```emphasis
Please note, `self.conversation` is a property of the ViewController in the above example. Check the [Quick Start iOS XCode project](https://github.com/layerhq/quick-start-ios) for more details.
```

You can verify that your message has been sent by looking at the logs inside [developer dashboard](/projects). Once you've sent a message, learn how to [display messages](/docs/quick-start/ios#display-messages).
