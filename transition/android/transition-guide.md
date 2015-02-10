#Android SDK v0.9.0 Transition Guide

If you are upgrading from older versions of the SDK, there are some architectural changes you need to take into account when implementing SDK v0.9.0 and above. Creating a Conversation, Message, and MessagePart are now created with a LayerClient object, and sending a message is done with the Conversation itself:

```java
//There is no change in how the LayerClient is instantiated:
LayerClient client = LayerClient.newInstance(Context context, String App_ID, String GCM_ID);

//MessagePart.newInstance(text) becomes:
MessagePart part = client.newMessagePart(text);

//Message.newInstance(conversation, parts) is created with the client, and does not require 
// a conversation object:
Message message = client.newMessage(parts);

//Conversation.newInstance(participants) becomes:
Conversation conversation = client.newConversation(participants);

//The conversation sends the message istself, so layerClient.sendMessage(message) becomes:
conversation.send(message);
```

All other implementation details are the same.