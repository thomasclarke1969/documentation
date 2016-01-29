# Synchronization and Offline Behaviors

Applications built with the Layer Web SDK should continue to work while offline, and synchronize when the connection is restored.  You can continue to create conversations, send messages, change participants, etc... while offline.

For this to work, we must provide a Conversation object or Message object without waiting for a response from the server.  The example below shows that you can immediately use an object once created without waiting for confirmation from the server:

```javascript
var c = client.createConversation(['a', 'b']);
var m = c.createMessage('hello').send();
view.renderMessage(m);

m.on('messages:sent', function() {
    view.rerenderMessage(m);
});
```

The above example will render the message "hello" immediately; once we are online and the message has been successfully sent, an event will trigger in case you want to render it as "sent".

Or the same can be done with:

```javascript
// A new unsynced Conversation
var c = client.createConversation(['a', 'b']);

// A query on the Conversation that doesn't yet exist on the server
var query = client.createQuery({
    model: layer.Query.Message,
    predicate: 'conversation.id = \'' + c.id + '\''
});

// Render any data added to the query
query.on('change', function(evt) {
    view.renderMessages(query.data);
});

// A new unsynced message in the unsynced conversation
var m = c.createMessage('hello').send();

```
The Conversation, Message and Query are all created. The Query's data will contain the new Message as soon as its been locally created.

Once we are online, the Conversation and Message will be sent to the server, and new Messages in that Conversation will be added to the Query, and new query events will fire as the Message is accepted by the server, and its properties are updated.

## The Synchronization Manager

All operations requested will go through a synchronization manager and then on to the Layer Servers.  You can subscribe to events from the synchronization manager if you want to receive detailed events related to communications.

```javascript
client.syncManager.on({
    "sync:add": function(event) {
        var request = event.request;
        var target = event.target;
        console.log(target.toString() + ' has a ' + event.op + ' operation added to the sync queue');
    },
    'sync:success': function(event) {
        var request = event.request;
        var target = event.target;
        console.log(target.toString() + ' has completed a ' + request.op + ' operation');
    },
    'sync:error': function(event) {
        var request = event.request;
        var target = event.target;
        console.log(target.toString() + ' has failed a ' + request.op + ' operation');
    }
});
```

For more detail, see the SyncManager class.
