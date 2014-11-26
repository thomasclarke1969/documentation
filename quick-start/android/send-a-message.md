#Send a Message
Insert the following code somewhere in your application's logic to send a message.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = Conversation.newInstance(Arrays.asList("948374839"));

// Create a message part with a string of text
MessagePart messagePart = MessagePart.newInstance("text/plain", "Hi, how are you?".getBytes());

// Creates and returns a new message object with the given conversation and array of message parts
Message message = Message.newInstance(conversation, Arrays.asList(messagePart));

//Sends the specified message
layerClient.sendMessage(message);
```

You can verify that your message has been sent by looking at the logs inside [developer dashboard](/dashboard/projects).
