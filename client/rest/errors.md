# Error Handling

Clients must be prepared to handle a variety of errors that may be returned by the server. Errors responses will have an appropriate HTTP status code and the response body will contain a JSON representation of the error:

### Response `422 (Unprocessable Entity)`

```json
{
  "id": "missing_property",
  "code": 104,
  "message": "The participants list cannot be omitted.",
  "url": "https://developer.layer.com/api.md#creating-a-conversation",
  "data": {
    "property": "participants"
  }
}
```

## Error Attributes

| Name    | Type   | Description | Example |
|---------|:------:|-------------|---------|
| **id**    | string   | Unique string error identifier | access_denied |
| **code**  | integer   | Unique numeric error code | 12345 |
| **message** | string | Details of the error | The participants list cannot be omitted |
| **url**   | string   | A URL to a reference with more info about the error | https://developer.layer.com/client/introduction#authentication |
| **data** | dictionary | A free form dictionary of supplemental data specific to the error | `{ "nonce": "38ca1bb2-2560-44d4-88bb-5989ce9b2b66" }` |


## Full List


| `code`   | `id` | Context | HTTP Status |Description |
|:------:|------|:---------:|--------|-------------|
| 1 | `service_unavailable` | Client | `503 (Service Unavailable)`  | The operation could not be completed because a backend service could not be accessed |
| 2 | `invalid_app_id` | Client | `403 (Forbidden)`  | The client provided an invalid Layer App ID |
| 3 | `invalid_request_id` | Client | `400 (Bad Request)`  | The client has supplied a request ID that is not a valid UUID |
| 4 | `authentication_required` | Client | `401 (Unauthorized)`  | The action could not be completed because the client is unauthenticated The response will include a nonce for satisfying an authentication challenge |
| 7 | `rate_limit_exceeded` | Client | `429 (Too Many Requests)` | The client has sent too many requests in a given amount of time |
| 8 | `request_timeout` | Client | `408 (Request Timeout)` or None | The server or the client timed out waiting for a request to complete |
| 9 | `invalid_operation` | Client | `422 (Unprocessable Entity)` or None | The server or client has declined to perform an invalid operation (i.e. deleting an unsent message) |
| 10 | `invalid_request` | Client | `400 (Bad Request)` | The request is structurally invalid |
| 100 | `internal_server_error` | Client | `500 (Internal Server Error)` | The operation could not be completed because an unexpected error occurred |
| 101 | `access_denied` | Resource | `403 (Forbidden)` | The authenticated user does not have access to the resource requested |
| 102 | `not_found` | Resource | `404 (Not Found)` | The resource requested could not be found |
| 104 | `missing_property` | Resource | `422 (Unprocessable Entity)` | A property with a required value was not supplied |
| 105 | `invalid_property` | Resource | `422 (Unprocessable Entity)` | A property was supplied with an invalid value |
| 106 | `invalid_endpoint` | Client | `404 (Not Found)` | The endpoint 'GET /nonce' does not exist |
| 107 | `invalid_header` | Client | `406 (Not Acceptable)` | Invalid Accept header; must be of form application/vnd.layer+json; version=x.y |
| 108 | `conflict` | Resource | `409 (Conflict)` | The distinct conversation already exists with conflicting metadata |
| 109 | `method_not_allowed` |  Resource | `405 (Method Not Allowed)` | The HTTP method used is not allowed for the given resource |


## Error Responses

### service_unavailable

There are issues on the server; typically these resolve in a few minutes, and you can retry your request soon.  If the issue does not clear, contact support@layer.com.

### invalid_app_id

The Application ID provided to a `POST /sesssion` call was invalid.  This service accepts IDs in the form of `layer://apps/production/uuid`, `layer://apps/staging/uuid` and just `uuid`.  See [Obtain a Session Token](client#3-obtain-a-session-token).

### invalid_request_id

The client has supplied a request ID that is not a valid UUID.  You can try and validate your UUID with a public UUID validator such as [this one](http://guid.us/Test/GUID).

### access_denied

You have attempted to access a resource to which your user does not have permissions.  Typically this means that the user was a participant of this Conversation, but is no longer a participant.  So it still shows up in their data, but they no longer have permissions to operate upon it.

### not_found

You have attempted to access a resource that was not found.  Typical causes include:

1. The resource was deleted
2. The resource ID is incorrect
3. The user has never been a participant who can access this data; from the user's perspective, this data does not exist.

### invalid_header

This error typically occurs when:

1. A request is made without an appropriate `Accept` header; see [API Versioning](rest#api-versioning) for header requirements.
2. A request was made with an appropriate `Accept` header, but requested a version that is not available.
3. A `PATCH` operation is performed with an incorrect `Content-Type` header; see [Layer-Patch](rest#layer-patch) for header requirements.

