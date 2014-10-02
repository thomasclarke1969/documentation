#Send a Message
Insert the following code somewhere in your application's logic to send a message.

Create a conversation in order to send a message.

```objectivec
// Creates and returns a new conversation object with a single participant represented by
// your application's user identifier for the participant
LYRConversation *conversation = [LYRConversation conversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]]];
```

Individual messages in a conversation can be made up of multiple pieces of content called MessageParts. To send a simple plain text message, first create a part via the following.

```objectivec
// Declares a MIME type string
static NSString *const MIMETypeTextPlain = @"text/plain";

// Creates a message part with a text/plain MIMEType
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];
```

Messages are initialized with a conversation and an array of messages parts.

```objectivec
// Creates a new message object in the conversation with an array of message parts
LYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];

// Sends the specified message
[layerClient sendMessage:message error:nil];
```

Send the message

```objectivec
// Sends the specified message
[layerClient sendMessage:message error:nil];
```
