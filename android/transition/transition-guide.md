#Layer SDK v0.11.0 Transition Guide
## Breaking API Changes

This version of LayerKit includes a substantial change to Message ordering in order to enhance performance. Previous version of LayerKit utilized
a property named `index`, which was a monotonically increasing integer equal to the number of Messages that have been synchronized. From v0.11.0,
the Layer SDK now maintains a new property named `position`. The `position` of a Message is a value that is calculated immediately when the Message is
synchronized and never changes. This greatly improves performance reduces the overhead associated with syncing large amounts of Message content.

#Layer SDK v0.10.0 Transition Guide
##Key API Changes

If you are upgrading from SDK version 0.8.20 or older, there are some architectural changes you need to take into account. Creating a Conversation, Message, and MessagePart are now created with a LayerClient object, and sending a message is done with the Conversation itself:

```java
//There is no change in how the LayerClient is instantiated
LayerClient client = LayerClient.newInstance(Context context, String App_ID, String GCM_Project_Number);

//MessagePart.newInstance(text) becomes
MessagePart part = client.newMessagePart(text);

//Message.newInstance(conversation, parts) is created with the client, and does not require
// a conversation object
Message message = client.newMessage(parts);

//Conversation.newInstance(participants) becomes
Conversation conversation = client.newConversation(participants);

//The conversation sends the message istself, so layerClient.sendMessage(message) becomes
conversation.send(message);
```

##Changes to the Message object
Several methods that used to exist on the LayerClient object have been moved to the Message object. Marking messages as read, deleting messages, and other functionality can now be performed directly on the message object.

```java
//layerClient.markMessageAsRead(message) becomes
message.markAsRead();

//layerClient.deleteMessage(message, deletionMode) becomes
message.delete(deletionMode);

//When creating push notifications, layerClient.setMetadata(message, metadata) becomes
message.setMetadata(metadata);
```

##Changes to the Conversation object
The Conversation object can now manage its own metadata, participant list, and typing indicators.

```java
//layerClient.addParticipants(conversation, participantList) becomes
conversation.addParticipants(participantList);

//layerClient.removeParticipants(conversation, participantList) becomes
conversation.removeParticpants(participantList);

//layerClient.putMetadata(conversation, metadata, doMerge) becomes
conversation.putMetadata(metadata, doMerge);

//layerClient.sendTypingIndicator(activeConversation, TypingIndicator.STARTED) becomes
conversation.send(TypingIndicator.STARTED);

//layerClient.getUnreadMessageCount(conversation) will need to be replaced by a query
public int getUnreadMessageCount(Conversation conversation){
    Query query = Query.builder(Message.class)
        .predicate(new CompoundPredicate(CompoundPredicate.Type.AND,
            new Predicate(Message.Property.CONVERSATION, Predicate.Operator.EQUAL_TO, conversation),
            new Predicate(Message.Property.IS_UNREAD, Predicate.Operator.EQUAL_TO, true)))
        .sortDescriptor(new SortDescriptor(Message.Property.SENT_AT, SortDescriptor.Order.DESCENDING))
        .build();

    List<Message> results = layerClient.executeQuery(query, Query.ResultType.OBJECTS);

    if(results == null)
        return 0;
    return results.size();
}
```

##Querying
One of the biggest changes to SDK version 0.9.+ is Querying. Queries can be executed on a variety of message and conversation properties, and the results can be sorted based on specific fields, allowing for a variety of UI configurations. To learn more about Querying, start with [this guide](/docs/android/integration#querying).
