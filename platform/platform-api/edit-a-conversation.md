# Editing Conversations

A Conversation can be edited by changing its properties.  Properties are changed using PATCH operations as described in the [Layer Patch](https://github.com/layerhq/layer-patch) Format.

```request
PATCH /apps/:app_uuid/conversations/:conversation_uuid
```

### Required Headers

```text
Content-Type: application/vnd.layer-patch+json
```

### Successful Response

```text
204 (No Content)
```

## Adding &amp; Removing Participants

Add or remove participants using Layer Patch Operations using the values shown below:

| Name    |  Type | Description |
|---------|-------|-------------|
| **operation** | string | Type of operation to perform (add, remove or set) |
| **property**  | string | Use the value `participants` to change the participants. |
| **value**     | string or array | User ID to add or remove.  Or an array of users for the `set` operation. |


### Example Request: Adding Participants

```json
[
    {"operation": "add", "property": "participants", "value": "user1"},
    {"operation": "add", "property": "participants", "value": "user2"}
]
```

Note that if the user is already a participant, this is a no-op.

### Example Request: Removing Participants

```json
[
    {"operation": "remove", "property": "participants", "value": "user1"},
    {"operation": "remove", "property": "participants", "value": "user2"}
]
```

Note that if the user is not a participant, this is a no-op.

### Example Request: Replacing Participants

```json
[
    {"operation": "set", "property": "participants", "value": ["user1", "user2", "user3"]}
]
```

This will replace the entire set of participants with a new list. Be warned however that if users are actively adding/removing participants, doing a `set` operation will destroy any changes they are making.

```console
curl  -X PATCH \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/vnd.layer-patch+json' \
      -d '[{"operation": "add",    "property": "participants", "value": "a"}, {"operation": "remove", "property": "participants", "value": "b"}]' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID
```

## Set &amp; Delete Metadata
Set or delete metadata properties using [Layer Patch](https://github.com/layerhq/layer-patch#the-operations-array) Operations using the values shown below:

| Name    |  Type | Description |
|---------|-------|-------------|
| **operation** | string | Type of operation to perform (set or delete) |
| **property**  | string | A path to a property within metadata using dot separators (e.g. `metadata.title` or `metadata.a.b.c`). |
| **value**     | string or object | Only strings and objects are supported for metadata values. |


### Example Request: Set Metadata
```json
[
    {"operation": "set", "property": "metadata.stats.counter", "value": "10"},
    {"operation": "set", "property": "metadata.admin",
        "value": {
            "user_id": "fred",
            "hours": {
                "start": "9",
                "end": "5"
            }
        }
    }
]
```

Will result in the following new metadata value:
```json
{
    "metadata": {
        "stats": {
            "counter": "10"
        },
        "admin": {
            "user_id": "fred",
            "hours": {
                "start": "9",
                "end": "5"
            }
        }
    }
}
```

```console
curl  -X PATCH \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/vnd.layer-patch+json' \
      -d '[{"operation": "set",    "property": "metadata.stats.counter", "value": "10"}, {"operation": "delete", "property": "metadata.admin"}]' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID
```

> Metadata values can ONLY be strings and objects.  Arrays, numbers, booleans, etc... are not supported.  You can pass these as strings and parse them into the desired type on the receiving client.
