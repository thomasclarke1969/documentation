# Rich Content

The Rich Content feature exists to allow messages whose body is larger than 2KB to be sent.  Rich Content works by uploading your content to a cloud file store, and attaching the URL and information about that file store to the Message.  Rich Content uses the Content Object:

```json
{
  "id": "layer:///content/7a0aefb8-3c97-11e4-baad-164230d1df67",
  "size": 172114124,
  "download_url": "http://google-testbucket.storage.googleapis.com/some/download/path",
  "refresh_url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/content/7a0aefb8-3c97-11e4-baad-164230d1df67",
  "expiration": "2014-09-09T04:44:47+00:00"
}
```

| Name    | Type |  Description  |
|---------|------|---------------|
| **id** | string | A Layer ID to identify the Content |
| **size** | number | Size of the Rich Content |
| **upload_url** | string | URL to which the Rich Content should be uploaded |
| **download_url** | string | URL from which the Rich Content can be downloaded |
| **expiration** | string | Time at which the *download_url* will expire |
| **refresh_url** | string | URL for refreshing the *download_url* |

The process for sending Rich Content is:

1. `POST /apps/:app_uuid/conversations/:conversation_uuid/content` and get the `id` and `upload_url` from the Content in the response.
2. Upload your content to the specified `upload_url`
3. Create a Message with the Content `id`

## Initiating a Rich Content Upload

You can create a new Content resource using:

```request
POST /apps/:app_uuid/conversations/:conversation_uuid/content
```

## Headers

The request includes the following additional headers:

| Name   | Description | Example |
|---------|-------------|---------|
| **Upload-Content-Type**   | Mime type for the content to be uploaded | "image/png" |
| **Upload-Content-Length** | Size of the content to be uploaded | 10001 |
| **Upload-Origin** | Browsers need CORS headers, and if applicable you should provide the Origin for the request | `http://mydomain.com` |

The response will either be a 201 (Created) response that includes a `content` object or an error indicating why the operation failed.

## Example

```console
curl  -X POST \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Bearer TOKEN" \
      -H "Content-Type: application/json" \
      -H "Upload-Content-Type: image/jpeg" \
      -H "Upload-Content-Length: 10001" \
      -H "Upload-Origin: http://mydomain.com" \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_UUID/content
```

### Response `201 (Created)`

Standard response from creating a Content; the response will include a `Location` header:

```text
Location: /apps/APP_UUID/conversations/CONVERSATION_UUID/content/3d0736d9-1a50-4e9a-a9b3-2400caa9e161
```

And a Content Object with your Content ID and upload_url.

```json
{
  "id": "layer:///content/3d0736d9-1a50-4e9a-a9b3-2400caa9e161",
  "size": 10001,
  "upload_url": "https://www.googleapis.com/upload/storage/v1/b/myBucket/o?uploadType=resumable&upload_id=xa298sd_sdlkj2",
  "download_url": null,
  "refresh_url": null,
  "expiration": null
}
```

The `upload_url` field will be a Google Cloud Storage resumable upload URL. The specifics for completing the upload are detailed in the [Google Cloud Storage JSON API Docs](https://cloud.google.com/storage/docs/json_api/v1/how-tos/upload#resumable).

## Sending a Message including Rich Content

Once the Rich Content upload has completed, the client can send a Message that includes the Rich Content part using:

```request
POST /apps/:app_uuid/conversations/:conversation_uuid/messages
```

### Parameters

The Content Object requires the following parameters when sending:

| Name   | Type | Description |
|---------|-------------|---------|
| id   | string | ID for the content that was returned from `POST /apps/:app_uuid/conversations/:conversation_uuid/content`.  (e.g. layer:///content/cbf5f150-2f45-11e5-82f7-0242ac1100e3) |
| size | number | Size of the file that was uploaded; should match the `Upload-Content-Length` header. |

### Example Sending Rich Content Message

```json
{
  "parts": [
    {
      "mime_type": "text/plain",
      "body": "This is the message."
    },
    {
      "mime_type": "image/png",
      "content": {
        "id": "layer:///content/7a0aefb8-3c97-11e4-baad-164230d1df67",
        "size": 10001
      }
    }
  ]
}
```

### Response `201 (Created)`

Standard response from creating a Message.

## Downloading a Rich Content Message Part

Messages that include Rich Content Message Parts will include an authenticated, expiring URL for downloading the content embedded in the Message:

```json
{
  "parts": [
    {
      "mime_type": "text/plain",
      "body": "This is the message."
    },
    {
      "mime_type": "image/png",
      "content": {
        "id": "layer:///content/8c839735-5f95-439a-a867-30903c0133f2",
        "size": 172114124,
        "download_url": "http://google-testbucket.storage.googleapis.com/testdata.txt?GoogleAccessId=1234567890123@developer.gserviceaccount.com&Expires=1331155464&Signature=BClz9e4UA2MRRDX62TPd8sNpUCxVsqUDG3YGPWvPcwN%2BmWBPqwgUYcOSszCPlgWREeF7oPGowkeKk7J4WApzkzxERdOQmAdrvshKSzUHg8Jqp1lw9tbiJfE2ExdOOIoJVmGLoDeAGnfzCd4fTsWcLbal9sFpqXsQI8IQi1493mw%3D",
        "refresh_url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/content/8c839735-5f95-439a-a867-30903c0133f2",
        "expiration": "2016-05-09T04:51:27+00:00"
      }
    }
  ]
}
```

Using the `download_url` should allow you to request and render the content.  Some caveats to be aware of:

1. Photos displayed in web browsers will not use exif data to rotate the image to the correct orientation.  Images need to be rotated before being uploaded, or JavaScript libraries such as [blueimp-load-image](https://github.com/blueimp/JavaScript-Load-Image) should be used to parse exif data and rotate the images.
2. If loading content via XHR request rather than  than directly setting a `src` property on a dom node, you will need to insure that CORS requests are enabled.  This is addressed by including the `Upload-Origin` header in `POST /apps/:app_uuid/conversations/:conversation_uuid/content` which tells the cloud storage service to allow CORS requests from that origin.


#### Refreshing the download URL for a Content Object

The `download_url` will expire periodically; the `expiration` field will tell you when.  Every time you fetch a message from the server it will come with a new, fresh download URL and expiration. The download URL for a particular content object can be refreshed using:

```request
GET /apps/:app_uuid/conversations/:conversation_uuid/content/:content_id
```

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=2.0" \
      -H "Authorization: Bearer TOKEN" \
      https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/content/8c839735-5f95-439a-a867-30903c0133f2
```

The response will be a JSON document that includes a newly refreshed URL for accessing the rich content:

### Response `200 (OK)`

```json
{
  "id": "8c839735-5f95-439a-a867-30903c0133f2",
  "size": 172114124,
  "download_url": "http://google-testbucket.storage.googleapis.com/some/download/path",
  "refresh_url": "https://api.layer.com/apps/24f43c32-4d95-11e4-b3a2-0fd00000020d/conversations/f3cc7b32-3c92-11e4-baad-164230d1df67/content/8c839735-5f95-439a-a867-30903c0133f2",
  "expiration": "2016-05-09T05:51:27+00:00"
}
```

```emphasis
Note, The GET request can only be issued if content has already been uploaded to cloud storage. If a Content resource was created on the REST server but the data never uploaded to storage, this request fails.
```
