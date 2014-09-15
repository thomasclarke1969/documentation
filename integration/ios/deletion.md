# Deletion

LayerKit supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages for all current participants. Deletion of a messages only affects that individual message and it's parts. 

```objectivec
// Deletes a conversation
[layerClient deleteConversation:conversation error:nil];

// Deletes a message
[layerClient deleteMessage:message error:nil];
```