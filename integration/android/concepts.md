# Concepts
The Layer service introduces three concepts which facilitate all messaging. The concepts and their function are the following:

* **Conversations** - represented by the `Conversation` class. Conversations coordinate all messaging within Layer. All messages sent are sent within the context of conversation, and all participants of that conversation will receives those messages.

* **Messages** - represented by the `Message` class. Messages can be made up of one or many individual pieces of content.

* **Message Parts** - represented by the `MessagePart` class. Message Parts are the atomic object in the Layer universe. They represent the individual pieces of content embedded with a message. MessageParts take a `byte[]` object and a MIME type string. The Layer SDK does not put any restrictions on the type of data you send, nor the MIME types your applications wish to support.

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

```emphasis
**Best Practice**

Check to see if a conversastion between specific participants already exists before trying to create a new one. [Click here](https://support.layer.com/hc/en-us/articles/203303290-What-happens-if-2-separate-devices-create-conversations-with-identical-participant-sets-) to learn more.
```