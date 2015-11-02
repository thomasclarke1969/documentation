# Overview

The REST API provides a set of endpoints for querying and performing operations.  All data is sent and received as `JSON`, and all API access is over `HTTPS` from the following URL:

```text
https://api.layer.com
```


## API Versioning

The API is versioned using a custom media type that encodes the wire format and the version desired. Developers must explicitly request a specific version via the `Accept` header:

```text
Accept: application/vnd.layer+json; version=1.0
```

Failure to request a specific version of the API will result in:

###  Response `406 (Not Acceptable)`

```json
{
  "id": "invalid_header",
  "code": 107,
  "message": "Invalid Accept header; must be of form application/vnd.layer+json; version=x.y",
  "url": "https://github.com/layerhq/docs/blob/web-api/specs/rest-api.md#api-versioning",
  "data": {
    "header": "Accept"
  }
}
```

## Retrying Requests

Any request can fail for a variety of reasons; handling should always be in place for retrying a request on failure.  Possible failures:

1. The browser your app is running in has gone offline
2. The server returns 503 (service unavailable)
3. The server returns 504 (gateway timeout)

An exponential backoff strategy is recommended for retrying until a request is successful.  This strategy should be appropriate for all three cases described above.

While one can build prototypes without implementing some form of retry logic, a production application without retry logic will experience a number of bugs that will cause issues for users.

## Rate Limiting

To protect Layer servers from abuse, rate limiting is enforced by the server.  Limits are set to be relatively forgiving.  Violation of limits will return the Rate Limiting Error:

### Response `429 (Too Many Requests)`

```json
{
  "code": 7,
  "id": "rate_limit_exceeded",
  "message": "The client has sent too many requests in a given amount of time."
}
```

## Sample Code
For sample code, visit the [Layer for Web Sample Code](https://github.com/layerhq/samples-web-apis) repo on Github.
