# Querying

Layer provides an interface with which applications can query for messaging content. Querying is performed with a Query object and can act on Conversations or Messages.  The Query mechanism is fairly simple at this time, but will provide a powerful mechanism in the future for filtering and sorting results.

To demonstrate a simple example, the following queries for the latest 20 messages in the given conversation.

```javascript
// Return 20 most recent messages in myConversation
var query = client.createQuery({
    model: layer.Query.Message,
    predicate: 'conversation.id = \'' + myConversation.id + '\'',
    paginationWindow: 20
});

query.on('change', function(evt) {
    var messages = query.data;
    myMessageRenderer(messages);
});
```
> Note: myConversation.id will be of the form layer:///conversations/UUID

## Live Queries

Queries do not simply return an array of results; the Query object maintains its results:

* updating the order of results
* inserting new results as they are created
* removing results as they are deleted
* updating results as their properties change

Queries are your means of detecting changes to your user's data; whether its new conversations your user has been invited into, new messages for your user, you declare what your interested in by creating a Query for it, and the Query keeps your data synced.

## Constructing a query

The Query object requires a `model` property, which can be one of the three values:

* layer.Query.Message - Query for messages
* layer.Query.Announcement - Query for announcements
* layer.Query.Conversation - Query for conversations
* layer.Query.Identity - Query for identities

```javascript
var query = client.createQuery({
    model: layer.Query.Conversation
});
```

## Applying constraints

The `predicate` property allows applications to apply constraints to a query result set. At this time, `predicate` is only supported for Message queries, and only supports querying for Messages within a specific Conversation.  Further, the Messages query **must** be constrained to a specific Conversation or it will fail.  This constraint will be lifted in the future.

A properly formed `predicate` for use in retrieving Messages:
```javascript
var query = client.createQuery({
    model: layer.Query.Message,
    predicate: 'conversation.id = \'' + myConversation.id + '\''
});
```

## Sorting results

At this time there is very limited support for sorting within Queries:

1. Conversations can be sorted by `createdAt` or `lastMessage.sentAt`.
2. Messages and Announcements are sorted by `position` and this can not at this time be changed.
3. Descending sorts is the only direction currently supported.

The following sort descriptor defines that Conversations be sorted by the `sentAt` time of the Conversation's `lastMessage`:

```javascript
var query = client.createQuery({
    model: layer.Query.Conversation,
    sortBy: [{'lastMessage.sentAt': 'desc'}]
});
```

Note that while you can apply your own sort after receiving the values, remain aware that queries are *live*; as new results arrive, the query results are updated, and you will need to update your own sorted copy as changes arrive.

## Pagination

To facilitate pagination, a `paginationWindow` property can specify the number of results (or additional results) that are requested.  Currently, no more than 100 results can be requested at a time.  An `update` method lets you update your query properties and refire the query.

```javascript
// Creating this query will load 50 results:
var query = client.createQuery({
    model: layer.Query.Conversation,
    paginationWindow: 50
});

// Updating this query will load the next 10 results:
query.update({
    paginationWindow: 60
});

// Updating this query will remove results until 40 are left:
query.update({
    paginationWindow: 40
});
```

## Accessing Data

The query has a `data` property that contains an array of results.  Typically this would be accessed whenever there is a `change` event:

```javascript
var query = client.createQuery({
    model: layer.Query.Conversation
});

query.on('change', function(evt) {
    var conversations = query.data;
    myRenderConversations(conversations);
});
```

More granular details can be accessed about the changes to the results from the `evt` argument as described in [Query Events](#query-events).

## Data Types

The `dataType` property lets you customize how you get your data.  The two values are supported:

* `instance`: This is the default value; the query results and events will provide instances of Message and Conversation objects.
* `object`: Query results and events contain immutable POJO objects that are preferred by some frameworks.


```javascript
var query = client.createQuery({
    model: layer.Query.Message,
    predicate: 'conversation.id = \'' + myConversation.id + '\'',
    dataType: 'instance'
});

query.on('change', function(evt) {
    if (query.data.length) {
        // We can call `on()` on the results because its an instance
        query.data[0].on('messages:read', function() {
            alert('The first message has been read!');
        });
    }
});
```

A `dataType` of 'object' will cause the data to be an array of immutable objects rather than instances:

```javascript
var query = client.createQuery({
    model: layer.Query.Message,
    predicate: 'conversation.id = \'' + myConversation.id + '\'',
    dataType: 'object'
});

query.on('change', function(evt) {
    if (query.data.length) {
        // We must get the instance if we want to call `on()`
        var m = client.getMessage(query.data[0].id);
        m.on('messages:read', function() {
            alert('The first message has been read!');
        });
    }
});
```

## Query Events

Queries fire events whenever their data changes.  There are 5 types of events;
all events are received by subscribing to the `change` event.

### 1. Data Events

The Data event is fired whenever a request is sent to the server for new query results.

This typically happen when first creating the query, when paging for more data, or when changing the predicate which triggers a new request to the server.

The Event object will have an `evt.data` array of all newly added results.  But frequently you may just want to use the `query.data` array and get ALL results.

```javascript
query.on('change', function(evt) {
    if (evt.type === 'data') {
       var newData = evt.data;
       var allData = query.data;
    }
});
```

### 2. Insert Events

A new Conversation or Message was created. It may have been created locally by your user, or it may have been remotely created, received via websocket, and added to the Query's results.

The event `target` property contains the newly inserted object.

```javascript
query.on('change', function(evt) {
   if (evt.type === 'insert') {
      var newItem = evt.target;
      var allData = query.data;
   }
});
```

### 3. Remove Events

A Conversation or Message was deleted. This may have been deleted locally by your user, or it may have been remotely deleted, a notification received via websocket, and removed from the Query results.

The event `target` property contains the removed object.

```javascript
query.on('change', function(evt) {
    if (evt.type === 'remove') {
        var removedItem = evt.target;
        var allData = query.data;
    }
});
```

### 4. Reset Events

Any time your query's model or predicate properties have been changed
the query is reset, and a new request is sent to the server.  The reset event informs your UI that the current result set is empty, and that the reason its empty is that it was `reset`.  This helps differentiate it from a `data` event that returns an empty array (a request to the server that returned `[]`).
```javascript
query.on('change', function(evt) {
    if (evt.type === 'reset') {
        var allData = query.data; // []
    }
});

// This will cause the above reset to be triggered:
query.update({
    predicate: 'conversation.id = \'' + anotherConversation.id + '\''
});
```

### 5. Property Events

If any properties change in any of the objects listed in your Query's `data` property,
a `property` event will be fired.

The event's `target` property contains object that was modified.

```javascript
query.on('change', function(evt) {
    if (evt.type === 'property') {
        var changedItem = evt.target;
        var metadataChanges = evt.getChangesFor('metadata');
        var participantChanges = evt.getChangesFor('participant');

        if (metadataChanges.length) {
            ...
        }

        if (participantChanges.length) {
            ...
        }
    }
});
```
