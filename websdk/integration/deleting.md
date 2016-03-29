# Deleting messages

The Layer SDK supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages. Deletion of a messages only affects that individual message and its parts. Currently, deletion removes an object for ALL users, not just for the current user.

```javascript
// Deletes a message
message.delete(layer.Constants.DELETION_MODE.ALL);

// Deletes a conversation.
conversation.delete(layer.Constants.DELETION_MODE.ALL);
```

In the near future, more deletion modes will be supported.  To account for that, it is important that all delete calls provide a deletion model.

Deletion Modes:

* layer.Constants.DELETION_MODE.ALL: Delete the resource for all users
* layer.Constants.DELETION_MODE.SELF: Not yet supported

