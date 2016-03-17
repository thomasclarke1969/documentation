# Managing Identity

The Layer Platform API associates an Identity object with each user.  This Identity allows you to associate detailed information with each user, and have that data delivered to clients so they can render Messages and Conversations containing those users.

Having Identity data depends upon it being correctly entered into Layer's servers.  A simple Identity object consisting of a `display_name` and `avatar_url` can be registered via an Identity Token.  But the Platform API exposes the means of registering and updating detailed Identity data to be delivered at appropriate times to the Clients.

## The Identity Object

All fields below are optional and may be blank, with the exception of `display_name` which is required by _some_ APIs.

| Name              | Type   |  Length | Description  |
|-------------------|--------|---------|--------------|
| **display_name**  | String | 128      | The name to render when displaying this user |
| **avatar_url**    | String | 1024    | A URL to an image |
| **first_name**    | String | 128      | The user's first name |
| **last_name**     | String | 128      | The user's last name |
| **phone_number**  | String | 32      | The user's phone number.  Typically usage expects this be a cellphone number for use with SMS services, but actual usage depends upon the application. |
| **email_address** | String | 255     | The user's email address |
| **public_key**    | String |         | Public encryption key
| **metadata**      | Object | 16 keys | A set of name value pairs. Values must be strings.  A maximum of 16 name value pairs allowed.  Unlike Conversation metadata, subobjects are not supported. |

## Create an Identity

Register an Identity with Layer's servers.  One might do this after a user signs up with your service.  The `display_name` field is required in all `POST` requests.

```request
POST /apps/:app_uuid/users/:user_id/identity
```

### Example Request

```json
{
    "display_name": "Frodo the Dodo",
    "avatar_url": "http://sillylordoftheringspictures.com/frodo-riding-a-dodo.png",
    "first_name": "Frodo",
    "last_name": "Baggins",
    "phone_number": "13791379137",
    "email_address": "frodo@sillylordoftheringspictures.com",
    "metadata": {
        "level": "35",
        "race": "Dodo"
    }
}
```

### Successful Response

```text
201 (Created)
```

Response body will be empty.

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "Frodo the Dodo", "first_name": "Frodo"}' \
      https://api.layer.com/apps/APP_UUID/useres/USER_ID/identity
```

## Update an Identity

An Identity can be updated by changing its properties.  Properties are changed using PATCH operations as described in the [Layer Patch](https://github.com/layerhq/layer-patch) Format.

```request
PATCH /apps/:app_uuid/users/:user_id/identity
```

### Example Request


```json
[
  {"operation": "set", "property": "last_name", "value": "Dodo"},
  {"operation": "set", "property": "phone_number", "value": ""},
  {"operation": "set", "property": "metadata.level", "value": "2"}
]
```

### Successful Response

```text
204 (No Content)
```

```console
curl  -X PATCH \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/vnd.layer-patch+json' \
      -d '[{"operation": "set", "property": "last_name", "value": "Dodo"}]' \
      https://api.layer.com/apps/APP_UUID/useres/USER_ID/identity
```

## Replace an Identity

An Identity can be also be edited by replacing its properties.  The `display_name` field is required in all `PUT` requests.

```request
PUT /apps/:app_uuid/users/:user_id/identity
```

### Example Request

```json
{
    "display_name": "Frodo the Dodo",
    "avatar_url": "http://sillylordoftheringspictures.com/frodo-riding-a-dodo.png",
    "first_name": "Frodo",
    "last_name": "Baggins",
    "phone_number": "13791379137",
    "email_address": "frodo@sillylordoftheringspictures.com",
    "metadata": {
        "level": "35",
        "race": "Dodo"
    }
}
```

### Successful Response

```text
204 (No Content)
```

```console
curl  -X PUT \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "Frodo the Dodo", "first_name": "Frodo"}' \
      https://api.layer.com/apps/APP_UUID/useres/USER_ID/identity
```

## Retrieve an Identity

An Identity can be downloaded from layer's servers.  While in most cases its expected that each company has a more detailed and accurate version of a user's identity, there may be cases where getting Layer's version of the Identity is useful. For example, if building a product that works with layer and is for use with various customer's applications, using a common User Model may be helpful.

```request
GET https://api.layer.com/apps/:app_uuid/users/:user_id/identity
```

### Successful Response

```text
200 (OK)
```
```json
{
    "display_name": "Frodo the Dodo",
    "avatar_url": "http://sillylordoftheringspictures.com/frodo-riding-a-dodo.png",
    "first_name": "Frodo",
    "last_name": "Baggins",
    "phone_number": "13791379137",
    "email_address": "frodo@sillylordoftheringspictures.com",
    "metadata": {
        "level": "35",
        "race": "Dodo"
    }
}
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/useres/USER_ID/identity
```

## Delete an Identity

Delete an Identity from Layer's servers.  One might do this after a user leaves your service.

```request
DELETE /apps/:app_uuid/users/:user_id/identity
```

### Successful Response

```text
204 (No Content)
```

```console
curl  -X DELETE \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/useres/USER_ID/identity
```
