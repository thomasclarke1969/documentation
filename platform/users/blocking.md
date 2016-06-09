# Managing User Block Lists

The Layer Platform API allows you to manage the Layer Block List in order to align with your own application level blocking. A Block List is maintained for each user, enabling users to manage a list of members they don't want to communicate with. [More information](https://support.layer.com/hc/en-us/articles/204050814-What-happens-when-I-apply-a-Block-policy).

* `owner_user_id` The owner of the Block List
* `user_id`  A user that is being blocked from communicating with the `owner_user_id`

#### Modify the Block List for a User

Supports bulk operations for updating the Block List for `user_id`. Requires `Content-Type: application/vnd.layer-patch.json`.

```request
PATCH /apps/:app_uuid/users/:user_id
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
| **id** | string | The Layer Identity ID of the user to block/unblock. |

For example:
```json
[
    {"operation": "add", "property": "blocks", "id": "layer:///identities/blockMe1"},
    {"operation": "add", "property": "blocks", "id": "layer:///identities/blockMe2"},
    {"operation": "remove", "property": "blocks", "id": "layer:///identities/unblockMe"}
]
```

### Response `202 (Accepted)`

There is no limit to the number of patch operations, enabling clients to perform bulk manipulation of block lists. The reason we use `202 (Accepted)` here as opposed to `204 (No Content)` is because the updates are not guaranteed to have been applied when the request completes. Whether it's one or 10,000 operations, they're enqueued and processed asynchronously.

Note that `"set"` is also a supported operation, but can only be used empty the block list. For example:

```json
[
    {"operation": "set", "property": "blocks", "value": []},
    {"operation": "add", "property": "blocks", "id": "layer:///identities/blockMe1"},
    {"operation": "add", "property": "blocks", "id": "layer:///identities/blockMe2"}
]
```

The above operations array clears the list, and then repopulates it with new Identities.

## Retrieving the Block List for a User

Returns an array of all blocked users for the specified `owner_user_id`.

```request
GET /apps/:app_uuid/users/:owner_user_id/blocks
```

### Response `200 (OK)`

```json
[
  {"id": "layer:///identities/abc1234", "user_id": "abc1234", "url": "https://api.layer.com/APP_ID/abc1234/identity", "display_name": "ABC", "avatar_url": ""},
  {"id": "layer:///identities/def5678", "user_id": "def5678", "url": "https://api.layer.com/APP_ID/def5678/identity", "display_name": "DEF", "avatar_url": ""}
]
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/a/blocks
```
