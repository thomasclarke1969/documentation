# Deleting Conversations

You can delete Conversations using the following endpoint.

```request
DELETE /apps/:app_uuid/conversations/:conversation_uuid
```

### Successful Response

```text
204 (No Content)
```

NOTE: This delete applies _globally_ to all members of the Conversation, across all of their devices.
