# Retrieving All Conversations

You can List Conversations using:

```request
GET /conversations/
```

This will return an array of Conversations ordered by its `created_at` field in descending order.

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/conversations
```

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default and maximum value of 100. |
| **from_id** | string | Get the Conversations after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///conversations/uuid` or as just a UUID |

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
      https://api.layer.com/conversations?page_size=50&from_id=layer:///conversations/UUID
```

### Response `200 (OK)`

```text
[<Conversation>, <Conversation>]
```

```emphasis
Note, Conversations that you were formerly a participant of will be listed by this request. You will only see messages and metadata up to the point where you stopped being a participant. The participants property will be [] if you are no longer a participant.
```

## Sorting Conversations

The default sort is by Conversation `created_at`.  This is done because this is a fixed ordering, and means that paging can be done without Conversations moving around while paging.  This means developers do not need to worry about missed Conversations and changes in ordering of already loaded results.

Many developers however need to see recently active Conversations, so a parameter has been added to this request:

| Name    |  Type  | Description |
|---------|--------|-------------|
| sort_by | string | Either *created_at* to sort by Conversation created date (descending order) or *last_message* to sort by most recently sent last message (descending order) |

Sorting example:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/conversations?sort_by=last_message&page_size=50&from_id=layer:///conversations/UUID
```

Any developer who sorts using the `last_message` value is responsible for understanding that results can change while paging.  The following recommendations should be followed in using this ordering:

1. Any Conversation for which a Message Creation Websocket Event is received is now the most recent Conversation:
      1. If the Conversation is already loaded and the app needs a correct order, Move the Conversation to the top of the list.
      2. If the Conversation is not yet loaded, it should be loaded using `GET /conversations/UUID` and inserted at the top of the list.
2. Alternatively, if an application needs to always maintain a correctly sorted list, the application can listen for all Conversation Patch websocket event that changes the Conversation's `last_message` property
      1. If the Conversation isn't yet loaded, load it.
      2. The `last_message` may have changed due to a new message being sent or the prior Last Message being deleted, so it must be sorted into the list rather than inserted at the top.

# Retrieving a Conversation

You can get a single Conversation using:

```request
GET /conversations/:conversation_uuid
```

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/conversations/CONVERSATION_UUID
```

### Response `200 (OK)`

```json
{
  "id": "layer:///conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "messages_url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c/messages",
  "created_at": "2015-10-10T22:51:12.010Z",
  "last_message": null,
  "participants": [ "1234", "5678" ],
  "distinct": false,
  "unread_message_count": 0,
  "metadata": {
    "background_color": "#3c3c3c"
  }
}
```

# Creating a Conversation

You can create Conversations using:

```request
POST /conversations
```

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **participants** | string[]  | Array of User IDs (strings) identifying who will participate in the Conversation |
| **distinct** | boolean | Create or find a Distinct Conversation with these participants |
| **metadata** | object | Arbitrary set of name value pairs representing initial state of Conversation metadata |

### Example
```json
{
  "participants": [ "1234", "5678" ],
  "distinct": false,
  "metadata": {
    "background_color": "#3c3c3c"
  }
}
```

```console
curl  -X POST \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/json" \
      -d '{"participants": ["1234", "5678"], "distinct": false, "metadata": {"background_color": "#3c3c3c"}}' \
      https://api.layer.com/conversations
```

### Response `201 (Created)`
```json
{
  "id": "layer:///conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "messages_url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c/messages",
  "created_at": "2015-10-10T22:51:12.010Z",
  "last_message": null,
  "participants": [ "1234", "5678" ],
  "distinct": false,
  "unread_message_count": 0,
  "metadata": {
    "background_color": "#3c3c3c"
  }
}
```

## Distinct Conversations

Distinct Conversations are defined in [The Conversation Object](introduction#conversation).  When creating a Distinct Conversation, there are three possible results:

### Response `201 (Created)`

If there is no existing Distinct Conversation that matches the request, then a new Conversation is created and returned.

```json
{
  "id": "layer:///conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "messages_url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c/messages",
  "created_at": "2015-10-10T22:51:12.010Z",
  "last_message": null,
  "participants": [ "1234", "5678" ],
  "distinct": false,
  "unread_message_count": 0,
  "metadata": {
    "background_color": "#3c3c3c"
  }
}
```

### Response `200 (OK)`

If there is a matching Distinct Conversation, and one of these  holds true, then an existing Conversation is returned.

1. The `metadata` property was not included in the request
2. The `metadata` property was included but with a value of `null`
3. The `metadata` property value is identical to the `metadata` of the matching Distinct Conversation

```json
{
  "id": "layer:///conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c",
  "messages_url": "https://api.layer.com/conversations/74a676c4-f697-45c4-b3bc-3e48bd2e372c/messages",
  "created_at": "2015-10-10T22:51:12.010Z",
  "last_message": null,
  "participants": [ "1234", "5678" ],
  "distinct": false,
  "unread_message_count": 0,
  "metadata": {
    "background_color": "#3c3c3c"
  }
}
```

### Response `409 (Conflict)`

If the matching Distinct Conversation has metadata different from what was requested, return an error that contains the matching Conversation so that the application can determine what steps to take next (e.g. use the Conversation or modify it using PATCH requests).

```json
{
  "id": "resource_conflict",
  "code": 108,
  "message": "The requested Distinct Conversation was found but had metadata that did not match your request.",
  "url": "https://developer.layer.com/api.md#creating-a-conversation",
  "data": {
    "id": "layer:///conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "url": "https://api.layer.com/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67",
    "created_at": "2014-09-15T04:44:47+00:00",
    "participants": [ "1234", "5678" ],
    "distinct": true,
    "metadata": {
      "background_color": "#3c3c3c"
    }
  }
}
```

## Timing of Conversation Creation Calls

There is a timing issue that some developers will encounter using this operation. Everything here applies to both Messages and Conversations; Messages are used in the example below. The desired behavior:

1. Create a local representation of the Message
2. Fire an xhr call to the server to create the Message on the server
3. Get the response and assign the id provided by the server to your Message.
4. Get a WebSocket event notifying you that a new Message was created; your code detects that you already know about the object because its ID matches the one you just created; you ignore the event.

The actual timing ends up being something like this:

1. Create a local representation of the Message
2. Fire an xhr call to the server to create the Message on the server
3. Get a websocket event notifying you that a new Message was created; there is no information to clearly associate this information with the xhr request you just made, so you add a new Message to your Conversation. You now have two copies of your Message, one with an ID, the other waiting for the ID. Both of them are presumably rendered in your View.
4. Get the response and assign the id provided by the server to your object; you now need to destroy one of your two Messages.

To avoid this issue, developers can create Messages and Conversations using [The Websocket API](websocket#create-requests) which supports the desired behavior.

# Destroying a Conversation

Conversations will sometimes need to be deleted, and this can be done using a REST `delete` method called on the URL for the resource to be deleted.

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **destroy** | boolean  | True to delete it from the server; false to remove it only from this account. |

When deleting resources with the Layer API you have the option of destroying the resource, or only deleting it from the current account.

* **delete** (`destroy=false`): The content is deleted from all of the clients associated with the authenticated user.
* **destroy** (`destroy=true`): The content is deleted from all of the clients of all users with access to it.

```emphasis
Note, delete is not supported at this time, so `destroy=true` is the only accepted way to do deletion at this time.
```

You can destroy a Conversation using:

```request
DELETE /conversations/:conversation_uuid?destroy=true
```

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/json" \
      https://api.layer.com/conversations/CONVERSATION_UUID?destroy=true
```

### Response `204 (No Content)`

The standard successful response is a `204 (No Content)`.  Note that it may take time to propagate to all devices, during which time other users/devices may attempt to send messages on this Conversation.

### Response `404 (Not Found)`

```json
{
  "id": "not_found",
  "code": 102,
  "message": "A Conversation with the specified identifier could not be found.",
  "url": "https://developer.layer.com/api.md#conversations"
}
```

The specified Conversation may have already been deleted or never existed.

### Response `403 (Forbidden)`

```json
{
  "id": "access_denied",
  "code": 101,
  "message": "You are no longer a participant in the specified Conversation.",
  "url": "https://developer.layer.com/api.md#conversations"
}
```

The user is not currently a participant with permission to delete the Conversation.

Note that if the user was never a participant in the Conversation, then the user will instead get the `not_found` error.

## Layer-Patch

Messages and Conversations typically respond to a PATCH request to modify the object.  There are only a few properties currently exposed to be modified via a PATCH request:

* Conversation.participants
* Conversation.metadata

Patch requests are performed using the [Layer-Patch](https://github.com/layerhq/layer-patch) format.  Typical requests consist of an array of operations, containing the following properties:

| Name    |  Type | Description |
|---------|-------|-------------|
| **operation** | string | The type of operation to perform (`add`, `remove`, `set` or `delete`). |
| **property**  | string | The property to change; "." separated if its an embedded property. |
| **value**     | string or object | Value to add, remove or set. |

All Layer-Patch requests require a Content-Type in the header of:

```text
Content-Type: application/vnd.layer-patch+json
```

# Adding/Removing Participants

You can add and remove participants in a Conversation.

#### Example Add Participants

```json
[
  {"operation": "add", "property": "participants", "value": "user1"},
  {"operation": "add", "property": "participants", "value": "user2"}
]
```

```console
curl  -X PATCH \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/vnd.layer-patch+json" \
      -d '[{"operation": "add", "property": "participants", "value": "user1"}, {"operation": "add", "property": "participants", "value": "user2"}]' \
      https://api.layer.com/conversations/CONVERSATION_UUID
```

#### Response `204 (No Content)`

The standard response for any PATCH operation is `204 (No Content)`.

#### Example Remove Participants

```json
[
  {"operation": "remove", "property": "participants", "value": "user1"},
  {"operation": "remove", "property": "participants", "value": "user2"}
]
```

```console
curl  -X PATCH \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/vnd.layer-patch+json" \
      -d '[{"operation": "remove", "property": "participants", "value": "user1"}, {"operation": "remove", "property": "participants", "value": "user2"}]' \
      https://api.layer.com/conversations/CONVERSATION_UUID
```

#### Example of Replacing Participants

```json
[
  {"operation": "set", "property": "participants", "value": ["user1", "user2", "user3"]}
]
```

This will replace the entire set of participants with a new list. Be warned however that if other users are actively adding/removing participants, doing a `set` operation will destroy any changes they are making.

```console
curl  -X PATCH \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/vnd.layer-patch+json" \
      -d '[{"operation": "remove", "property": "participants", "value": ["user1", "user2", "user3"]}]' \
      https://api.layer.com/conversations/CONVERSATION_UUID
```

# Updating Conversation Metadata

You can set and delete metadata keys in a Conversation.

### Example Set a Metadata Property

```json
[
  { "operation": "set", "path": "metadata.a.b.count", "value": "42" },
  { "operation": "set", "path": "metadata.a.b.word_of_the_day", "value": "Argh" }
]
```

This operation will create or set the `count` and `word_of_the_day` properties of `b` to "42" and "Argh", creating any structures needed to accomplish that (creating the object `a` and `b` if they don't exist):

```json
{
  "metadata": {
    "a": {
      "b": {
        "count": "42",
        "word_of_the_day": "Argh"
      }
    }
  }
}
```

```console
curl  -X PATCH \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/vnd.layer-patch+json" \
      -d '[{ "operation": "set", "path": "metadata.a.b.count", "value": "42" }, { "operation": "set", "path": "metadata.a.b.word_of_the_day", "value": "Argh" }]' \
      https://api.layer.com/conversations/CONVERSATION_UUID
```

Recall that only string values are allowed in metadata, so 42 must be passed as a string rather than a number.  For more information on `metadata` see the [Concepts Section](introduction#concepts).

### Example of Set All Metadata

Note that the entire metadata structure can be replaced using:

```json
[
  {
    "operation": "set",
    "path": "metadata",
    "value": {
        "a": "b",
        "c": {
          "d": "e"
        }
      }
   }
]
```

Note that this behavior could result in conflicts if other users are changing metadata, so is best avoided.
