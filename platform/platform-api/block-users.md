# Managing User Block Lists

The Layer Platform API allows you to manage the Layer Block List in order to align with your own application level blocking. A Block List is maintained for each user, enabling users to manage a list of members they don't want to communicate with. [More information](https://support.layer.com/hc/en-us/articles/204050814-What-happens-when-I-apply-a-Block-policy).

* `owner_user_id` The owner of the Block List
* `user_id`  A user that is being blocked from communicating with the `owner_user_id`

#### Modify the Block List for a User

Supports bulk operations for updating the Block List for `user_id`. Requires `Content-Type: application/vnd.layer-patch.json`.

```request
PATCH https://api.layer.com/apps/:app_id/users/:user_id
```

### Parameters

| Name       |  Type | Description  |
|------------|-------|--------------|
| _Unnamed_  | array | List of `operation`s to perform |

Where each `operation` object has the following properties:

| Name       |  Type | Description  |
|------------|-------|--------------|
| **operation** | string | The operation to perform |
| **property** | string | The user property to update, "blocks" |
| **value** | string | The value to set for the property |

For example:
```json
[
    {"operation": "add", "property": "blocks", "value": "blockMe1"},
    {"operation": "add", "property": "blocks", "value": "blockMe2"},
    {"operation": "remove", "property": "blocks", "value": "unblockMe"}
]
```

### Response `202 (Accepted)`

There is no limit to the number of patch operations, enabling clients to perform bulk manipulation of block lists. The reason we use `202 (Accepted)` here as opposed to `204 (No Content)` is because the updates are not guaranteed to have been applied when the request completes. Whether it's one or 10,000 operations, they're enqueued and processed asynchronously.

Note that `"set"` is also a supported operation.  When `"blocks"` is `"set"`, it _replaces_ the full Block List for the given User.  For example:

```json
[
    {"operation": "set", "property": "blocks", "value": ["blockMe1", "blockMe2"]}
]
```
or to clear the list:

```json
[
    {"operation": "set", "property": "blocks", "value": []}
]
```

## Retrieving the Block List for a User

Returns an array of all blocked users for the specified `owner_user_id`.

```request
GET /apps/:app_uuid/users/:owner_user_id/blocks
```

### Response `200 (OK)`

```json
[
  {"user_id": "abc1234"},
  {"user_id": "def5678"}
]
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/a/blocks
```

## Blocking Users

Adds a new blocked user to the Block List for the specified `owner_user_id`.

```request
POST /apps/:app_uuid/users/:owner_user_id/blocks
```

### Parameters

| Name       |  Type | Description  |
|------------|-------|--------------|
| **user_id**  | string | The User ID of a user to add to Block List |

### Example Request: Block a User

```json
{
  "user_id": "blockme987"
}
```

### Response

```text
204 (No Content)
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"user_id": "b"}' \
      https://api.layer.com/apps/APP_UUID/users/a/blocks
```

## Unblocking Users

Removes a blocked user from the Block List of the specified `owner_user_id`.

```request
DELETE /apps/:app_uuid/users/:owner_user_id/blocks/:user_id
```

### Response

```text
204 (No Content)
```

```console
curl  -X DELETE \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/a/blocks/b
```

> User IDs embedded in the URLs above must be URL-encoded if there's any chance they may contain URL-unsafe characters such as `/`, `+`, `%`, or `?`.

> For example, if your user ID is `namespace/12345`, the URL would need to be `/apps/:app_uuid/users/namespace%2F12345/blocks`.
