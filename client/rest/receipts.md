# Read and Delivery Receipts

Delivery and Read Receipts are used for three purposes:

1. Notify other users that this user has received or has read the Message.
2. Allows the UI to emphasize Messages that have not been read by the current user.
3. Allows Conversations to track how many unread messages they contain for the current user, for use in UIs for badging or other unread count indicators.

The Message's read state is stored in two Message properties:

1. **is_unread**: This will be changed from true to false once a read receipt has been posted. This value only indicates whether the user associated with this session has read the message.
2. **recipient_status**: This is a JSON hash of participants with a value of either "sent", "read" or "delivered" for each participant.

Additionally, the Conversation.unread_message_count should decrement after changing is_unread using a Read Receipt.

```emphasis
Note, that a Message that has been marked as read cannot be marked as unread. A delivery receipt on a Message that has already been marked as read will have no effect.
```

You can send receipts using:

```request
POST /messages/:message_uuid/receipts
```
```request
POST /announcements/:announcement_uuid/receipts
```

### Parameters

| Name    |  Type | Description |
|---------|-------|-------------|
| **type** | string  | "read" or "delivery" |

### Example

```json
{
  "type": "read"
}
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Layer session-token='TOKEN'' \
      -H 'Content-Type: application/json' \
      -d '{"type": "read"}' \
      https://api.layer.com/messages/MESSAGE_UUID/receipts
```

```console
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.0' \
      -H 'Authorization: Layer session-token='TOKEN'' \
      -H 'Content-Type: application/json' \
      -d '{"type": "read"}' \
      https://api.layer.com/announcements/ANNOUNCEMENT_UUID/receipts
```

### Response `204 (No Content)`

The standard response to this request is simply `204 (No Content)`.
