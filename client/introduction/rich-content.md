# Rich Content

A MessagePart may contains a `content` property representing Rich Content.  Rich Content refers to content larger than 2kb, such that the content must be stored on a cloud storage system rather than within the Message Service.

```json
{
  "id": "layer:///content/7a0aefb8-3c97-11e4-baad-164230d1df67",
  "download_url": "http://google-testbucket.storage.googleapis.com/some/download/path",
  "expiration": "2014-09-09T04:44:47+00:00",
  "refresh_url": "https://api.layer.com/content/7a0aefb8-3c97-11e4-baad-164230d1df67",
  "size": 172114124
}
```

| Name    | Type |  Description  |
|---------|------|---------------|
| **id** | string | A Layer ID to identify the Content |
| **download_url** | string | URL from which the Rich Content can be downloaded |
| **expiration** | string | Time at which the *download_url* will expire |
| **refresh_url** | string | URL for refreshing the *download_url* |
| **size** | number | Size of the Rich Content |

Rich Content is discussed in more detail in the [REST API](rest#rich-content).
