#Send a Message
Insert the following code somewhere in your application's logic to send a message.

```objectivec

// Creates and returns a new conversation object with the signed in user and a single participant represented by
// your backend's user identifier for the participant
LYRConversation *conversation = [layerClient newConversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]] options:nil error:nil];

// Creates a message part with text/plain MIME Type
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithText:@"Hi, how are you?"];

// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [layerClient newMessageWithParts:@[messagePart] options:nil error:nil];

// Sends the specified message
[conversation sendMessage:message error:nil];
```

You can verify that your message has been sent by looking at the logs inside [developer dashboard](/dashboard/projects).
