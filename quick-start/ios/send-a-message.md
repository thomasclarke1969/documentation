#Send a Message
Insert the following code somewhere in your application's logic to send a message.

```objectivec
// Declares a MIME type string
static NSString *const MIMETypeTextPlain = @"text/plain";

// Creates and returns a new conversation object with a single participant represented by
// your application's user identifier for the participant
LYRConversation *conversation = [LYRConversation conversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]]];

// Creates a message part with a text/plain MIMEType
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];

// Creates a new message object in the conversation with an array of message parts
LYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];

// Sends the specified message
[layerClient sendMessage:message error:nil];
```
