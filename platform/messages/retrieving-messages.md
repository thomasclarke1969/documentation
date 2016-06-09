# Retrieving Messages

Depending on the use case, messages can be retrieved using either a System perspective or a User perspective.  The System perspective will list all messages in the conversation. A User perspective differs from the System in the following ways:

- It provides a `received_at` property.
- It provides an `is_unread` property.
- It removes all messages that have been deleted for this user but which have not been globally deleted.

## Retrieve Messages (User Perspective)

Use the following endpoint to request all messages in a conversation from a specific user's perspective:

```request
GET /apps/:app_uuid/users/:user_id/conversations/:conversation_uuid/messages
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations/CONVERSATION_ID/messages
```

### Successful Response `200 (OK)`

```json
[
    {
        "conversation": {
            "id": "layer:///conversations/051f1ca7-5760-47a5-bf73-048a747fee44",
            "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/users/bcd5e1d8-d276-4b60-97fd-d4bb18308b07/conversations/051f1ca7-5760-47a5-bf73-048a747fee44"
        },
        "id": "layer:///messages/cf131537-a92b-46d7-a2b5-a89f94c707c5",
        "is_unread": true,
        "parts": [
            {
                "body": "Hello!",
                "mime_type": "text/plain"
            }
        ],
        "received_at": "2016-01-10T13:31:10.394Z",
        "recipient_status": {
            "layer:///identities/2dfbc084-9800-427a-a965-5aef5a2c35b8": "sent",
            "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07": "read"
        },
        "sender": {
          "id": "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "url": "https://api.layer.com/identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "user_id": "bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "display_name": "User A",
          "avatar_url": "https://mydomain.com/images/bcd5e1d8-d276-4b60-97fd-d4bb18308b07.gif"
        },
        "sent_at": "2016-01-10T13:31:04.393Z",
        "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/users/bcd5e1d8-d276-4b60-97fd-d4bb18308b07/messages/cf131537-a92b-46d7-a2b5-a89f94c707c5"
    },
    {
        "conversation": {
            "id": "layer:///conversations/051f1ca7-5760-47a5-bf73-048a747fee44",
            "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/users/bcd5e1d8-d276-4b60-97fd-d4bb18308b07/conversations/051f1ca7-5760-47a5-bf73-048a747fee44"
        },
        "id": "layer:///messages/b9b39a23-1a3a-4e0e-8198-39c869814e58",
        "is_unread": false,
        "parts": [
            {
                "body": "We on for later?",
                "id": "layer:///messages/b9b39a23-1a3a-4e0e-8198-39c869814e58/parts/0",
                "mime_type": "text/plain"
            }
        ],
        "received_at": "2016-01-10T13:31:02.781Z",
        "recipient_status": {
            "layer:///identities/2dfbc084-9800-427a-a965-5aef5a2c35b8": "sent",
            "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07": "read"
        },
        "sender": {
          "id": "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "url": "https://api.layer.com/identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "user_id": "bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "display_name": "User A",
          "avatar_url": "https://mydomain.com/images/bcd5e1d8-d276-4b60-97fd-d4bb18308b07.gif"
        },
        "sent_at": "2016-01-10T13:30:59.548Z",
        "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/users/bcd5e1d8-d276-4b60-97fd-d4bb18308b07/messages/b9b39a23-1a3a-4e0e-8198-39c869814e58"
    }
]
```

## Retrieve Messages (System Perspective)

Use the following endpoint to request all messages in a conversation from the System's perspective:

```request
GET /apps/:app_uuid/conversations/:conversation_uuid/messages
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_ID/messages
```

### Successful Response `200 (OK)`

```json
[
    {
        "conversation": {
            "id": "layer:///conversations/051f1ca7-5760-47a5-bf73-048a747fee44",
            "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/conversations/051f1ca7-5760-47a5-bf73-048a747fee44"
        },
        "id": "layer:///messages/cf131537-a92b-46d7-a2b5-a89f94c707c5",
        "is_unread": null,
        "parts": [
            {
                "body": "Hello!",
                "mime_type": "text/plain"
            }
        ],
        "received_at": null,
        "recipient_status": {
            "layer:///identities/2dfbc084-9800-427a-a965-5aef5a2c35b8": "sent",
            "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07": "read"
        },
        "sender": {
          "id": "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "url": "https://api.layer.com/identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "user_id": "bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "display_name": "User A",
          "avatar_url": "https://mydomain.com/images/bcd5e1d8-d276-4b60-97fd-d4bb18308b07.gif"
        },
        "sent_at": "2016-01-10T13:31:04.393Z",
        "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/conversations/051f1ca7-5760-47a5-bf73-048a747fee44/messages/cf131537-a92b-46d7-a2b5-a89f94c707c5"
    },
    {
        "conversation": {
            "id": "layer:///conversations/051f1ca7-5760-47a5-bf73-048a747fee44",
            "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/conversations/051f1ca7-5760-47a5-bf73-048a747fee44"
        },
        "id": "layer:///messages/b9b39a23-1a3a-4e0e-8198-39c869814e58",
        "is_unread": null,
        "parts": [
            {
                "body": "We on for later?",
                "id": "layer:///messages/b9b39a23-1a3a-4e0e-8198-39c869814e58/parts/0",
                "mime_type": "text/plain"
            }
        ],
        "received_at": null,
        "recipient_status": {
            "layer:///identities/2dfbc084-9800-427a-a965-5aef5a2c35b8": "sent",
            "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07": "read"
        },
        "sender": {
          "id": "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "url": "https://api.layer.com/identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "user_id": "bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
          "display_name": "User A",
          "avatar_url": "https://mydomain.com/images/bcd5e1d8-d276-4b60-97fd-d4bb18308b07.gif"
        },
        "sent_at": "2016-01-10T13:30:59.548Z",
        "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/conversations/051f1ca7-5760-47a5-bf73-048a747fee44/messages/b9b39a23-1a3a-4e0e-8198-39c869814e58"
    }
]
```

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default and maximum value of 100. |
| **from_id** | string | Get the Messages after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///messages/uuid` or as just a UUID |

### Headers

All List Resource requests will return a header indicating the total number of results to page through.

```text
Layer-Count: 4023
```

Pagination example:

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_ID/messages?from_id=UUID
```

### Response `200 (OK)`

```text
[<Message>, <Message>]
```

## Retrieve One Message (User Perspective)

Use the following endpoint to request a single message from a conversation from a specific user's perspective:

```request
GET /apps/:app_uuid/users/:user_id/messages/:message_uuid
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/messages/MESSAGE_ID
```

### Successful Response `200 (OK)`

```json
{
    "conversation": {
        "id": "layer:///conversations/051f1ca7-5760-47a5-bf73-048a747fee44",
        "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/users/bcd5e1d8-d276-4b60-97fd-d4bb18308b07/conversations/051f1ca7-5760-47a5-bf73-048a747fee44"
    },
    "id": "layer:///messages/cf131537-a92b-46d7-a2b5-a89f94c707c5",
    "is_unread": true,
    "parts": [
        {
            "body": "Hello!",
            "mime_type": "text/plain"
        }
    ],
    "received_at": "2016-01-10T13:31:10.394Z",
    "recipient_status": {
        "layer:///identities/2dfbc084-9800-427a-a965-5aef5a2c35b8": "sent",
        "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07": "read"
    },
    "sender": {
      "id": "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
      "url": "https://api.layer.com/identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
      "user_id": "bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
      "display_name": "User A",
      "avatar_url": "https://mydomain.com/images/bcd5e1d8-d276-4b60-97fd-d4bb18308b07.gif"
    },
    "sent_at": "2016-01-10T13:31:04.393Z",
    "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/users/bcd5e1d8-d276-4b60-97fd-d4bb18308b07/messages/cf131537-a92b-46d7-a2b5-a89f94c707c5"
}
```

## Retrieve One Message (System Perspective)

Use the following endpoint to request a single message from a conversation from the System's perspective:

```request
GET /apps/:app_uuid/conversations/:conversation_uuid/messages/:message_uuid
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_ID/messages/MESSAGE_ID
```

### Successful Response `200 (OK)`

```json
{
    "conversation": {
        "id": "layer:///conversations/051f1ca7-5760-47a5-bf73-048a747fee44",
        "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/conversations/051f1ca7-5760-47a5-bf73-048a747fee44"
    },
    "id": "layer:///messages/cf131537-a92b-46d7-a2b5-a89f94c707c5",
    "is_unread": null,
    "parts": [
        {
            "body": "Hello!",
            "mime_type": "text/plain"
        }
    ],
    "received_at": null,
    "recipient_status": null,
    "sender": {
      "id": "layer:///identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
      "url": "https://api.layer.com/identities/bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
      "user_id": "bcd5e1d8-d276-4b60-97fd-d4bb18308b07",
      "display_name": "User A",
      "avatar_url": "https://mydomain.com/images/bcd5e1d8-d276-4b60-97fd-d4bb18308b07.gif"
    },
    "sent_at": "2016-01-10T13:31:04.393Z",
    "url": "https://api.layer.com/apps/58330abe-b79e-11e5-b0dd-f4bc00000775/conversations/051f1ca7-5760-47a5-bf73-048a747fee44/messages/cf131537-a92b-46d7-a2b5-a89f94c707c5"
}
```
