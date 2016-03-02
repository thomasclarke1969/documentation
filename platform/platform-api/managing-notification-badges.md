# Managing Notification Badges

Layer maintains an internal service dedicated to managing accurate badge counts that included in push notifications for iOS users. This is
necessary because iOS does not provide strong guarantees about when an application will be woken up in the background in response to a
remote notification, so computing counts device side delivers a sub-optimal user experience. 

Within the [developer dashboard](https://developer.layer.com/projects) you can configure the badging mode for your application. Available badge modes include:

* Count Unread Converations
* Count Unread Messages
* External Count Only
* Disable Badging

Optionally, the count of Unread Announcements can be summed with the enabled badge modes as well.

## External Badge Counts

Many applications have additional countable objects within their data models that the developer may wish to include in the badge count.
To accommodate these cases, the Platform API exposes endpoints for managing an eternal badge count. The external badge count is an
integer value that is summed with the appropriate messaging counts and sent along with each push notification that originates from Layer.

## Setting a User's Badge

You can set an external unread count for a particular user using:

```request
PUT https://api.layer.com/apps/:app_uuid/users/:user_id/badge
Content-Type: application/json
```

### Parameters

| Name         |    Type     |  Description  |
|--------------|-------------|---------------|
| **external_unread_count** | integer | The number of external countable entities to include with the badge. |

### Example

```json
{ "external_unread_count": 13 }
```

### Successful Response

```text
204 (No Content)
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"external_unread_count": 12}' \
      https://api.layer.com/apps/APP_UUID/users/badge
```

## Reading a User's Badge

You can read the badge for a particular user using:

```request
GET https://api.layer.com/apps/:app_uuid/users/:user_id/badge
Content-Type: application/json
```

### Successful Response

```json
{ "external_unread_count": 13, "unread_conversation_count": 10, "unread_message_count": 50 }
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/users/1234/badge
```
