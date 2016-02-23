# Deleting Content

LayerKit supports the deletion of both conversations and messages. Deletion of a conversation deletes the conversation object and all associated messages. Deletion of a messages only affects that individual message and its parts.

LayerKit supports 2 deletion modes: My Devices and All Participants:

* `LYRDeletionModeMyDevices` will delete the content for only the currently authenticated user. The deletion will also be synchronized among the user's other devices. The content will not be deleted for other participants who have access to it.

* `LYRDeletionModeAllParticipants` will tombstone (mark as deleted) the deleted object from all devices of all participants. The deleted object can be considered to be completely deleted.

```objectivec
// Deletes a conversation
NSError *error = nil;
BOOL success = [conversation delete:LYRDeletionModeAllParticipants error:&error];

// Deletes a message
NSError *error = nil;
BOOL success = [message delete:LYRDeletionModeAllParticipants error:&error];
```
