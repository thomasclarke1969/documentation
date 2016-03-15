# Retrieving Conversations

Depending on the use case, Conversations can be retrieved using either a System perspective or a User perspective.  A User perspective differs from the System in the following ways:

* User Perspective Conversation has a `last_message` property
* User Perspective Conversation has an `unread_message_count` property
* System Perspective can still retrieve a Conversation that the user has been removed from.

## Retrieve Conversations (User Perspective)

Use the following endpoint to request all conversations for a specific user:

```request
GET /apps/:app_uuid/users/:user_id/conversations
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations
```

### Pagination

All requests that list resources support the pagination API, which includes:

#### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default and maximum value of 100. |
| **from_id** | string | Get the Conversations after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///conversations/uuid` or as just a UUID |

#### Headers

All List Resource requests will return a header indicating the total number of results
to page through.

```text
Layer-Count: 4023
```

Pagination Example:

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations?page_size=50&from_id=layer:///conversations/UUID
```

### Sorting Conversations

The default sort is by Conversation `created_at`.  This is done because this is a fixed ordering, and means that paging can be done without Conversations moving around while paging.  This means developers do not need to worry about missed Conversations and changes in ordering of already loaded results.

Many developers however need to see recently active Conversations, so a parameter has been added to this request:

| Name    |  Type  | Description |
|---------|--------|-------------|
| sort_by | string | Either *created_at* to sort by Conversation created date (descending order) or *last_message* to sort by most recently sent last message (descending order) |

Sorting example:

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations?sort_by=last_message&page_size=50&from_id=layer:///conversations/UUID
```

Expected results for sorting by last message are as follows:

1. Results are in descending order; most recently active Conversation comes first
2. A Conversation that does not have a last message is sorted using its `created_at` value instead.  This means that a Conversation without any messages can still be sorted ahead of a Conversation whose last message is old.

```emphasis
Paging through results when sorting by `last_message` leaves your application open to missing some Conversations and getting other Conversations multiple times as the results may shift around due to user activity.
```

## Retrieve One Conversation (User Perspective)

Use the following endpoint to request a specific Conversation for a user:

```request
GET /apps/:app_uuid/users/:user_id/conversations/:conversation_uuid
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/conversations/CONVERSATION_UUID
```

### Successful Response `200 (OK)`

```json
{
    "id": "layer:///conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10",
    "url": "https://api.layer.com/apps/1ab339a8-adb6-11e5-ad04-192ee3134c94/users/1234567/conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10",
    "messages_url": "https://api.layer.com/apps/1ab339a8-adb6-11e5-ad04-192ee3134c94/users/1234567/conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10/messages",
    "created_at": "2015-12-28T22:59:57.433Z",
    "participants": [
        "2222222",
        "1234567"
    ],
    "metadata": {
        "background_color": "#3c3c3c"
    },
    "distinct": true,
    "last_message": {
        "id": "layer:///messages/62a1469c-4257-4515-a3e9-3f816dd0e3c5",
        "position": 5494669312,
        "conversation": {
            "id": "layer:///conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10",
            "url": "https://api.layer.com/apps/1ab339a8-adb6-11e5-ad04-192ee3134c94/users/1234567/conversations/90a3dd7e-59f2-4369-a522-a3e4f767af10"
        },
        "parts": [
            {
                "id": "layer:///messages/62a1469c-4257-4515-a3e9-3f816dd0e3c5/parts/0",
                "mime_type": "text/plain",
                "body": "hello"
            }
        ],
        "sent_at": "2015-12-28T23:07:51.112Z",
        "received_at": "2015-12-28T23:07:51.123Z",
        "sender": {
            "user_id": "1234567"
        },
        "is_unread": false,
        "recipient_status": {
            "2222222": "sent",
            "1234567": "read"
        }
    },
    "unread_message_count": 0
}
```

## Retrieve One Conversation (System Perspective)

You can request the System Perspective of the Conversation by using the following endpoint:

```request
GET /apps/:app_uuid/conversations/:conversation_uuid
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID
```

### Successful Response `200 (OK)`

```json
{
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "messages_url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/messages",
    "created_at": "2014-09-15T04:44:47+00:00",
    "participants": [
        "1234",
        "5678"
    ],
    "distinct": false,
    "metadata": {
        "background_color": "#3c3c3c"
    }
}
```

### Unsuccessful Response `404`

If you try to retrieve a conversation that doesn't exist you'll get a `404` response code.

### Successful Response `410 (GONE)`

If you try to retrieve a conversation that has been deleted you'll get a `410` response code.
