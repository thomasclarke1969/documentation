# Concepts

Layer is a powerful tool that lets you add in-app messaging with very little overhead. Layer can work with any existing User Management system, takes care of synchronization and offline support, and includes features such as querying, Message delivery and read receipts, Conversation metadata, and typing indicators.

**Authentication**<br/>
In order for a user to send or receive messages, you must Authenticate them first. Layer will accept any unique String as a User ID (UIDs, email addresses, phone numbers, usernames, etc), so you can use any new or existing User Management system. As part of the Authentication process, you will need to set up a Web Service which generates a unique Identity Token for each user on request.

**Synchronization and Offline Support**<br/>
When a user successfully authenticates, their entire Conversation and Message history is downloaded to the device. Layer then keeps this data in sync with the backend, so all operations, such as queries, execute locally. This means Layer handles offline support for you: if there is no network connection, messages are queued and will be sent when a connection is re-established.

**Messaging**<br/>
Layer relies on three basic concepts in order to facilitate messaging:

* **Conversations** - represented by the `Conversation` class. Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of a conversation.
* **Messages** - represented by the `Message` class. Messages can be made up of one or many individual pieces of content.
* **Message Parts** - represented by the `MessagePart` class. Message Parts are the atomic object in the Layer universe. They represent the individual pieces of content embedded within a message. MessageParts take a `byte[]` object and a MIME type string. The Layer SDK does not put any restrictions on the type of data you send, nor the MIME types[*](#warning) your applications wish to support. By default, Layer will automatically download content for message parts whose content size is less than 2KB. If you want to send content larger than 2k please read the [Rich Content  guide](/docs/android/guides#richcontent).

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = layerClient.newConversation(Arrays.asList("948374839"));

// Create a message part with a string of text
MessagePart messagePart = layerClient.newMessagePart("text/plain", "Hi, how are you?".getBytes());

// Creates and returns a new message object with the given conversation and array of message parts
Message message = layerClient.newMessage(conversation, Arrays.asList(messagePart));

//Sends the specified message to the conversation
conversation.send(message);
```

**Querying**<br/>
Layer provides a powerful querying engine that lets you search for specific Conversations or Messages based on key properties. For example, you can find a list of all Conversations sorted by when the last message was received, or find all Messages in a Conversation that are unread. To build a Query, you specify which class you wish to execute the query on - either Conversations or Messages, and you can then specify any predicates, and how you want the results to be sorted.


```emphasis
**Best Practice**
You can use a query to see if a conversation between specific participants already exists before trying to create a new one. [Click here](https://support.layer.com/hc/en-us/articles/203303290-What-happens-if-2-separate-devices-create-conversations-with-identical-participant-sets-) to learn more.
```

**Additional Features**
* **Message Read and Delivery Receipts**<br/>
 For one on one Conversations, or small group Conversations, it makes sense to show the current state of a given message. Layer keeps track of whether a Message has been sent, and if it has, which Participants in the Conversation have downloaded that Message (marked as `Delivered`). You can then choose to mark any Message as `Read` once it is actually displayed in the UI.
* **Conversation Metadata**<br/>
 If you want to store additional information about a Conversation that won't be changing very often, you can use Metadata. Each Conversation has its own Map where you can define any String Key / Value pair to set data that would otherwise be difficult to capture. Examples would include setting a Topic, "Liking" or "Favoriting" specific Message IDs in that Conversation, or setting GUI elements (such as visual themes) that are unique to that Conversation.
* **Typing Indicators**<br/>
 With Layer, you can drive changes to the UI based on whether the other participants in a Conversation are typing or not. When a user is inputting text, you simply send a typing indicator to the Conversation, and all other participants will be notified as to which users are actively typing.
