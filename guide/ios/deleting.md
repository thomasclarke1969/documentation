# Deleting Messages

LayerKit supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages for all current participants. Deletion of a messages only affects that individual message and it's parts.

LayerKit supports 2 deletion modes: Local and All Participants:

* The Local deletion mode (LYRDeletionModeLocal) will remove the deleted object from ONLY the current device. This is not a synchronized delete, rather just a delete of the object from the local DB. So please note, if the user logs out and logs back in, the deleted object will reappear as we dump the local db on logout and do a complete sync on next login.

* The All Participants deletion mode (LYRDeletionModeAllParticipants) on the other hand tombstones the deleted object from all devices of all participants. The deleted object can be considered to be completely deleted.

```objectivec
// Deletes a conversation
[conversation delete:LYRDeletionModeAllParticipants error:nil];

// Deletes a message
[message delete:LYRDeletionModeAllParticipants error:nil];
```
