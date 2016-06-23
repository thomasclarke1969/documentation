# Typing Indicator

The Layer SDK provides a simple API which allows applications to both broadcast and receive typing indicator events. This functionality allows Layer powered applications to implement a dynamic UI in response to typing events.

## Broadcasting

The simplest way to setup typing indicators to be sent from your client is with a TypingListener class:

```javascript
var typingListener = client.createTypingListener(document.getElementById('mytextarea'));
typingListener.setConversation(mySelectedConversation);
```

The typing listener will monitor the specified input or textarea for changes and automatically broadcast when the user has started or stopped typing into that input.  The only thing that the application must do is notify the typingListener whenever changing Conversations:

```javascript
typingListener.setConversation(anotherConversation);
```

## Receiving

Applications are notified of typing indicator events by subscribing to the Layer Client's `typing-indicator-change` events:

```javascript
client.on('typing-indicator-change', function(evt) {
    if (evt.conversationId === selectedConversation.id) {
        var typingUsers = evt.typing;
        var typingUserNames = typingUsers.map(function(identity) {
            return identity.displayName;
        });
        console.log('The following users are typing: ' + typingUserNames.join(', '));

        var pausedUsers = evt.paused;
        var pausedUserNames = pausedUsers.map(function(identity) {
            return identity.displayName;
        });
        console.log('The following users are paused: ' + pausedUserNames.join(', '));
    }
 });

```

The `evt` in the above snippet contains three properties:

* `conversationId`: The ID of the conversation that has changed so that you can ignore typing events on Conversations your not currently rendering.
* `typing`: An array of layer.Identity objects of users who are currently typing.
* `paused`: An array of layer.Identity objects of users who were recently typing but appear to have paused briefly.

Note that a user who is finished typing is not explictly reported on except by ommitting them from the `typing` and `paused` arrays.

## Intended Use

Typing indicator events are ephemeral, meaning they are not persisted by Layer. States are automatically updated by the server if a client does not post any updates; a user who is `typing` becomes `paused`, and a user who is `paused` becomes `finished`.  This means that even if a client loses its connection, a user will shortly become `finished` and removed from the event structure.
