#Send a Message
Insert the following code somewhere in your application's logic to send a message.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = layerClient.newConversation(Arrays.asList("948374839"));

// Create a message part with a string of text
MessagePart messagePart = layerClient.newMessagePart("text/plain", "Hi, how are you?".getBytes());

// Creates and returns a new message object with the given conversation and array of message parts
Message message = layerClient.newMessage(Arrays.asList(messagePart));

//Sends the specified message to the conversation
conversation.send(message);
```

You can verify that your message has been sent by looking at the logs inside [Developer Dashboard](https://developer.layer.com).

%%C-CHATWIDGET%%