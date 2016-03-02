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
integer value that is summed with the appropriate messaging counts and sent along with each push notification that originates from Layer. When a badge
is set for a user with one or more iOS devices, a push notification is immediately dispatched to update the badge with the latest state. As messaging 
tends to be a faster moving data source, Layer recommends utilizing this push to maintain an accurate badge rather than reading the Layer badge
and sending external pushes that include a badge from a secondary source.

## Setting a User's Badge

You can set an external unread count for a particular user using:

```request
PUT https://api.layer.com/apps/:app_uuid/users/:user_id/badge
Content-Type: application/json
```

Note that a push notification is immediately dispatched to all of the specified user's iOS device to set the new badge value.

### Parameters

| Name         |    Type     |  Description  |
|--------------|-------------|---------------|
| **external_unread_count** | integer | The number of external countable entities to include with the badge. |

### Example

```json
{ "external_unread_count": 13 }
```

### Successful Response (200 OK)

```json
{ "external_unread_count": 13, "unread_conversation_count": 10, "unread_message_count": 50 }
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

Note that while you can read the badge values at any time, it is not recommended that you attempt to reflect Layer badging
values in externally sent push notifications as messaging data is fast moving.

### Successful Response (200 OK)

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
