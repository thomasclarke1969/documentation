# Errors

There are a number of reasons why you might get an error response from the Webhooks API.  Some examples are:

- Missing or invalid [authentication](/docs/webhooks/rest#authentication).
- Missing or invalid [content negotiation](/docs/webhooks/rest#content-negotiation).
- Malformed JSON content, or a missing required property.

Error responses will always have either a 4xx or 5xx HTTP status code, and the body of the response will contain an object in `application/json` format with the following properties:

| Name | Type  | Description |
|------|:-----:|-------------|
| **code** | int | Numeric error code such as `104` |
| **id** | string | Error identifier such as `missing_property` or `invalid_app_id` |
| **message** | string | Human-readable description of the error |
| **url** | string | Link to documentation for more info |
| **data** | dictionary | Optional extra clarifying data, such as `"property": "target_url"` |

For example:

### Response `422 (Unprocessable Entity)`

```json
{
    "code": 104,
    "id": "missing_property",
    "message": "The target_url property cannot be omitted.",
    "url": "https://developer.layer.com/docs/webhooks",
    "data": {
        "property": "target_url"
    }
}
```
