# Concepts

LayerKit is a powerful tool that lets you add in-app messaging with very little overhead. LayerKit can work with any existing User Management system, takes care of synchronization and offline support, and includes features such as querying, Message delivery and read receipts, Conversation metadata, and typing indicators.

**Authentication**
In order for a user to send or recieve messages, you must Authenticate them first. Layer will accept any unique String as a User ID (UIDs, email addresses, phone numbers, usernames, etc), so you can use any new or existing User Management system. As part of the Authentication process, you will need to set up a Web Service which generates a unique Identity Token for each user on request.

**Synchronization and Offline Support**
When a user successfully authenticates, their entire Conversation and Message history is downloaded to the device. LayerKit then keeps this data in sync with the backend, so all operations, such as queries, execute locally. This means LayerKit handles offline support for you: if there is no network connection, messages are queued and will be sent when a connection is re-established.

**Messaging**
LayerKit relies on three basic concepts in order to facilitate messaging:

* **Conversation** - represented by the [LYRConversation](/docs/api/ios#lyrconversation) class. Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of a conversation.
* **Message** - represented by the [LYRMessage](/docs/api/ios#lyrmessage) class. Messages can be made up of one or many individual pieces of content.
* **Message Part** - represented by the [LYRMessagePart](/docs/api/ios#lyrmessagepart) class. Message parts represent the individual pieces of content embedded within a message. MessageParts take an `NSData` object and a MIME type string. LayerKit does not enforce any restrictions on the type of data you send, nor the MIME types[*](#warning) your applications wishes to support. By default, LayerKit will automatically download content for message parts whose content size is less than 2KB. If you want to send content larger than 2k please read the [Rich Content  guide](https://developer.layer.com/docs/guides#richcontent).

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

**Querying**
LayerKit provides a powerful querying engine that lets you search for specific Conversations or Messages based on key properties. For example, you can find a list of all Conversations sorted by when the last message was received, or find all Messages in a Conversation that are unread. To build a Query, you specify which class you wish to execute the query on - either Conversations or Messages, and you can then specify any predicates, and how you want the results to be sorted.


```emphasis
**Best Practice**
You can use a query to see if a conversation between specific participants already exists before trying to create a new one. [Click here](https://support.layer.com/hc/en-us/articles/203303290-What-happens-if-2-separate-devices-create-conversations-with-identical-participant-sets-) to learn more.
```

**Additional Features**
* **Message Read and Delivery Receipts** 
 For one on one Conversations, or small group Conversations, it makes sense to show the current state of a given message. LayerKit keeps track of whether a Message has been sent, and if it has, which Participants in the Conversation have downloaded that Message (marked as `Delivered`). You can then choose to mark any Message as `Read` once it is actually displayed in the UI. 
* **Conversation Metadata** 
 If you want to store additional information about a Conversation that won't be changing very often, you can use Metadata. Each Conversation has its own Map where you can define any String Key / Value pair to set data that would otherwise be difficult to capture. Examples would include setting a Topic, "Liking" or "Favoriting" specific Message IDs in that Conversation, or setting GUI elements (such as visual themes) that are unique to that Conversation. 
* **Typing Indicators** 
 With LayerKit, you can drive changes to the UI based on whether the other participants in a Conversation are typing or not. When a user is inputting text, you simply send a typing indcator to the Conversation, and all other participants will be notified as to which users are actively typing.
