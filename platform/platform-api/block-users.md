# User Block List Management
The Layer Platform API allows you to manage the Layer Block List in order to align with your own application level blocking. A Block List is maintained for each user, enabling users to manage a list of members they don't want to communicate with. [More information](https://support.layer.com/hc/en-us/articles/204050814-What-happens-when-I-apply-a-Block-policy).

* `owner_user_id` The owner of the Block List
* `user_id`  A user that is being blocked from communicating with the `owner_user_id`

## Get the Block List for a User
Returns an array of all blocked users for the specified `owner_user_id`.

```request
GET /apps/:app_uuid/users/:owner_user_id/blocks
```

### Response `200 (Ok)`
```json
[
  {"user_id": "abc1234"},
  {"user_id": "def5678"}
]
```

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Bearer TOKEN" \
      -H "Content-Type: application/json" \
      https://api.layer.com/apps/APP_UUID/users/a/blocks
```

## Add to the Block List for a User
Adds a new blocked user to the Block List for the specified `owner_user_id`.

```request
POST /apps/:app_uuid/users/:owner_user_id/blocks
```

### Parameters
| Name       |  Type | Description  |
|------------|-------|--------------|
| `user_id`  | string | The User ID of a user to add to Block List |

### Example
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
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Bearer TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"user_id": "b"}' \
      https://api.layer.com/apps/APP_UUID/users/a/blocks
```

## Remove from the Block List for a User
Removes a blocked user from the Block List of the specified `owner_user_id`.

```request
DELETE /apps/:app_uuid:/users/:owner_user_id/blocks/:user_id
```

### Response
```text
204 (No Content)
```

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Bearer TOKEN" \
      -H "Content-Type: application/json" \
      https://api.layer.com/apps/APP_UUID/users/a/blocks/b
```

> User IDs embedded in the URLs above must be URL-encoded if there's any chance they may contain URL-unsafe characters such as `/`, `+`, `%`, or `?`.

> For example, if your user ID is `namespace/12345`, the URL would need to be `/apps/:app_uuid/users/namespace%2F12345/blocks`.

