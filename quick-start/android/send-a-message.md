#Send a Message
Insert the following code somewhere in your application's logic to send a message.

Create a conversation in order to send a message.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = Conversation.newInstance(Arrays.asList("948374839"));
```
Individual messages in a conversation can be made up of multiple pieces of content called MessageParts. To send a simple plain text message, first create a part via the following.

```java
// Create a message part with a string of text
MessagePart messagePart = MessagePart.newInstance("text/plain", "Hi, how are you?".getBytes());
```

Messages are initialized with a conversation and an array of messages parts.

```java
// Creates and returns a new message object with the given conversation and array of message parts
Message message = Message.newInstance(conversation, Arrays.asList(messagePart));
```

Send the message

```java
client.sendMessage(message);
```
