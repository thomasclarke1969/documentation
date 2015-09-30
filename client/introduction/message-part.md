# The MessagePart Object

Each Message contains a `parts` property with an array of MessageParts.

| Name    | Type |  Description  |
|---------|------|---------------|
| **id**  | string | A Layer ID to identify the Part |
| **mime_type** | string | The Mime Type (text/plain; image/png; etc...) |
| **body** | string | The contents ("Hello world", "please end with etc", etc...) |
| **encoding** | string | Optional encoding field; "base64" |
| **content** | object | A Rich Content object for larger payloads |


## The `mime_type` property

Assigning meaning to a `mime_type` is up to your suite of application (your web, Android and IOS applications).  Common values are `text/plain` and `image/jpeg`, but you can define any `custom/format` that your clients are designed to understand.

## The `body` property

The `body` represents the actual content of your MessagePart.  For a `text/plain` MessagePart, the body might be "hello world".  For an `image/png` MessagePart it might be a base64 encoded image string.  For `custom/format` it might contain a JSON string.

Each Message Part is limited to 2kb for the unencoded body size.  If sending a base64 encoded body, it will be decoded, and then rejected if the unencoded body exceeds 2kb.

If using the `content` property, the `body` should be left out or have a value of `null`.

## The `encoding` property

Each MessagePart can have an optional `encoding` property.  Typically this field will be null, but if sending/receiving data that is base64 encoded, the `encoding` value of "base64" should be used.  This property only affects the `body`, so if you are using the `content` property, the encoding should be ignored.

## The `content` property

Due to the 2kb limit on body size, MessageParts that are larger than 2kb will use the [Rich Content](#rich-content) APIs which create a Content object that allows the larger content to be stored on a separate server.  If a Content object is not provided, this field will be null.

