# Following Users

Users can retrieve a list of Identities that they follow.  This is typically useful for

* Creating User Lists in a UI for creating Conversations with those users
* Creating a richer UI with more information, and even `details` pages about each User.

If User A follows User B, then User A can get the Full Identity for User B, and User B will be included in User A's User Lists.

Typically, Following of users is implicit.  If User A and User B are in the same Conversation together, they implicitly follow each other, and will continue to follow each other even after the Conversation is deleted.

Example: Lets suppose we build an app for supporting groups of coworkers.  You'd want all coworkers to follow one another and be able to select one another to create a Conversation with them... even if they have never been in a Conversation together before (creating an Implicit Follows).

## Explicitly Following a User

To cause the `following_user_id` to follow the `followed_user_id`, use the following request:

```request
PUT https://api.layer.com/apps/:app_uuid/users/:following_user_id/following/:followed_user_id
```

Note that if `followed_user_id` does not exist, a User will be created with that User ID.

```console
curl  -X PUT \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/UserA/following/UserB
```

### Successful Response

```text
204 (No Content)
```

## Unfollow a User

To cause the `following_user_id` to unfollow the `followed_user_id`, use the following request:

```request
DELETE https://api.layer.com/apps/:app_uuid/users/:following_user_id/following/:followed_user_id
```

Note that after unfollowing a user they may be implicitly refollowed if they join another Conversation together.

```console
curl  -X DELETE \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/UserA/following/UserB
```

### Successful Response

```text
204 (No Content)
```

## Check if one user is following another

To perform a quick test to determine if User A follows User B, one can request:

```request
GET https://api.layer.com/apps/:app_uuid/users/:following_user_id/following/:user_id
```

### Successful Response

```text
204 (No Content)
```

User is found in the list of followed users.

### Unsuccessful Response

```text
404 (Not Found)
```

User is not found in the list of followed users.

## Batch Following Multiple Users

To perform an operation that follows multiple users at once:

```request
POST https://api.layer.com/apps/:app_uuid/users/:following_user_id/following
```
### Example Request

```json
["layer:///identities/UserA", "layer:///identities/UserB", "layer:///identities/UserC"]
```

### Successful Response

```text
202 (Accepted)
```

Response body will be empty.

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '["layer:///identities/UserA", "layer:///identities/UserB", "layer:///identities/UserC"]' \
      https://api.layer.com/apps/APP_UUID/users/UserA/following
```

## Retrieving the Follows List

There are two APIs for getting the list of followed users:

* Get a list of IDs; useful for quickly identifying who is/is not in the list
* Get a list of Identities; useful for seeing information about all of the followed users.

Both APIs follow a basic Pagination API:

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default is 500. |
| **from_id** | string | Get the Identities after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///identities/user_id` or as just a `user_id` |


### Retrieving the Followed ID List

```request
GET https://api.layer.com/apps/:app_uuid/users/:following_user_id/following
```

#### Successful Response

```text
200 (OK)
```

```json
["layer:///identities/UserA", "layer:///identities/UserB", "layer:///identities/UserC"]
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/UserA/following
```

### Retreive the Followed Identities List


```request
GET https://api.layer.com/apps/:app_uuid/users/:following_user_id/identities
```

#### Successful Response

```text
200 (OK)
```
```json
[
    {
        "id": "layer:///identities/a",
        "user_id": "a",
        "url": "https://api.layer.com/apps/:app_uuid/users/a/identity",
        "display_name": "User A",
        "avatar_url": "",
        "first_name": "",
        "last_name": "",
        "phone_number": "",
        "email_address": "",
        "metadata": null
    },
    {
        "id": "layer:///identities/b",
        "user_id": "b",
        "url": "https://api.layer.com/apps/:app_uuid/users/b/identity",
        "display_name": "User B",
        "avatar_url": "",
        "first_name": "",
        "last_name": "",
        "phone_number": "",
        "email_address": "",
        "metadata": null
    },
    {
        "id": "layer:///identities/c",
        "user_id": "c",
        "url": "https://api.layer.com/apps/:app_uuid/users/c/identity",
        "display_name": "User C",
        "avatar_url": "",
        "first_name": "",
        "last_name": "",
        "phone_number": "",
        "email_address": "",
        "metadata": null
    }
]
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=2.0' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/UserA/identities
```