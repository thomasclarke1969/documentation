# Event Types

When configuring a webhook, you subscribe to the specific events that your service needs.  Each event type corresponds to a specific action that can occur within your Layer application. The current set of available event types are:

| Event | Triggers When |
|--------|--------------|
| **message.sent** | A Message is sent. |
| **message.delivered** | A client acknowledges delivery of a Message. |
| **message.read** | A client marks a Message as read. |
| **message.deleted** | A client deletes a Message (Global deletion mode only). |
| **conversation.created** | A new Conversation is created. |
| **conversation.updated.participants** | A Conversation's set of participants is updated. |
| **conversation.updated.metadata** | A Conversation's metadata is updated. |
| **conversation.deleted** | A Conversation is deleted (Global deletion mode only). |
