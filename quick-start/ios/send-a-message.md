#Send a Message
Insert the following code somewhere in your application's logic to send a message.

```objectivec

// Creates and returns a new conversation object with a single participant represented by
// your backend's user identifier for the participant
LYRConversation *conversation = [LYRConversation conversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]]];

// Creates a message part with text/plain MIME Type
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithText:@"Hi, how are you?"];

// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];

// Sends the specified message
[layerClient sendMessage:message error:nil];
```

You can verify that your message has been sent by going to https://developer.layer.com/dashboard/apps
