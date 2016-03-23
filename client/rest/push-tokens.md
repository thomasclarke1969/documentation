# Push Tokens

When the Client API is used from mobile frameworks (React Native, Cordova, Titanium, etc.), users can register and unregister the native push tokens for APNs and GCM to allow OS notifications for the app, just like with a native Layer mobile app.

```emphasis
Before registering push tokens for your clients, you need to configure your APNS and/or GCE credentials in the [Developer Dashboard](https://developer.layer.com/projects).  Select the Push link in the Developer Dashboard and follow the instructions to enable notifications for Android and/or IO.S
```

### Testing Push Configuration

After configuring your push credentials and registering a push token for your mobile client, you'll
need to send a message from another authenticated user that includes push configuration as you will not receive push
notifications for your own content.

## Registering a Push Token

You can register your device to start receiving push notifications from Layer using:

```request
POST /push_tokens

```

### Parameters

| Name    | Type |  Description  |
|---------|------|---------------|
| **token**           | string | The APNs or GCM push token to register |
| **type**      | string | Either `apns` or `gcm` |
| **device_id** | string | A stable id that identified the device, from the OS. This is only used to avoid duplicate tokens on a device |
| **apns_bundle_id**  | string | (optional) The APNS bundle id corresponding to the token |
| **gcm_sender_id**  | string | (optional) The GCM sender id corresponding to the token |
| **ios_version**  | string | (optional) Should be a version number like `9.0`. This determines how pushes are sent to iOS device, which changed in iOS 8. The new behavior, which allows larger payloads, is the default |

### Example

```json
{
    "token": "105ebe3fcb7e93efda22257caaf5b9c465043f6d0b2abf3bc8ae7c939655e949",
    "type": "apns",
    "device_id": "a7775566-bfbf-11e5-bf72-359a01002888",
    "apns_bundle_id": "com.layer.bundleid",
    "ios_version": "9.0"
}
```

```console
curl  -X POST \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      -H "Content-Type: application/json" \
      -d '{"token": "105ebe3fcb7e93efda22257caaf5b9c465043f6d0b2abf3bc8ae7c939655e949", "type": "apns", "device_id": "a7775566-bfbf-11e5-bf72-359a01002888", "apns_bundle_id": "com.layer.bundleid"}' \
      https://api.layer.com/push_tokens
```

### Response `202 (Accepted)`

Empty Body

## Unregister a Push Token

You can delete a push token using:

```request
DELETE /push_tokens/:device_id
```

### Example

```console
curl  -X DELETE \
      -H "Accept: application/vnd.layer+json; version=1.0" \
      -H "Authorization: Layer session-token='TOKEN'" \
      https://api.layer.com/push_tokens/a7775566-bfbf-11e5-bf72-359a01002888
```

### Response `202 (Accepted)`

Empty Body
