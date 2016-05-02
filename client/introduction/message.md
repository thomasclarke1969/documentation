# The Message Object

The following JSON represents a typical Message; referred to throughout this document as `<Message>`:

```json
{
  "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
  "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67",
  "receipts_url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67/receipts",
  "position": 15032697020,
  "conversation": {
    "id": "layer:///conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f",
    "url": "https://api.layer.com/conversations/e67b5da2-95ca-40c4-bfc5-a2a8baaeb50f"
  },
  "parts": [
    {
      "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/0",
      "mime_type": "text/plain",
      "body": "This is the message."
    },
    {
      "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67/parts/1",
      "mime_type": "image/png",
      "content": {
        "id": "layer:///content/7a0aefb8-3c97-11e4-baad-164230d1df67",
        "download_url": "http://google-testbucket.storage.googleapis.com/some/download/path",
        "expiration": "2014-09-09T04:44:47+00:00",
        "refresh_url": "https://api.layer.com/content/7a0aefb8-3c97-11e4-baad-164230d1df67",
        "size": 172114124
      }
    }
  ],
  "sent_at": "2014-09-09T04:44:47+00:00",
  "sender": {
    "user_id": "1234",
    "display_name": "one two three four",
    "avatar_url": "",
    "name": null
  },
  "is_unread": true,
  "recipient_status": {
    "777": "sent",
    "999": "read",
    "111": "delivered",
    "1234": "read"
  }
}
```

The Message Object represents a message sent by a user (or by a server) to the participants within a Conversation. A Message has the following properties:

| Name    | Type |  Description  |
|---------|------|---------------|
| **id** | string | A Layer ID to identify the Message |
| **url** | string | A URL for accessing the Message via the REST API |
| **sender** | object | Identifies who sent the message |
| **sender.user_id** | string | The user_id is the ID of the participant that sent the message |
| **sender.display_name** | string | The display name used when rendering this user in a UI |
| **sender.avatar_url** | string | A URL to an avatar image to display next to the user |
| **sender.name** | string | If sent by the Platform API, the name is a system name such as "Administrator" or "Moderator" and is used instead of user_id |
| **sent_at** | string | Date/time that the message was sent; "2014-09-09T04:44:47+00:00" |
| **position** | integer | Position of the Message within the Conversation |
| **conversation** | object | Conversation that the Message is a part of |
| **conversation.id** | string | ID of the Conversation |
| **conversation.url** | string | URL for accessing the Conversation via the REST API |
| **is_unread** | boolean | Indicates if the user has read the Message |
| **recipient_status** | object | Hash of User IDs indicating which users have received/read the message |
| **parts** | MessagePart[] | Each MessagePart in the parts array contains a part of the contents of the message |


## The `id` property

An ID consists of a prefix of `layer:///messages/` followed by a UUID.  This ID format is common across all of the Layer Platform.

This ID is used for:

1. Indexing a cache within your client
2. As a parameter when performing operations via the REST API or WebSocket API

## The `url` property

The `url` property specifies how to retrieve, update or delete the Message via the REST API.

## The `sender` property

The Sender object consists of two properties:

| Name    | Type |  Description  |
|---------|------|---------------|
| **user_id** | string | The user_id is the ID of the participant that sent the message |
| **display_name** | string  | The display name used when rendering this user in a UI |
| **avatar_url** | string  | A URL to an avatar image to display next to the user |
| **name** | string | If sent by the Platform API, the name is a system name such as "Administrator" or "Moderator"; else its null |

These two properties are mutually exclusive.  If one has a value, then the other must be null.

## The `sent_at` property

An ISO 8601 formatted date/time string indicating when the Message was received by the server.

`2014-09-09T04:44:47+00:00`

## The `position` property

Conversations contain an array of messages, ordered by their `position` properties.  The `position` is not a global concept, but rather specific to each individual user and their view of the Conversation.

## The `conversation` property

Each Message object identifies the Conversation it is a part of, providing both an `id` and a `url` for accessing it.  Under normal conditions, it should be obvious what Conversation a Message belongs to.  However, when receiving a Message via a websocket, the `conversation` property is the only way to know which Conversation it belongs with.

## The `is_unread` property

A Message is known to be read if any client that is authenticated as this user has sent a [read receipt](rest#receipts).  Until that is received, `is_unread` is equal to true, and can be taken as a hint to your UI on how to highlight this Message.

The sender of a Message is always assumed to have read the Message even if no read receipt was sent.

## The `recipient_status` property

Every Message has a Recipient Status object.  The status object looks roughly like:

```json
{
  "t-bone": "read",
  "kevin": "delivered",
  "blake": "sent"
}
```

| Value |  Description  |
|-------|---------------|
| **sent**  | The user is on the recipient list but no Delivery Receipt has been received |
| **delivered**  | A Delivery Receipt has been received for this user |
| **read**  | A Read Receipt has been received for this user, or this user is the sender |

The Recipient Status object is driven by Receipts.  A Receipt is a message sent by a browser/device to the server when:

1. Receiving a Message (Delivery Receipt)
2. Displaying a Message (Read Receipt)

## The `parts` property

The `parts` represents an array of [MessagePart objects](#message-part) that makeup this Message.
