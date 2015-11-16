# Sending Announcements

Announcements are messages sent to all users of the application or to a list of users. These Messages will arrive outside of the context of a conversation (the `conversation` property will be `null`).

```emphasis
Announcements are currently limited to a size of 2kb per message part.
```

The following request behaves similarly to the [Send a Message](#send-a-message) request above.  Each recipient will receive the Announcement within each of their system Conversations.

```request
POST /apps/:app_uuid/announcements
```

### Parameters

| Name         |    Type     |  Description  |
|--------------|-------------|---------------|
| **recipients** | array of strings | Array of User IDs to deliver the Announcement to. |


> See [Send a Message](#send-a-message) parameters section for details on the remaining parameters.

One key difference with [Send a Message](#send-a-message): you may not use `sender.user_id` when sending an Announcement.

### Example Request: Sending an Announcement

```json
{
    "recipients": [ "1234", "5678" ],
    "sender": {
        "name": "The System"
    },
    "parts": [
        {
            "body": "Hello, World!",
            "mime_type": "text/plain"
        }
    ],
    "notification": {
        "text": "This is the alert text to include with the Push Notification.",
        "sound": "chime.aiff"
    }
}
```

### Successful Response `202 (Accepted)`

```json
{
    "id": "layer:///announcements/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/announcements/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "sent_at": "2014-09-15T04:44:47+00:00",
    "recipients": [ "1234", "5678" ],
    "sender": {
        "name": "The System",
        "user_id": null
    },
    "parts": [
        {
            "body": "Hello, World!",
            "mime_type": "text/plain"
        }
    ]
}
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"parts": [{"body": "Hello world", "mime_type": "text/plain"}], \
           "notification": {"text": "Howdy"}, \
           "sender": {"name": "Your Master"}, \
           "recipients": ["a","b","c"]}' \
      https://api.layer.com/apps/APP_UUID/announcements
```

## Receiving Announcements

For more information about how to fetch announcements and mark them as read, check out our [iOS](https://developer.layer.com/docs/ios/integration#announcements) and [Android](https://developer.layer.com/docs/android/integration#announcements) client API documentation.
