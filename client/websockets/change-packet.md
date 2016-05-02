# Change Packets

The WebSocket API will notify you of any and all changes on the server to resources that the authenticated user has permission to view.

Changes may include creating, deleting or updating of Messages and Conversations.  The Change Packets will provide all of the data needed to keep your local copy in sync with the server copy of this data.

It is not necessary for an application to use all of these events to maintain state.  New Messages in Conversations that your user is not currently using may not be of interest; updates to Conversations that are not locally cached probably aren't of interest; etc...  Ultimately, developers will need to evolve a strategy for:

* Managing a cache of Messages and Conversations that does not grow out of control
* Deciding how to handle events on Messages and Conversations that are not already cached (use the REST API to load them or ignore them)
* Deciding whether to cache new objects that are not part of a currently open Conversation (cache them or ignore them).

Change packets have the following properties in the `body` field:

| Field | Description |
|-------|-------------|
| **operation** | create, delete, update |
| **object** | The type and identifier of the object being operated upon. |
| **data** | Details of the change that was performed on the server. |

## The `object` Field

The `object` field is used to identify the object that the Packet relates to.

| Field | Description |
|-------|-------------|
| **type** | Type of Object: Conversation, Message, Identity |
| **id**   | The Layer ID of the Object: "layer:///Conversations/uuid" |
| **url**  | URL to the specified Object

 When the server is sending a Change Packet to the client, the Object will look like:

```json
{
  "object": {
    "type": "Conversation",
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
  }
}
```

## Create Events

A Change Packet containing a create event is received whenever the server receives a new Message or Conversation.  Note that you will receive these not just for new Messages and Conversations created by others, but also by yourself.  The `data` field will contain the full [Conversation](introduction#conversation) or [Message](introduction#message) object.

### A Conversation has been Created

```json
{
  "type": "change",
  "counter": 6,
  "timestamp": "2014-09-15T04:45:00+00:00",
  "body": {
    "operation": "create",
    "object": {
      "type": "Conversation",
      "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
      "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
    },
    "data": <Conversation>
  }
}
```

### A Message has been Created

```json
{
  "type": "change",
  "counter": 7,
  "timestamp": "2014-09-15T04:45:00+00:00",
  "body": {
    "operation": "create",
    "object": {
      "type": "Message",
      "id": "layer:///messages/f3cc7b32-3c92-11e4-baad-164230d1df68",
      "url": "https://api.layer.com/messages/f3cc7b32-3c92-11e4-baad-164230d1df68"
    },
    "data": <Message>
  }
}
```

### An Identity has been Created

```json
{
  "type": "change",
  "counter": 7,
  "timestamp": "2014-09-15T04:45:00+00:00",
  "body": {
    "operation": "create",
    "object": {
      "type": "Message",
      "id": "layer:///identities/1234",
      "url": "https://api.layer.com/identities/1234"
    },
    "data": <Identity>
  }
}
```


## Delete Events

A Change Packet containing a delete event is received whenever the server  detects that a Message or Conversation has been deleted.  Note that you will receive these not just for Messages and Conversations deleted by others, but also by yourself.

The `data` field will contain a `mode` field indicating if the deletion is for `all_participants` (deleted for all users) or `my_devices` (deleted for this user's account only); See [DELETE Requests](rest#deleting-a-conversation).

There are three types of Delete Events your app may encounter:

### Delete for `all_participants`

Both Messages and Conversations can be deleted for all users; you know it is this type of deletion when the mode is `all_participants`.

```json
 {
   "type": "change",
   "counter": 9,
   "timestamp": "2015-01-19T09:15:43+00:00",
   "body": {
     "operation": "delete",
     "object": {
       "type": "Message",
       "id": "layer:///messages/f3cc7b32-3c92-11e4-baad-164230d1df68",
       "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df68"
     },
     "data": {
       "mode": "all_participants"
     }
   }
 }
 ```

 ```json
 {
   "type": "change",
   "counter": 8,
   "timestamp": "2015-01-19T09:15:43+00:00",
   "body": {
     "operation": "delete",
     "object": {
       "type": "Conversation",
       "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
       "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
     },
     "data": {
       "mode": "all_participants",
       "from_position": null
     }
   }
 }
 ```

### Deleting for `my_devices`

Both Messages and Conversations can be deleted for this user only; you know it is this type of deletion when the mode is `my_devices`.

```json
 {
   "type": "change",
   "counter": 9,
   "timestamp": "2015-01-19T09:15:43+00:00",
   "body": {
     "operation": "delete",
     "object": {
       "type": "Message",
       "id": "layer:///messages/f3cc7b32-3c92-11e4-baad-164230d1df68",
       "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df68"
     },
     "data": {
       "mode": "my_devices"
     }
   }
 }
 ```

```json
 {
   "type": "change",
   "counter": 8,
   "timestamp": "2015-01-19T09:15:43+00:00",
   "body": {
     "operation": "delete",
     "object": {
       "type": "Conversation",
       "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
       "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
     },
     "data": {
       "mode": "my_devices",
       "from_position": null
     }
   }
 }
 ```

 ### Deleting `from_position`

This last one is a special case of _Deleting for `my_devices`_ where the Conversation was deleted for all of the user's devices, but the user did not leave the Conversation.  And then a New Message shows up causing the Conversation to be recreated for that user (see [Leave Parameter in Delete](rest#deleting-a-conversation)).  The `from_position` tells your app to delete all Messages whose `position` field are less than or equal to this value, and then **do not delete the Conversation**.

 ```json
 {
   "type": "change",
   "counter": 8,
   "timestamp": "2015-01-19T09:15:43+00:00",
   "body": {
     "operation": "delete",
     "object": {
       "type": "Conversation",
       "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
       "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
     },
     "data": {
       "mode": "my_devices",
       "from_position": 123456
     }
   }
 }
 ```

### Other Deletes

After unfollowing a user, all of your devices should receive a delete event.  If the Platform API deletes an Identity, all followers of that Identity should receive a delete event.

 ```json
 {
   "type": "change",
   "counter": 8,
   "timestamp": "2015-01-19T09:15:43+00:00",
   "body": {
     "operation": "delete",
     "object": {
       "type": "Identity",
       "id": "layer:///identities/1234",
       "url": "https://api.layer.com/identities/1234"
     },
     "data": null
   }
 }
 ```

### Expected actions by your App

Expected responses to a Deletion Event are the same for _Deleting for `all_participants`_ and _Deleting for `my_devices`_:

1. Remove the object from your UI if you are rendering the object
2. Remove the object from any data caches/data stores

Expected response to _Deleting `from_position`_:

1. Delete all messages in the Conversation whose `position` is less than or equal to the `from_position` value from your UI and stores.
2. Do NOT delete the Conversation


## Update Events

A Change Packet containing an update event is received whenever the server detects that a Message or Conversation has been changed.  Note that you will receive these not just for Messages and Conversations changed by others, but also by yourself.

The `data` field will contain an array of layer-patch operations that specify the changes to make to the object.

The Layer Patch Operations Array is documented in the [Layer Patch Spec](https://github.com/layerhq/layer-patch/blob/master/README.md); that repo also contains a JavaScript library for working with Layer Patch operations.

The following properties can be updated via an Update Event:

* **Conversation.participants**: participants can be added or removed
* **Conversation.metadata**: Metadata keys can be set or deleted
* **Message.recipient_status**: Recipient status is updated as delivery and read receipts are received
* **Conversation.last_message**: The ID for the Message is provided each time a new Message becomes the most recent Message
* **Conversation.unread_message_count**: Any time a Conversation's unread message count changes, you will be notified

Any field of an Identity object other than the `user_id` field may change.

Note that it is common to receive multiple Layer Patch Operations in a single Change Packet, resulting in multiple changes to a properties.


### Add/Replace Participants Example

```json
{
  "type": "change",
  "counter": 10,
  "timestamp": "2015-01-19T09:15:43+00:00",
  "body": {
    "operation": "update",
    "object": {
      "type": "Conversation",
      "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
      "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
    },
    "data": [
      { "operation": "add",    "property": "participants", "value": "4567" },
      { "operation": "remove", "property": "participants", "value": "5678" }
    ]
  }
}
```

### Update Metadata Example

```json
{
  "type": "change",
  "counter": 11,
  "timestamp": "2015-01-19T09:15:43+00:00",
  "body": {
    "operation": "update",
    "object": {
      "type": "Conversation",
      "id": "layer:///conversations/3cc7b32-3c92-11e4-baad-164230d1df67",
      "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
    },
    "data" : [
      { "operation": "delete", "property": "metadata.a.b.c" },
      { "operation": "set",    "property": "metadata.a.b.name",  "value": "foo" },
      { "operation": "set",    "property": "metadata.a.b.count", "value": "42"  }
    ]
  }
}
```



### Update Read/Delivery Status Example

```json
{
  "type": "change",
  "counter": 12,
  "timestamp": "2015-01-19T09:15:43+00:00",
  "body": {
    "operation": "update",
    "object": {
      "type": "Message",
      "id": "layer:///messages/f3cc7b32-3c92-11e4-baad-164230d1df67",
      "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67"
    },
    "data": [
      {
        "operation": "set",
        "property": "recipient_status.fred\.flinstone",
        "value": "delivered"
      }
    ]
  }
}
```

Note that if the property is "recipient_status.fred.flinstone", then it will try to set:

```json
{
  "recipient_status": {
    "fred": {
      "flinstone": "delivered"
    }
  }
}
```
Whereas what is needed is: "recipient_status.fred\\.flinstone" which will set:

```json
{
  "recipient_status": {
    "fred.flinstone": "delivered"
  }
}
```

### Update Last Message on a Conversation Example

```json
{
  "type": "change",
  "counter": 13,
  "timestamp": "2014-09-15T04:45:00+00:00",
  "body": {
    "operation": "update",
    "object": {
      "type": "Conversation",
      "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
      "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
    },
    "data": [
      {
        "operation": "set",
        "property": "last_message",
        "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67"
      }
    ]
  }
}
```

Note the use of `id` instead of `value` in this Layer Patch Operation; this is a hint
that you may want to lookup the object and set the `last_message` property to the entire object.

### Update Identity

```json
{
  "type": "change",
  "counter": 13,
  "timestamp": "2014-09-15T04:45:00+00:00",
  "body": {
    "operation": "update",
    "object": {
      "type": "Identity",
      "id": "layer:///identities/1234",
      "url": "https://api.layer.com/identities/1234"
    },
    "data": [
      {
        "operation": "set",
        "property": "first_name",
        "value": "One Two"
      },
      {
        "operation": "set",
        "property": "last_name",
        "value": "Three Four"
      }
    ]
  }
}
```
