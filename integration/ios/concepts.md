# Concepts
The Layer service introduces three concepts which facilitate all messaging. The concepts and their function are the following:

* **Conversation** - represented by the [LYRConversation](/docs/api/ios#lyrconversation) class. Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of conversation.

* **Message** - represented by the [LYRMessage](/docs/api/ios#lyrmessage) class. Messages can be made up of one or many individual pieces of content.

* **Message Part** - represented by the [LYRMessagePart](/docs/api/ios#lyrmessagepart) class. Message parts represent the individual pieces of content embedded within a message. MessageParts take an `NSData` object and a MIME type string. LayerKit does not enforce any restrictions on the type of data you send, nor the MIME types your applications wishes to support. Be default, LayerKit will automatically download content for message parts whose content size is less than 2KB. If you want to send content larger than 2k please read the [Rich Content  guide](https://developer.layer.com/docs/guides#richcontent).

The following code demonstrates sending a message with LayerKit. Each line of code will be discussed in detail below.

```objectivec
// Declares a MIME type string
static NSString *const MIMETypeTextPlain = @"text/plain";

// Creates and returns a new conversation object with a single participant represented by
// your backend's user identifier for the participant
NSError *error = nil;
LYRConversation *conversation = [layerClient newConversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]] options:nil error:&error];

// Creates a message part with a text/plain MIMEType
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];

// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [layerClient newMessageWithParts:@[ messagePart ] options:nil error:&error];

// Sends the specified message
BOOL success = [conversation sendMessage:message error:&error];
```

```emphasis
**Best Practice**

Check to see if a conversation between specific participants already exists before trying to create a new one. [Click here](https://support.layer.com/hc/en-us/articles/203303290-What-happens-if-2-separate-devices-create-conversations-with-identical-participant-sets-) to learn more.
```
