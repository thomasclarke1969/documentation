# Sending Messages

You can create Messages using the following endpoint.

```request
POST /apps/:app_uuid/conversations/:conversation_uuid/messages
```

Every Conversation contains a `messages_url` property that provides you with the URL above.  Using the `messages_url` to obtain that URL will help to future proof your system.

```emphasis
Messages sent by the Platform API are currently limited to a size of 2kb per message part.
```

### Parameters

| Name    | Type |  Description  |
|---------|------|---------------|
| **sender_id**  | string | Identity ID of the participant that this message will appear to be from (layer:///identities/userA) |
| **parts**           | Array  | Array of MessageParts |
| **parts.body**      | string | Text or base64 encoded data for your message |
| **parts.mime_type** | string | text/plain, image/png or other mime type describing the body of this MessagePart |
| **parts.encoding**  | string | If sending base64 encoded data, specify base64 else omit this field |
| **notification** | object | See [Push Notifications](https://developer.layer.com/docs/platform/misc#notification-customization) docs for detailed options |

### Example Request: Sending a Message

```json
{
    "sender_id": "layer:///identities/admin",
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
        "text": "This is the alert text to include with the Push Notification.",
        "sound": "chime.aiff"
    }
}
```

### Successful Response `201 (Created)`

```json
{
    "id": "layer:///messages/940de862-3c96-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/messages/940de862-3c96-11e4-baad-164230d1df67",
    "conversation": {
        "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
        "url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67"
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
      "id": "layer:///identities/admin",
      "url": "https://api.layer.com/identities/admin",
      "user_id": "admin",
      "display_name": "The Administrator",
      "avatar_url": "https://mydomain.com/images/admin.gif"
    },
    "recipient_status": {
        "layer:///identities/777": "sent",
        "layer:///identities/999": "sent",
        "layer:///identities/111": "sent"
    }
}
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"parts": [{"body": "Hello world", "mime_type": "text/plain"}], "notification": {"text": "Howdy"}, "sender_id": "layer:///identities/admin"}' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID/messages
```

## Specifying a Sender

The `sender_id` is the ID for a Layer Identity object representing the sender of this Message.
There are two types of Identities you might try to send from:

1. Users (The Identity Object's `type` field is `User`)
2. A Bot (The Identity Object's `type` field is `Bot`)

An Identity must exist to use it as the `sender_id`; you can [Create an Identity](../users#identity) at any time.

Regardless of what Type of Identity it is, the `sender_id` will always be a string formatted as `layer:///identities/ID`.
Note as well that the Identity ID is a URI derived from the User IDs in your User Management System:

```javascript
var identityID = 'layer:///identities/' + enencodeURIComponent(userId);
```

