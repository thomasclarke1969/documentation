# Concepts
The Layer service introduces three concepts which facilitate all messaging. The concepts and their function are the following:

* **Conversations** - represented by the `Conversation` object in the Layer SDK. Conversations coordinate all messaging within Layer. All messages sent with the Layer SDK are sent within the context of conversation, and all participants of that conversation will receives those messages.

* **Messages** - represented by the `Message` in the Layer SDK. Messages can be made up of one or many individual pieces of content.

* **Message Parts** - represented by the `MessagePart` object in the Layer SDK. Message Parts are the atomic object in the Layer universe. They represent the individual pieces of content embeded with a message. MessageParts take a `byte[]` object and a MIME type string. The Layer SDK does not put any restrictions on the type of data you send, nor the MIME types your applications wishes to support.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = Conversation.newInstance(Arrays.asList("948374839"));

// Create a message part with a string of text
MessagePart messagePart = MessagePart.newInstance("text/plain", "Hi, how are you?".getBytes());

// Creates and returns a new message object with the given conversation and array of message parts
Message message = Message.newInstance(conversation, Arrays.asList(messagePart));

//Sends the specified message
client.sendMessage(message);
```
