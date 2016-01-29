# Deleting messages

The Layer SDK supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages. Deletion of a messages only affects that individual message and its parts. Currently, deletion removes an object for ALL users, not just for the current user.

```javascript
// Deletes a message
message.delete(true);

// Deletes a conversation.
conversation.delete(true);
```

There are two types of deletion; but at this time, only one is supported:

```javascript
// Delete the message/conversation for All users:
message.delete(true);
conversation.delete(true);

// Not Yet Available: Delete the message/conversation for the current user:
message.delete(false);
conversation.delete(false);
```
