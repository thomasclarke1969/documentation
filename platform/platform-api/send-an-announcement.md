# Send an Announcement
Announcements are messages sent to all users of the application or to a list of users. These Messages will arrive outside of the context of a conversation (the `conversation` property will be `null`).

The following request behaves similarly to the [Send a Message](#send-a-message) request above.  Each recipient will receive the Announcement within each of their system Conversations.

```request
POST /apps/:app_uuid/announcements
```

### Parameters
| Name         |    Type     |  Description  |
|--------------|-------------|---------------|
| `recipients` | Array of Strings or `"everyone"` | Array of User IDs to deliver the Announcement to or the literal string `"everyone"` in order to message the entire userbase. |


> See [Send a Message](#send-a-message) parameters section for details on the remaining parameters.

One key difference with [Send a Message](#send-a-message): you may not use `sender.user_id` when sending an Announcement.

### Example
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

### Response `202 (Accepted)`
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
        },
        {
            "body": "YW55IGNhcm5hbCBwbGVhc3VyZQ==",
            "mime_type": "image/jpeg",
            "encoding": "base64"
        }
    ]
}
```

```console
curl  -X POST
      -H "Accept: application/vnd.layer+json; version=1.0"
      -H "Authorization: Bearer TOKEN"
      -H "Content-Type: application/json"
      -d '{"parts": [{"body": "Hello world", "mime_type": "text/plain"}],
           "notification": {"text": "Howdy"},
           "sender": {"name": "Your Master"},
           "recipients": ["a","b","c"]}'
      https://api.layer.com/apps/APP_UUID/announcements
```

## Sending an Announcement to Everyone

When `recipients` is set to the string value `"everyone"`, it is interpreted as an instruction to "send the Announcement to all users of my app." Every user who is already "in the system" for this application will receive the Announcement.

Note that when targeting "everyone" each recipient doesn't need to have authenticated with Layer before, but merely be known to exist (perhaps their ID was added to a Conversation by another user). Recipients who have not yet interacted with Layer will receive the Announcement if/when they eventually do connect.

### Example
```json
{
    "recipients": "everyone",
    "sender": {
        "name": "Release Notes"
    },
    "parts": [
        {
            "body": "We are proud to announce a new release of our app!",
            "mime_type": "text/plain"
        }
    ],
    "notification": {
        "text": "A new version is available!",
        "sound": "chime.aiff"
    }
}
```
