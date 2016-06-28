# Deleting

There are two constants used for deleting content

* layer.Constants.DELETION_MODE.ALL: Delete a resource for All users
* layer.Constants.DELETION_MODE.MY_DEVICES: Delete a resource from this user's account

## Deleting Messages

```javascript
message.delete(layer.Constants.DELETION_MODE.ALL);
message.delete(layer.Constants.DELETION_MODE.MY_DEVICES);
```

## Deleting Conversations

```javascript
conversation.delete(layer.Constants.DELETION_MODE.ALL);
conversation.delete(layer.Constants.DELETION_MODE.MY_DEVICES);
```

Note however that deleting a Conversation does not remove this user as a participant.


### Delete for This User Without Leaving

```javascript
conversation.delete(layer.Constants.DELETION_MODE.MY_DEVICES);
```

The Conversation will be removed from your Conversation Lists, but because the user is still a participant, a new Message in this Conversation will cause the Conversation to be restored to all of this user's devices.  All Messages in the Conversatation prior to this deletion will remain deleted for this user.


### Leaving the Conversation

To leave the Conversation means that the user is no longer a participant, and the Conversation is deleted for this user as well as any other devices this user is logged in from.

```javascript
conversation.leave();
```

### Deleting Announcements

Announcements do not support the Deletion Modes;  deletion is simply:

```javascript
announcement.delete();
```

### Deleting Identities

Identities can not be deleted; they CAN be unfollowed.  But information about an Identity may still be loaded in order to render Messages or Conversations you have with them.  See Identities for more information.
