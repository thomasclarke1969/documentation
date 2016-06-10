# Sending Ad-hoc Notifications over Layer Notification Service (LNS)

Notifications are messages sent to specific recipients over the GCM (Google Cloud Messaging) and APNS (Apple Push Notification Service) push notification services. The LNS Platform API provides a unified integration point between different push notification service providers.

The following request behaves similarly to the [Send a Message](#send-a-message) request above.  Each recipient will receive the Notification over the appropriate service, GCM for Android and APNS for iOS. Other push notification services are planned for future releases.

```request
POST /apps/:app_uuid/notifications
```

### Parameters

| Name         |    Type     |  Description  |
|--------------|-------------|---------------|
| **recipients** | array | Array of User IDs to deliver the Notification to. |
| **notification** | object | See [Push Notifications](https://developer.layer.com/docs/platform/misc#notification-customization) docs for detailed options. |

### Example Request: Sending a Notification

```json
{
    "recipients": [ "1234", "5678" ],
    "notification": {
        "text": "This is the alert text to include with the Push Notification.",
        "sound": "chime.aiff"
    }
}
```

### Successful Response

`202 (Accepted)`

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"notification": {"text": "Howdy"}, "recipients": ["a","b","c"]}' \
      https://api.layer.com/apps/APP_UUID/notifications
```

## Notification customization

For details on this topic please see: [Notification customization](notification-customization.md)

