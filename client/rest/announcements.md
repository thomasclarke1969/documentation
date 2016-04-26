# Retrieving All Announcements

You can List Announcements using:

```request
GET /announcements
```

Get the most recent Announcements:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/announcements
```

## Pagination

All requests that list resources support the pagination API, which includes:

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **page_size** | number  | Number of results to return; default and maximum value of 100. |
| **from_id** | string | Get the Announcements after this ID in the list (before this ID chronologically); can be passed as a layer URI `layer:///announcements/uuid` or as just a UUID |

### Headers

All List Resource requests will return a header indicating the total number of results to page through.

```text
Layer-Count: 4023
```

Pagination example:

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/announcements?from_id=UUID
```

### Response `200 (OK)`

```text
[<Announcement>, <Announcement>]
```

# Retrieving an Announcement

You can get a single Announcement using:

```request
GET /announcements/:announcement_uuid
```

```console
curl  -X GET \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/announcements/ANNOUNCEMENT_UUID
```

### Response `200 (OK)`

```json
{
  "id": "layer:///announcements/940de862-3c96-11e4-baad-164230d1df67",
  "url": "https://api.layer.com/announcements/940de862-3c96-11e4-baad-164230d1df67",
  "receipts_url": "https://api.layer.com/announcements/940de862-3c96-11e4-baad-164230d1df67/receipts",
  "parts": [
    {
      "body": "Hello, World!",
      "mime_type": "text/plain"
    }
  ],
  "sent_at": "2014-09-09T04:44:47+00:00",
  "sender": {
    "name": "The World"
  },
  "recipient_status": {
    "5678": "read"
  }
}
```

# Deleting an Announcement

You can delete an Announcement using:

```request
DELETE /announcements/:announcement_uuid
```

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/json" \
      https://api.layer.com/announcements/ANNOUNCEMENT_UUID
```

### Response `204 (No Content)`

The standard successful response is a `204 (No Content)`.
