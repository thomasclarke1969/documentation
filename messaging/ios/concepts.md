# Concepts
The Layer service introduces three concepts which facilitate all messaging. The concepts and their function are the following:

* **Conversation** - represented by the [LYRConversation](/docs/api/ios#lyrconversation) class. Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of conversation.

* **Message** - represented by the [LYRMessage](/docs/api/ios#lyrmessage) class. Messages can be made up of one or many individual pieces of content. Messages have a file size limit of 64kb.

* **Message Part** - represented by the [LYRMessagePart](/docs/api/ios#lyrmessagepart) class. Message parts represent the individual pieces of content embedded within a message. MessageParts take an `NSData` object and a MIME type string. LayerKit does not enforce any restrictions on the type of data you send, nor the MIME types your applications wishes to support.

The following code demonstrates sending a message with LayerKit. Each line of code will be discussed in detail below.

```objectivec
// Declares a MIME type string
static NSString *const MIMETypeTextPlain = @"text/plain";

// Creates and returns a new conversation object with a single participant represented by
// your backend's user identifier for the participant
LYRConversation *conversation = [LYRConversation conversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]]];

// Creates a message part with a text/plain MIMEType
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];

// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];

// Sends the specified message
[layerClient sendMessage:message error:nil];
```
