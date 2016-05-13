# Notification Customization

Sending a Layer message or announcement will deliver a push notification to all recipients. Developers are free to customize the `notification` if they so choose by setting a value for the `notification` key in the message or announcement payload.

# Basic Customization

For applications that wish to send a simple push notification, the following payload can be used. This will deliver a push notification with the following information to all recipients of a message or announcement.

```json
{
    "notification" : {
        "title": "Simon and Garfunkel",
        "text": "Hello darkness my old friend",
        "sound": "silence.aiff"
    }
}
```

# Per Recipient Customization

Applications that require customization on a per recipient basis can do so by supplying a value for the `recipients` key in the notification payload. This value should be an array of objects that specify the notification `title`, `text` and `sound` for each recipient. If any option is not specified within the `recipient` array, the value will default to the value specified at the root of the `notification` structure.

| Name            | Type    | Description |
|-----------------|---------|-------------|
| **text**        | string  | The text to be displayed on the notification alert. On iOS, displayed on the lock screen or banner. On GCM, delivered in the push intent as advisory information. |
| **sound**       | string  | The name of a sound to be played. On iOS, must exist in the main application bundle. On GCM, delivered in the push intent as advisory information. |
| **recipients**  | array of objects  | OPTIONAL. Recipients and their customized notifications, where applicable.  |

```json
{
    "notification" : {
        "title": "New Message",
        "text": "This is the alert text",
        "sound": "aaaaoooga.aiff",
        "recipients": [
            {
              "user_id": "klaus_stube",
              "text": "hallo welt",
              "sound": "ping.aiff"
            },
            { 
              "user_id": "luigi_puccini",
              "title": "New Message",
              "text": "ciao mondo"
            },
            { 
              "user_id": "martina_marquez",
              "text": "hola mundo",
              "sound": "chime.aiff"
            },
            { 
              "user_id": "reginald_royford_williams_iii",
              "text": "Um.  Hello?"
            }
        ]
    }
}
```

The following rules apply to participant specific notifications:

 - If `sound` or `text` is left out for a participant, they inherit from the default `sound` or `text` specified at the root of the `notification` structure
 - Participants not listed in the `recipients` section will get the default `sound` and `text`
 - If there is no default `sound` or `text`, participants not listed in the `recipients` section will get a silent push and no notification.

# Advanced Customization

The Layer Notification Service provides for advanced notification configuration via the keys in following table. The table also shows how Layer notification keys map to both APNS and CGM push keys.

| Name                  | APNs Key        | GCM Key         |
|-----------------------|-----------------|-----------------|
| **title**             | title           | title           |
| **text**              | body            | alert           |
| **sound**             | sound           | sound           |
| **category**          | category        | n/a             |
| **title-loc-key**     | title-loc-key   | title_loc_key   |
| **title-loc-args**    | title-loc-args  | title_loc_args  |
| **loc-key**           | loc-key         | body_loc_key    |
| **loc-args**          | loc-args        | body_loc_args   |
| **launch-image**      | launch_image    | n/a             |
| **data**              | data            | data            |

```json
{
    "notification" : {
        "title": "",
        "text": "",
        "sound": "",
        "category": "",
        "title-loc-key": "",
        "title-loc-args": [ "", "" ],
        "loc-key": "",
        "loc-args": [ "", "" ],
        "action-loc-key": "",
        "apns": {
            "launch-image": ""
        },

        "data": {
            "key": "value"
        }
    }
}
```

Documentation on push configuration from the APNS and GCM can be found at the following links:

* [Apple Push Notification Service](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1)
* [Android Google Cloud Notification Service](https://developers.google.com/cloud-messaging/http-server-ref)

> Note that values for iOS badge counts cannot be provided because the pushes are fanned out to all participants. You can enable support for server-side badge count management in the Layer Dashboard if you wish to provide badge counts for your iOS users.
