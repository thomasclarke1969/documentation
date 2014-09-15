# Deletion

The Layer SDK supports the deletion of both conversations and messages. Deletion of a conversation deletes that conversation object and all associated messages for all current participants. 

```java
// Deletes a messages.
layerClient.deleteMessage(message);

// Deletes a conversation.
layerClient.deleteConversation(conversation);
```
