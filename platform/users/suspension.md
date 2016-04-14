# Suspending Access

Layer supports the suspension of users to temporarily or permanently prevent a user with a given
identifier from authenticating or resuming an authenticated session. The feature works by clearing
all session tokens for the target user and refusing to create new sessions upon successful authentication.

Please note that suspension changes do not take effect immediately due to caching. Please allow up to 5 minutes for changes to take effect.

## Suspending a User

```request
PATCH /apps/:app_id/users/:user_id
```

### Parameters

| Name       |  Type | Description  |
|------------|-------|--------------|
| _Unnamed_  | array | List of `operation`s to perform |

Where each `operation` object has the following properties:

| Name       |  Type | Description  |
|------------|-------|--------------|
| **operation** | string | The operation to perform. For suspension, always `"set"`. |
| **property** | string | The property to update. For suspension, always `"suspended"`. |
| **value** | string | The value to set. To suspend, always `true`. |

### Example Request

```json
[ { "operation":"set", "property": "suspended", "value": true } ]
```

### Response `202 (Accepted)`

```console
curl  -X PUT \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '[ { "operation":"set", "property": "suspended", "value": true } ]' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID
```

## Unsuspending a User

```request
PATCH /apps/:app_id/users/:user_id
```

### Parameters

| Name       |  Type | Description  |
|------------|-------|--------------|
| _Unnamed_  | array | List of `operation`s to perform |

Where each `operation` object has the following properties:

| Name       |  Type | Description  |
|------------|-------|--------------|
| **operation** | string | The operation to perform. For suspension, always `"set"`. |
| **property** | string | The property to update. For suspension, always `"suspended"`. |
| **value** | string | The value to set. To unsuspend, always `false`. |

### Example Request

```json
[ { "operation":"set", "property": "suspended", "value": false } ]
```

### Response `202 (Accepted)`

```console
curl  -X PUT \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '[ { "operation":"set", "property": "suspended", "value": false } ]' \
      https://api.layer.com/apps/APP_UUID/users/USER_ID
```

## Checking Suspension Status of a User

```request
GET /apps/:app_id/users/:user_id
```

### Response `(200 OK)`

```json
{
  "id": "blake",
  "identity": {
    "first_name": "Blake",
    "last_name": "Watters",
    "display_name": "blakewatters"
  },
  "suspended": false
}
```
