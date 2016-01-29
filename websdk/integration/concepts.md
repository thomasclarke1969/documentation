# Concepts

Layer is a powerful tool that lets you add in-app messaging with very little overhead. Layer can work with any existing User Management system, takes care of synchronization and offline support, and includes features such as querying, Message delivery and read receipts, Conversation metadata, and typing indicators.

## Authenticating
In order for a user to send or receive messages, you must Authenticate them first. Layer will accept any unique String as a User ID (UIDs, email addresses, phone numbers, usernames, etc), so you can use any new or existing User Management system. As part of the Authentication process, you will need to set up a service which generates a unique Identity Token.x`

## Synchronization and Offline Support
When a user successfully authenticates, their entire Conversation and Message history is made available from Layer's Servers. Layer then keeps your javascript-based application in sync with all changes to Conversations and Messages. Even when offline, Layer handles offline support for you: if there is no network connection, messages are queued and will be sent when a connection is re-established; any missed changes to Conversations and Messages will be loaded from the server as well.

## Messaging
Layer relies on three basic concepts in order to facilitate messaging:

* **Conversations** – Represented by the `Conversation` class. Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of a conversation.
* **Messages** – Represented by the `Message` class. Messages can be made up of one or many individual pieces of content.
* **Message Parts** – Represented by the `MessagePart` class. Message Parts are the atomic object in the Layer universe. They represent the individual pieces of content embedded within a message. MessageParts take a string (including BASE64 encoded strings) and a MIME type. The Layer SDK does not put any restrictions on the type of data you send, nor the MIME types[*](#warning) your applications wish to support. By default, Layer will automatically download content for message parts whose content size is less than 2KB. If you want to send content larger than 2k please read the [Rich Content  guide](/docs/websdk/guides#rich-content).

```javascript
// Creates a new conversation object with sample participant identifiers
var conversation = client.createConversation(["948374839"]);

// Create a message part with a string of text
var messagePart = new layer.MessagePart({
    body: 'Hi, how are you?',
    mimeType: 'text/plain'
});

// Creates a new message object within the conversation and containing an
// array of message parts
var message = conversation.createMessage({ parts: [messagePart] });

// Sends the specified message
message.send();
```

## Queries
Layer provides a basic querying engine that lets you search for Conversations or Messages. For example, you can find a list of all Conversations sorted by when each Conversation's last message was received, or find all Messages in a Conversation. To build a Query, you specify which class you wish to execute the query on - either Conversations or Messages, and you can then specify any predicates, and how you want the results to be sorted.

Note that while Queries will be the primary way of interacting with lists of Messages and Conversations, Query support is initially provided with very minimal sorting and filtering support; this will improve in future releases.

## Additional Features
* **Message Read and Delivery Receipts** – For one-on-one Conversations, or small group Conversations, it makes sense to show the current state of a given message. Layer keeps track of which participants in the Conversation have downloaded that Message (marked the Message as `Delivered`). You can then choose to mark any Message as `Read` once it is actually displayed in the UI.
* **Conversation Metadata** – If you want to store additional information about a Conversation that won't be changing very often, you can use Metadata. Each Conversation has its own Map where you can define any String Key / Value pair to set data that would otherwise be difficult to capture. Examples would include setting a Topic, attaching dates or tags, or setting GUI elements (such as visual themes) that are unique to that Conversation.
* **Typing Indicators** – With Layer, you can drive changes to the UI based on whether the other participants in a Conversation are typing or not. When a user is inputting text, you simply send a typing indicator to the Conversation, and all other participants will be notified as to which users are actively typing.
