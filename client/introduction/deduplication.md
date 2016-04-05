# De-duplicating Requests

When a client issues a network request, it is always possible for the request to timeout or return a recoverable error status code indicating that it should be resent. However, this opens up the possibility of the same request being performed more than once, which could create duplicate entities (e.g. Conversations or Messages).

De-duplication is a technique for avoiding creating these duplicates when retrying a create request.  This is done by assigning a UUID to your object on creating it.  The server will not re-execute the request if the ID has already been used, and will instead respond with:

```json
{
  "id": "id_in_use",
  "code": 111,
  "message": "The requested Message already exists",
  "url": "https://developer.layer.com/docs/client/websockets#create-requests",
  "data": <Message>|<Conversation>
}
```

* REST-API: a `409 (Conflict)` status, and the JSON above as the response body
* Websocket-API: A Websocket Packet indicating that the response was unsuccessful, and including the JSON above in the body.

```emphasis
A unique UUID must be used for each create request if doing deduplication.  If the request fails, the UUID is reused when retrying the request.
```

Illustrative code example:
```text
var request = {
    id: generateUUID(),
    field1: value1,
    field2: value2
};

execute(request, function(err, result) {
    if (err) delayAndRetryWithSameID(request);
});
```

It is not required that you provide an `id` with your requests.  Note that the value provided in the `id` field will become the ID of the resource you create.
