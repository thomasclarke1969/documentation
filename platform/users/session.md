# Managing Sessions

Successful Layer authentication results in a session that expires after a period of time.  In certain scenarios, you may need to force a user's session(s) to expire immediately.  You may also want to control the default session TTL (time to live) for your application.  This can come in handy when testing your authentication implementation.

## Configuring Session TTL

```request
PATCH /apps/:app_id
```

### Parameters

| Name       |  Type | Description  |
|------------|-------|--------------|
| _Unnamed_  | array | List of `operation`s to perform |

Where each `operation` object has the following properties:

| Name       |  Type | Description  |
|------------|-------|--------------|
| **operation** | string | The operation to perform. In this case, always `"set"`. |
| **property** | string | The property to update. In this case, always `"session_ttl_in_seconds"`. |
| **value** | integer | The value to set, in seconds. Acceptable range: 30 to 31536000 (1 year). |

### Example Request

```json
[ { "operation":"set", "property": "session_ttl_in_seconds", "value": 3600 } ]
```

### Response `202 (Accepted)`

```console
curl  -X PATCH \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/vnd.layer-patch+json' \
      -d '[ { "operation":"set", "property": "session_ttl_in_seconds", "value": 3600 } ]' \
      https://api.layer.com/apps/APP_UUID
```

## Deleting a User's Sessions

```request
DELETE /apps/:app_id/users/:user_id/sessions
```

### Response `(204 No Content)`

```console
curl  -X DELETE \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID/sessions
```

```emphasis
This will delete all of the user's sessions, on both mobile SDK and web.
```
