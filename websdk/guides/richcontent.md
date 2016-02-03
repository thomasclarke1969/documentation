# Rich Content

In the Layer ecosystem, Rich Content refers to

* Any MessagePart whose decoded body size is > 2KB
* The capacity for these bodys to represent a wide range of Mime Types

Rich Content represents a set of APIs and services for handling larger parts.  The MessagePart handles uploading and downloading content > 2KB from a cloud storage server.

There are two main categories of activities related to using Rich Content:

* Creating/Sending Rich Content
* Recieving/Downloading Rich Content

```emphasis
It is referred here as rich content if its larger than 2KB; therefore, even large blocks of text can be treated as rich content.
```

## Creating/Sending Rich Content

Any time a MessagePart is created with a body that is greater than 2KB,
it will automatically upload the content to a cloud server.

```javascript
var text = new Array(1000).join('abcdef');
var message = conversation.createMessage({
    parts: [{
        body: text,
        mimeType: 'text/plain'
    }, {
      body: 'part one of this message is really long',
      mimeType: 'text/plain'
    }]
});
message.send();
```

On calling `message.send()` each MessagePart instance will:

1. look at its body, determine that it needs to create a Content object
2. Create a Content object
3. Upload the data from the body property to cloud storage
4. Notify the Message class that its ready to send

Once all parts have indicated they are ready, the Message is sent.

When sending is completed, your MessagePart will be updated so that you can download the Content.

One can also send images this way:

```javascript
var fileInputNode = document.getElementById('myFileInput');

// Create one part from the file
var part = new MessagePart(fileInputNode.files[0]);
var message = conversation.createMessage({
    parts: [part]
});

// Optional: Add a text/plain part
message.addPart(new MessagePart({
  mimeType: 'text/plain',
  body: 'Hope you like this image'
}));

// Send the message
message.send();
```

The above code access an HTML File Input, gets its data from the JavaScript File object (subclass of Blob), and sticks the File into the body of the MessagePart.  MessagePart mimeType is automatically set using the `type` property of the file.

On calling `message.send()` on the message, the image is uploaded to cloud storage, and the message is then sent.

Note that on sending, you will still have a File/Blob in the message part body that you can directly render.

## Receiving/Rendering Rich Content

A MessagePart with Rich Content will have a `body` property of null.  The Rich Content  will instead be exposed through the `url` property.

The simplest use of Rich Content is:

```javascript
if (part.mimeType === 'image/png') {
    if (part.url) {
       return '<img src="' + part.url + '"/>';
    }
}
```


### The `url` property

In the above example, the `url` property expires after a few hours after which it can no longer load your content.  What does this mean?

* If your UI loads the MessagePart but the user does not interact with it for a few hours, they may be unable to access it.
* If your UI loads and renders the MessagePart, it should be fine as long as a re-render does not try to re-download the content later on.
* If your user opens the url in a new tab and tries to share that URL with others, that URL will expire; this makes sharing problematic.

There are two types of values that can be stored in the `url` property:

* Expiring URL: The URL points to a resource in the cloud, but the URL will expire after a few hours.
* Local URL: The data from the resource in the cloud has been downloaded to the browser, represented by a local URL (see [URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)).  An example of the URL generated: `blob:http%3A//mydomain.com/bc01aeb1-ff6e-4c34-90a3-a7f50b7ecb79`.  This URL is non-sharable but also does not expire.

Under normal conditions, the `url` property will return a value until it expires, and then will return an empty string.

### APIs for Receiving Rich Content

The following APIs help deal with receiving Rich Content:

* The `fetchContent` method downloads the data and sets the `body` property and also sets the `url` property to a local-only non-expiring URL
* The `fetchStream` method refreshes the expiring `url` property; useful for content that should not be downloaded prior to rendering.
* The `hasContent` property indicates if there is Rich Content in this MessagePart.


#### The `fetchContent` method

The `fetchContent` method does the following:

* Loads the content from the server
* Stores the results in the `body` property
* Creates a local URL for accessing that data in `url` (*this url does not expire*)

Whether to use `body` or `url` in rendering your code is a matter of preference.  Note that `body` will be a Blob, making `url` a little more direct for rendering images.

Special Case: text/plain parts will write a string value to `body` instead of a Blob.

If your reading a large `application/json` mimeType, this may be text, but is **not** `text/plain`, so you will typically process it as follows:

```javascript
const reader = new FileReader();
reader.addEventListener('loadend', () => {
  var partData = JSON.parse(reader.result);
  myRenderJsonPart(partData);
});
reader.readAsText(part.body);

```

#### The `fetchStream` method

The `fetchStream` method will do the following:

* Refresh the `url` property so that it won't expire for another few hours

When should you use `fetchStream`?

* If you have an `<a href={part.url}></a>` link in your page, you may not want to download all of the content for every one of your links just to prepare for the possibility that the user will click on the link. Instead, offer a link and when the user opens that link in a new tab (or new application) the data will be downloaded by the new tab.
* If you have a video or other streaming content, you don't want to wait for all of the content to download via `fetchContent` before rendering.  You want to render what you have regardless of how much has downloaded: `<video src={part.url}></video>` will render the video without waiting for the whole video to download.

Its important to understand that the `fetchStream` method refreshes an expiring url, but that at the time you first receive the MessagePart with rich content, it will already have a valid `url` property.  `fetchStream` is the method you will call after that initial `url` expires, and call again when your refreshed `url` has again expired.  Further note that the `url` property will return empty string if it has expired:

```javascript
// If the part has expired, load it
if (!part.url) part.fetchStream();
return '<img src="' + part.url + '"/>';
```

The above code should not call `fetchStream` for the first few hours, but will only call it after the content expires.

#### The `hasContent` property

A MessagePart that is greater than 2KB will be sent as Rich Content, and otherwise will be sent via the `body` property of the MessagePart.  If you send text, depending on the size of the text, it could come as Rich Content or not.  If you send a small enough image, it will arrive via a base64 encoded `body` property, whereas a larger image arrives as Rich Content.  While it is typically good enough to test if there is a `body` property, its still handy to be able to test that there SHOULD be a `url`, especially if you are using an expiring `url`:

```javascript
// A small image was sent using the body property and a base64 encoding:
if (part.body && part.mimeType === 'base64') {
  return '<img src="data:image/png;base64,' + part.body + '"/>';
}

// Or it was sent using Rich Content; this code may render an empty image if
// the url has expired; but if it has expired, a new url will be loaded by fetchStream().
else if (part.hasContent) {
  if (!part.url) part.fetchStream();
  return '<img src="' + part.url + '"/>';
}
```

#### Rich Content Events

The following events may be of use while working with Rich Content:

* The `fetchContent` method will trigger a `content-loaded` event when its data has loaded
* The `fetchStream` method will trigger a `url-loaded` event when the `url` has been refreshed
* Both methods, because they are updating properties of a MessagePart, will trigger a `message:change` event.

#### The `content-loaded` event

```javascript
if (part.mimeType === 'text/plain') {
    // If we don't have a body, call fetchContent and update our rendering
    // when the content is loaded.
    if (!part.body) {
      part.fetchContent().on('content-loaded', function() {
          document.getElementById('fred').innerHTML = part.body;
      });
      return '<div id='fred' />';
    }

    // Either this isn't rich content... or fetchContent() has already populated
    // the body property:
    else {
        return '<div>' + part.body + '</div>';
    }
}
```

#### The `url-loaded` event

```javascript
if (part.mimeType === 'image/jpeg') {
    // If we don't have a url, call fetchStream and update our rendering
    // when the url is refreshed.
    if (!part.url) {
      part.fetchStream().on('url-loaded', function() {
          document.getElementById('fred').src = part.url;
      });
      return '<img id='fred' />';
    }

    // The URL has not yet expired:
    else {
        return '<img src="' + part.url + '" />';
    }
}
```

#### The `message:change` event

```javascript
function renderMessage(message) {
  message.parts.forEach(function(part) {
    renderPart(part);
  });
}

function renderPart(part) {
  if (!part.body) part.fetchContent();
  return '<div>' + part.body + '</div>';
}

message.on('messages:change', function() {
  renderMessage(message);
});
```

The above call to `fetchContent` will eventually lead to `messages:change`
being triggered, causing `renderPart` to be called again, this time
with a `body` property that can be rendered.

### Handling EXIF Data

There is a well documented browser bug such that EXIF data embedded in images which specifies the correct orientation of the image is ignored when rendering an image using an `<img/>` tag.

There are two solutions to this problem:

1. Rotate the images before sending them so that EXIF data is not needed for correct orientation.  This needs to be implemented across all clients.
2. Use a library such as [BlueImp's LoadImage](https://github.com/blueimp/JavaScript-Load-Image) to render the image to a Canvas where it can do any rotation needed.

### Overriding a File's MimeType

The following JavaScript will set the `mimeType` property from the input blob and ignore any other mimeType properties:

```javascript
var part = new layer.MessagePart(file);
expect(blob.type).toEqual(part.mimeType);
```

To customize the `mimeType` property you must explicitly set it AFTER instantiating the object:

```javascript
var part = new layer.MessagePart(file);
part.mimeType = 'custom/type';
```
