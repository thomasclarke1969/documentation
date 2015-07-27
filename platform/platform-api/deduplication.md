# De-duplicating Requests

When a client issues a network request, it is always possible for the request to timeout or return a recoverable error status code indicating that it should be resent. However, this opens up the possibility of the same request being performed more than once, which could create duplicate entities (e.g. Conversations or Messages).

De-duplication is a technique for avoiding creating these duplicates when retrying a create request.  This is done using an `If-None-Match` header field with an [RFC 4122-compliant UUID](http://www.ietf.org/rfc/rfc4122.txt)  for requests that create new entities. If this header field exists in a request, the server will not re-execute the request if the tag has already been seen, and will respond with the previously created resource.

```emphasis
Correct use of `If-None-Match` requires that a unique UUID be used for each create request, but that the UUID be reused for a retry request.
```

```text
var uuid = UUID.generate();
request.addHeader("If-None-Match", "\"" + uuid + "\"");
if (!tryRequest(request)) {
  delayAndRetryWithSameUUID(request);
}
```
