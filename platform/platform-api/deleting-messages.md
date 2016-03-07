# Deleting Messages

Messages will sometimes need to be deleted, and this can be done by calling `DELETE` on the message URL.

```emphasis
**NOTE**
This causes the message to be destroyed for all recipients.
```

```request
DELETE /apps/:app_uuid/conversations/:conversation_uuid/messages/:message_uuid
```

```console
curl  -X DELETE \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      https://api.layer.com/apps/APP_UUID/conversations/CONVERSATION_ID/messages/MESSAGE_ID
```

### Successful Response

```text
204 (No Content)
```
