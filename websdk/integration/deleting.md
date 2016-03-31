# Deleting

## Deleting Messages

### For All Users

To delete a Message for all of your users, use:

```javascript
message.delete(layer.Constants.DELETION_MODE.ALL);
```

### For This User

To delete a Message from this user, as well as any other devices this user is logged in from, use:

```javascript
message.delete(layer.Constants.DELETION_MODE.MY_DEVICES);
```

## Deleting Conversations

### For All Users

To delete a Conversation for all of your users, use:

```javascript
conversation.delete(layer.Constants.DELETION_MODE.ALL);
```

### Leaving the Conversation

To Leave the Conversation means that the user is no longer a participant, and the Conversation is deleted for this user as well as any other devices this user is logged in from.

```javascript
conversation.leave();
```

### Delete for This User Without Leaving

To delete a Conversation for this user, and all of this user's devices, but without actually removing the user as a participant, use:

```javascript
conversation.delete(layer.Constants.DELETION_MODE.MY_DEVICES);
```

The Conversation will be removed from your Conversation Lists, but because the user is still a participant, a new Message in this Conversation will cause the Conversation to be restored to all of this user's devices.
