# Deleting Messages

LayerKit supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages. Deletion of a messages only affects that individual message and it's parts.

LayerKit supports 2 deletion modes: Local and All Participants:

* `LYRDeletionModeLocal` will remove the deleted object from ONLY the current device. This is not a synchronized delete, rather just a delete of the object from the local DB. So please note, if the user logs out and logs back in, the deleted object will reappear as we dump the local db on logout and do a complete sync on next login.

* `LYRDeletionModeAllParticipants` will tombstone the deleted object from all devices of all participants. The deleted object can be considered to be completely deleted.

```objectivec
// Deletes a conversation
NSError *error = nil;
BOOL success = [conversation delete:LYRDeletionModeAllParticipants error:&error];

// Deletes a message
NSError *error = nil;
BOOL success = [message delete:LYRDeletionModeAllParticipants error:&error];
```
