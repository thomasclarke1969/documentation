# Retrieving All Followed Identities

While many applications will just use the `display_name` and `avatar_url` that comes with each Message to display the sender of the Message, some may need additional information when rendering users.  To accomplish this, and to minimize the amount of on-demand fetching of users, your application can load the full Identity objects for all of the user's the current user is following.  The set of followed identities is all users this user has ever had a conversation with plus anyone this user has explicitly followed.

You can list Identities followed by your user using:

```request
GET /identities
```

This will return an array of Identities ordered by creation time in descending order.

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/identities
```

### Response `200 (OK)`

```text
[<Identity>, <Identity>]
```

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default is 500. |
| **from_id** | string | Get the Identities after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///identities/user_id` or as just a `user_id` |

### Headers

All List Resource requests will return a header indicating the total number of results
to page through.

```text
Layer-Count: 4023
```

Pagination example:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/identities?page_size=250&from_id=layer:///identities/frodo_the_dodo
```

# Retreiving all Followed Users

If you just need the Layer Identity ID of every user followed by this user (commonly used prior to adding/removing follows), you can get the list using:


```request
GET /following
```

This will return an array of user_ids (i.e. not the full Identity object).  Note that the results include all users this user has ever had a conversation with plus anyone this user has explicitly followed.

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/following
```

### Response `200 (OK)`

```text
["layer:///identities/1234", "layer:///identities/5678", "layer:///identities/9abc", "layer:///identities/defg"]
```

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default is 500. |
| **from_id** | string | Get the followed User IDs after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///identities/user_id` or as just a `user_id` |

### Headers

All List Resource requests will return a header indicating the total number of results
to page through.

```text
Layer-Count: 4023
```

Pagination example:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/following?page_size=250&from_id=layer:///identities/frodo_the_dodo
```

# Retrieve an Identity

You can get a single Identity of someone this user follows using:

```request
GET /identities/:user_id
```

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/identities/USER_ID
```

### Response `200 (OK)`

```json
{
  "id": "layer:///identities/frodo115",
  "url": "https://api.layer.com/identities/frodo115",
  "user_id": "frodo115",
  "display_name": "https://myserver.com/frodo115.gif",
  "first_name": "Frodo",
  "last_name": "The Dodo",
  "phone_number": "1-800-fro-dodo",
  "email_address": "frodo_the_dodo@myserver.com",
  "public_key": "<RSA Key>",
  "metadata": {
    "your-key": "your-value"
  }
}
```

# Get a Follows

This operation can be used to quickly test if the authenticated user is following the specified user:

```request
GET /following/users/:user_id
```


```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/following/users/USER_ID
```

### Response `204 (No Content)`

The specified user_id is followed by this user.

### Response `404 (Not Found)`

The specified user_id is **not** followed by this user.

```json
{
  "id": "not_found",
  "code": 102,
  "message": "A user identity with the specified identifier could not be found.",
  "url": "https://developer.layer.com/docs/client/rest#not_found"
}
```

# Follow a User

A user can be explicitly followed by the authenticated user using:

```request
PUT /following/users/:user_id
```

```console
curl  -X PUT \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/following/users/USER_ID
```

### Response `204 (No Content)`

The specified user_id is now followed by this user.

# Follow a set of Users

If following multiple new users, they can be added to the current set of followed users using:

```request
POST /following/users
```

```console
curl  -X POST \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/following/users -d '["1234", "5678", "90ab"]'
```

### Response `202 (Accepted)`

The system will generate the requested new follows.


# Unfollow a User

A user can be explicitly removed as from the list of followed users using:

```request
DELETE /following/:user_id
```

Note that after unfollowing a user they may be implicitly refollowed if they join another Conversation together.

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/following/USER_ID
```

### Response `204 (No Content)`

The specified user_id is no longer followed by this user.
