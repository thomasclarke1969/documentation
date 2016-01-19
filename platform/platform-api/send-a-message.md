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
| **sender** | object | Identifies the sender of the Message |
| [**sender.user_id**](#warning)  | string | User ID of the participant that this message will appear to be from |
| [**sender.name**](#warning)     | string | Arbitrary string naming the service that this message will appear to be from |
| **parts**           | Array  | Array of MessageParts |
| **parts.body**      | string | Text or base64 encoded data for your message |
| **parts.mime_type** | string | text/plain, image/png or other mime type describing the body of this MessagePart |
| **parts.encoding**  | string | If sending base64 encoded data, specify base64 else omit this field |
| **notification** | object | See [Push Notifications](#notification-customization) docs for detailed options |

<a name="warning"></a>
```emphasis
** IMPORTANT **:
You can either specify `sender.user_id` or `sender.name`, but not both.
```

### Example Request: Sending a Message

```json
{
    "sender": {
        "name": "t-bone"
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
        "name": "t-bone",
        "user_id": null
    },
    "recipient_status": {
        "777": "sent",
        "999": "sent",
        "111": "sent"
    }
}
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"parts": [{"body": "Hello world", "mime_type": "text/plain"}], "notification": {"text": "Howdy"}, "sender": {"name": "Your Master"}}' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID/messages
```

## Specifying a Sender

The `sender` object in the request enables sending Messages in two ways:

1. From a participant
2. From a non-human actor

### From a Participant

The Message can be sent on behalf of a participant of the Conversation. The Message will be delivered as though it were sent directly from the specified `user_id`.

```json
{
    "sender": {
        "user_id": "user1"
    }
}
```

### From a Non-human Actor

Suppose you wanted to send a message from "System", "Moderator" or "Your Friend" rather than have the message appear to be from a participant in the conversation.  The Message will be delivered as though it were sent by the service in the `name` field.

```json
{
    "sender": {
        "name": "Hal 2000"
    }
}
```

Upon delivery, the message will have a `null` value for the `user_id` of the `sender` object, allowing clients to differentiate between messages originating from human and non-human senders.

> It is recommended that you use simple strings that describe the utility of the Service that sent the Message and clearly differentiate such Messages in your UI.
