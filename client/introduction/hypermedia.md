# URLs and Root Request

Certain server requests return URLs that you can use for accessing the API.  There are two kinds of URLs you will see:

1. Link Headers
2. Resource Operations

## Link Headers

Certain requests will respond with Link Headers:

```
link: <https://api.layer.com/nonces>; rel=nonces,
      <https://api.layer.com/sessions>; rel=sessions,
      <https://api.layer.com/conversations>; rel=conversations,
      <https://api.layer.com/content>; rel=content
```

The headers provide a name for a service, and tell you the current place to go to access that service.  To learn more about Link Headers, read [RFC 5988](http://tools.ietf.org/html/rfc5988).

The most important Link Headers are returned by:

1. The `POST /sessions` request when [Authenticating](#authentication).
2. The `GET /` request documented below

### Root Request

When first getting started connecting to Layer, an app may use:

```request
GET https://api.layer.com/
```

```console
curl -i -X  GET https://api.layer.com/
```

#### Response `200 (OK)`

```
link: <https://api.layer.com/nonces>; rel=nonces,
      <https://api.layer.com/sessions>; rel=sessions,
      <https://api.layer.com/conversations>; rel=conversations,
      <https://api.layer.com/content>; rel=content
```


## Resource Operations

When receiving a Resource Object from the server, it will come with some number of properties postfixed with "_url" that indicate the correct URL for performing an operation upon that resource.

For example, the Conversation object contains a `messages_url` property with the correct url for listing Messages in the Conversation.
