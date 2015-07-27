# De-duplicating Requests

When a client issues a network request, it is always possible for the request to timeout or return a recoverable error status code indicating that it should be resent. However, this opens up the possibility of the same request being performed more than once, which could create duplicate entities (e.g. Conversations or Messages).

To avoid this, it is recommended that clients include an `If-None-Match` header field with an [RFC 4122-compliant UUID](http://www.ietf.org/rfc/rfc4122.txt)  for requests that create new entities. If this header field exists in a request, the server will not re-execute the request if the tag has already been seen, and will respond with the previously created resource.

```text
If-None_Match: “\”” + UUID.generate() + “\””
```

This header field can be omitted for applications than can tolerate such requests being occasionally re-executed.
