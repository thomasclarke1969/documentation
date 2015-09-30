# The Conversation Object

The following JSON represents a typical Conversation; referred to throughout this document as `<Conversation>`:

```json
{
  "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
  "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
  "messages_url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/messages",
  "created_at": "2014-09-15T04:44:47+00:00",
  "last_message": null,
  "participants": [
    "1234",
    "777",
    "999",
    "111"
  ],
  "distinct": true,
  "unread_message_count": 3,
  "metadata": {
    "title": "Who likes this conversation?",
    "favorite": "true",
    "background_color": "#3c3c3c",
    "likes": "5",
    "likers": {
      "user1": "3",
      "user8": "2"
    }
  }
}
```

| Name    | Type |  Description  |
|---------|------|---------------|
| **id** | string | A Layer ID to identify the Conversation |
| **url** | string | A URL for accessing the Conversation via the REST API |
| **participants** | string[] | Array of User IDs indicating who is currently participating in a Conversation |
| **created_at** | string | The date that the Conversation was created; "2014-09-09T04:44:47+00:00" |
| **last_message** | Message | A Message Object representing the last message sent within this Conversation.  |
| **distinct** | boolean | *true* if this is the only Distinct Conversation shared amongst these participants |
| **unread_message_count** | integer | Number of unread messages for this Conversation |
| **metadata** | object | Custom data associated with the Conversation that is viewable/editable by all participants of the Conversation |



```emphasis
Note, The values of the fields above may vary amongst participants of the Conversation.  Different users will have different values for `unread_message_count` for example.  And a user who has deleted a message in a Conversation may have a different `last_message` than a participant who did NOT delete that message.
```

## The `id` property

An ID consists of a prefix of `layer:///conversations/` followed by a UUID.  This ID format is common across all of the Layer Platform.

This ID is used for:

1. Indexing a cache within your client
2. As a parameter when performing operations via the REST API or WebSocket API


## The `url` property

The `url` property specifies how to retrieve, update or delete the Conversation via the REST API.

### The `participants` property

A Participant is a user who can send and receive messages within this Conversation, and is represented in the `participants` property as a User ID.  A User ID is any arbitrary string that your identity provider has placed within its Identity Token to identify a user.  The `participants` property is an array of up to 25 user IDs for users who are a part of this Conversation.

Note that by creating a Conversation with a "User A" in the participant list, "User A" will automatically be a part of that Conversation until they remove themselves from the Conversation (assuming that your UI permits this).  This means that if your UI allows "User B" to create a Conversation with "User A" in the participant list, "User A" is now a part of the Conversation and receiving messages for that Conversation, whether they wanted to be in the Conversation or not.

### The `metadata` property

Metadata allows custom data to be associated with a Conversation.  For example, there is no `title` property in the Conversation Object.  If your Conversations need a title to share between all participants and render as part of your view, you can add a `title` property to the metadata and share it that way.

Metadata is an object that developers control, which contains alphanumeric keys, and string or object values.  Numerical and boolean values are not supported; but these can be passed as strings and recast by the receiving clients.

The following metadata is valid; all of the values are either strings or sub-objects:

```json
{
  "metadata": {
    "title": "Fred's Conversation",
    "history": {
      "last_favorite": {
        "body": "Doh!",
        "time": "10-10-2010 10:05:00"
      },
      "least_favorite": {
        "body": "01110000101",
        "time": "10-10-2010 10:05:00"
      }
    }
  }
}
```

## The `created_at` property

An ISO 8601 formatted date/time string indicating when the Conversation was created on the server.

`2014-09-09T04:44:47+00:00`

## The `last_message` property

The `last_message` property is a convenience, used primarily for rendering a list of Conversations and indicating the state of the Conversation.  It contains a full Message Object representing the last message in the conversation.  If there are no Messages in the Conversation, the `last_message` property will be `null`.


## The `distinct` property

If `User A` wants to talk to `User B`, they should not need to create a new Conversation every time they talk. By reusing an existing Conversation, they can access the Message history and context around their previous communications. To help ensure that users do not inadvertently create multiple Conversations when they intend to maintain a single thread of communication, Layer supports the concept of Distinct Conversations.

In a Distinct Conversation, it is guaranteed that among the given set of participants there will exist one (and only one) Conversation. When creating a Conversation the distinct property is passed, and determines how it is created. Possible values are:

* **true**: If there is a matching Conversation, return it. Otherwise a new Conversation is created and returned.
* **false**: Always create and return a new Conversation.

An existing Conversation matches if it is itself Distinct, and it has the same participants.

A Distinct Conversation becomes a non-distinct Conversation if you change its participant list.

### Common use cases

* A UI lets a user select another user to create a Conversation; you can use the Create Conversation API to attempt to create the Conversation, but still find yourself with a Conversation that contains all of the chat history of these two users.
* Two users might try to create a Conversation with one another at the same time.  Rather than have two Conversations, whichever is created first is delivered to Both users as the Conversation they will use.
