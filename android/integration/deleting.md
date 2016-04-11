# Deleting Content

The Layer SDK supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages. Deletion of a messages only affects that individual message and its parts.

The Layer SDK supports 2 deletion modes: My Devices and All Participants

* `DeletionMode.ALL_MY_DEVICES`  will delete the content for only the currently authenticated user. The deletion will also be synchronized among the user's other devices. The content will not be deleted for other participants who have access to it.

* `DeletionMode.ALL_PARTICIPANTS` will tombstone (mark as deleted) the deleted object from all devices of all participants. The deleted object can be considered to be completely deleted.

```java
// Deletes a message
message.delete(DeletionMode deletionMode);

// Deletes a conversation.
conversation.delete(DeletionMode deletionMode);
```
