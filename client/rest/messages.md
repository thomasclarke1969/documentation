# Retrieving All Messages

You can List Messages using:

```request
GET /conversations/:conversation_uuid/messages
```

Get the most recent Messages in a Conversation:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/conversations/CONVERSATION_UUID/messages
```

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default and maximum value of 100. |
| **from_id** | string | Get the Messages after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///messages/uuid` or as just a UUID |

### Headers

All List Resource requests will return a header indicating the total number of results
to page through.

```text
Layer-Count: 4023
```

Pagination example:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/conversations/CONVERSATION_UUID/messages?from_id=UUID
```

### Response `200 (OK)`

```text
[<Message>, <Message>]
```

# Retrieving a Message

You can get a single Message using:

```request
GET /messages/:message_uuid
```

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/messages/MESSAGE_UUID
```

### Response `200 (OK)`

```json
{
  "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
  "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67",
  "receipts_url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67/receipts",
  "conversation": {
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
  },
  "parts": [
    {
      "body": "Hello, World!",
      "mime_type": "text/plain"
    },
    {
      "body": "YW55IGNhcm5hbCBwbGVhc3VyZQ==",
      "mime_type": "image/jpeg",
      "encoding": "base64"
    }
  ],
  "sent_at": "2014-09-09T04:44:47+00:00",
  "sender": {
    "name": null,
    "user_id": "5678"
  },
  "recipient_status": {
    "5678": "read",
    "1234": "sent"
  }
}
```

# Sending a Message

You can create and send a Message using:

```request
POST /conversations/:conversation_uuid/messages
```

### Parameters

| Name    | Type |  Description  |
|---------|------|---------------|
| **parts**           | MessagePart[]  | Array of MessageParts |
| **parts.body**      | string | Text or base64 encoded data for your message, up to 2KB in size |
| **parts.mime_type** | string | `text/plain`, `image/png` or other mime type describing the body of this MessagePart |
| **parts.encoding**  | string | If sending base64 encoded data, specify `base64` else omit this field |
| **parts.content**  | Content | If sending Rich Content, use the Content object |
| **notification**            | object | See the [Push Notifications Section](#push-notifications) for detailed options |
| **id**       | string | Optional UUID or Layer ID, used for [deduplication](introduction#deduplication) |

### Example

```json
{
  "parts": [
    {
      "body": "Hello, World!",
      "mime_type": "text/plain"
    },
    {
      "body": "YW55IGNhcm5hbCBwbGVhc3VyZQ==",
      "mime_type": "image/jpeg",
      "encoding": "base64"
    }
  ],
  "notification": {
    "title": "Alert",
    "text": "This is the alert text to include with the Push Notification.",
    "sound": "chime.aiff"
  }
}
```

```console
curl  -X POST \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/json" \
      -d '{"parts": [ {"body": "Hello world", "mime_type": "text/plain"}, {"body": "YW55IGNhcm5hbCBwbGVhc3VyZQ==", "mime_type": "image/jpeg", "encoding": "base64"}  ],  "notification": { "text": "This is the alert text", "sound": "chime.aiff" }}' \
      https://api.layer.com/conversations/CONVERSATION_UUID/messages
```

### Response `201 (Created)`

```json
{
  "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
  "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67",
  "receipts_url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67/receipts",
  "conversation": {
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
  },
  "parts": [
    {
      "body": "Hello, World!",
      "mime_type": "text/plain"
    },
    {
      "body": "YW55IGNhcm5hbCBwbGVhc3VyZQ==",
      "mime_type": "image/jpeg",
      "encoding": "base64"
    }
  ],
  "sent_at": "2014-09-09T04:44:47+00:00",
  "sender": {
    "name": null,
    "user_id": "5678"
  },
  "recipient_status": {
    "5678": "read",
    "1234": "sent"
  }
}
```

### Response `409 (Conflict)`

If using [deduplication](introduction#deduplication), you may get a conflict if retrying the request:

```json
{
  "id": "id_in_use",
  "code": 111,
  "message": "The requested Message already exists",
  "url": "https://developer.layer.com/docs/client/websockets#create-requests",
  "data": {
    "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67",
    "receipts_url": "https://api.layer.com/messages/940de862-3c96-11e4-baad-164230d1df67/receipts",
    "conversation": {
      "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
      "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
    },
    "parts": [
      {
        "body": "Hello, World!",
        "mime_type": "text/plain"
      },
      {
        "body": "YW55IGNhcm5hbCBwbGVhc3VyZQ==",
        "mime_type": "image/jpeg",
        "encoding": "base64"
      }
    ],
    "sent_at": "2014-09-09T04:44:47+00:00",
    "sender": {
      "name": null,
      "user_id": "5678"
    },
    "recipient_status": {
      "5678": "read",
      "1234": "sent"
    }
  }
}
```

## Special Rules

1. Message parts whose bodies cannot be encoded as a JSON string need to be encoded as Base64, and the message part's `encoding` property should be "base64".
2. The un-encoded length of a message part cannot exceed 2KB. The server will decode such message parts before transmitting them to clients that can accept binary data.

## Push Notifications

Layer provides extensive support for Push Notifications on both iOS (APNS) and Android (GCM). Pushes are delivered to devices when Messages are sent using the `notification` parameter.  The possible values for the `notification` object are described at: [Push Notifications](https://developer.layer.com/docs/client/introduction#notification-customization).

Note that values for iOS badge counts cannot be provided because the pushes are fanned out to all participants.

Push Notifications are an optional feature and the `notification` parameter can be omitted entirely for Web-to-Web communication use-cases.

## Timing of Create Message Calls

See Timing of [Conversation Creation](/docs/client/rest#timing-of-create-conversation-calls) Calls for details on why you might prefer to use the WebSocket API to send messages.

# Deleting a Message

Messages will sometimes need to be deleted, and this can be done using a REST `delete` method called on the URL for the resource to be deleted.

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **mode** | string  | "all_participants" or "my_devices" selects whether to delete it for everyone, or just to remove the Message from this user's account. |

Note that there is no undelete, regardless of whether the Message is deleted for all users or just for this user.

You can delete a Message using:

```request
DELETE /messages/:message_uuid?mode=all_participants
```

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/json" \
      https://api.layer.com/messages/MESSAGE_UUID?mode=all_participants
```

### Response `204 (No Content)`

The standard successful response is a `204 (No Content)`.
