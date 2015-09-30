# Authentication

The Authentication process lets you explicitly allow a given user to communicate with other users in your App. A user is defined by their User ID, which can be any sort of unique identifier string, including ones that you are already using for user management (this could be a UUID, username, email address, phone number, etc).

To authenticate a user, you must set up your own Authentication Web Service where you can validate a user's credentials and create an Identity Token. That Identity Token is returned to your App, and then passed on to the Layer servers. If the Identity Token is valid, the Authentication process will complete, providing you with a Session Token to enable your REST API calls.  For more information on setting up an Authentication Web Service, see our [Authentication Guide](https://developer.layer.com/docs/android/guides#authentication).

The authentication sequence is

1. Request a nonce from the REST API
2. Provide the nonce to your Identity Server to get an Identity Token
3. Provide the Identity Token to the REST API to get a Session Token
4. Use the Session Token in all further requests

Note that while typically these 4 steps are all performed by a single client, it is also possible to perform some or all of these tasks on a server and provide a nonce, Identity Token or Session Token to your client.

## 1. Obtain a Nonce

The authentication process begins by requesting a nonce from the REST API. Once a nonce is obtained, the authenticating client has 10 minutes to complete the process and obtain a Session Token.

```request
POST /nonces
```

### Example

```console
curl  -X POST \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Content-Type: application/json" \
      https://api.layer.com/nonces
```

Note that the Accept header is required, and is described in [API Versioning](rest#api-versioning).

### Response `201 (Created)`

```json
{
  "nonce": "b7a5fba5ad402d072013c1949481c1080860ff32"
}
```

## 2. Obtain an Identity Token

The nonce is provided to your Identity Server which must return an Identity Token.  Typically this Identity Server would be hosted with your own servers, and would have code to validate the identity of the user making the request.

More information on creating your own Identity Service can be found in the [Authentication Guide](https://developer.layer.com/docs/android/guides#authentication).



## 3. Obtain a Session Token

Once you have an Identity Token you can request a Session Token.

```request
POST /sessions
```

### Parameters

| Name    | Type |  Description  |
|---------|------|---------------|
| **identity_token** | string | Token validating your identity |
| **app_id** | string | Your Layer App ID |

### Example

```json
{
  "identity_token": "f6179ecb285c669c07415011f17d7a4e59ce1f91.9afd0f5ef6df7bf7eb13e9ada65fa28cf765a51c.450b81833898cb159f3cfc5a9a839187e63683e0",
  "app_id": "layer://apps/production/e49e50aa-ffda-453f-adc8-404f68de84ae"
}
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/sessions
      -d '{ "identity_token": "f6179ecb285c669c07415011f17d7a4e59ce1f91.9afd0f5ef6df7bf7eb13e9ada65fa28cf765a51c.450b81833898cb159f3cfc5a9a839187e63683e0", "app_id": "layer://apps/production/e49e50aa-ffda-453f-adc8-404f68de84ae" }'
}
```

### Response `201 (Created)`

```json
{
  "session_token": "c3ba507fc4fc3c8e0618c4bee3250132e86bd7e9"
}
```

#### Link Header Response

A successful response also includes info in the [Link header](http://tools.ietf.org/html/rfc5988). It is important to follow these Link header values instead of constructing your own URLs.

```
link: <https://api.layer.com/conversations>; rel=conversations,
  <https://api.layer.com/content>; rel=content,
  <https://api.layer.com/websocket>; rel=websocket
```

The possible `rel` values are:

| Name    | Description                              |
|---------|------------------------------------------|
| **conversations**    | The URL to load the first page of conversations.     |
| **content**    | The URL for creating external content. |
| **websocket** | The URL for establishing a WebSocket |


### Response `422 (Unprocessable Entity)`

Your request for a session token may fail with a `422` error:

```json
{
  "id": "invalid_property",
  "code": 105,
  "message": "Invalid identity token; go to the developer dashboard's authentication tab and use the identity token validation form for more details.",
  "url": "https://developer.layer.com/",
  "data": {
    "property": "identity_token"
  }
}
```

## 4. Using the Session Token

The Session Token returned from a successful request must be presented within the `Authorization` header of each request.  The format of this is:

```text
Authorization: Layer session-token="c3ba507fc4fc3c8e0618c4bee3250132e86bd7e9"
 ```
> Single quotes are accepted

## Authentication Challenges

When the session expires, requests using the expired session token will be rejected by the API. Such requests will return a `401 (Unauthorized)` response,
and will include a new nonce in the response body. This nonce can then be used to to repeat [Obtain an Identity Token](#2-obtain-an-identity-token).


### Response: `401 (Unauthorized)`
```json
{
  "id": "authentication_required",
  "code": 4,
  "message": "The session token is no longer valid because it has expired.",
  "url": "https://developer.layer.com/api.md#authentication",
  "data": {
    "nonce": "38a9b5a41725ec2bbb51ce43328b671731496f1f"
  }
}
```

## Logging Out

To insure that your session token can no longer be used by anyone, you can delete the token:

```request
DELETE /sessions/:token_id
```

### Example

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Content-Type: application/json" \
      https://api.layer.com/sessions/7Rti7Cl6m3JA4GdjXRcnyBvovv0q-DBHpQdmGUZblKJbGzODoAYW7Z5o_a5bJjqkD_CU_pe9qr11111111111.1-1
```

### Response `204 (No Response)`

A successful deletion request will return no body, and a status of 204.
