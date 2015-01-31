# Advanced Querying

Layer provides a flexible and expressive interface with which applications can query for messaging content. Querying is performed with an Query object. To demonstrate a simple example, the following queries Layer for the latest 20 messages in the given conversation.

```java
Query query = Query.builder(Message.class)
    .predicate(new Predicate(Message.Property.CONVERSATION, Predicate.Operator.EQUAL_TO, myConversation))
    .sortDescriptor(new SortDescriptor(Message.Property.SENT_AT, SortDescriptor.Order.DESCENDING))
    .limit(20);

List<Conversation> results = layerClient.executeQuery(query);
```

##Examples

The following examples demonstrate multiple common queryies that can be utilized by applications.

###Conversation Queries

####Fetching all Conversations
```java
//Fetch all conversations, sorted by latest message received first
Query query = Query.builder(Conversation.class)
    .sortDescriptor(new SortDescriptor(Conversation.property.LAST_MESSAGE_RECEIVED_AT, SortDescriptor.Order.DESCENDING));

List<Conversation> results = layerClient.executeQuery(query);
```

####Fetching a Conversation with a specific identifier
```java
// Fetches conversation with a specific identifier
Query query = Query.builder(Conversation.class)
    .predicate(new Predicate(Conversation.Property.ID, Predicate.Operator.EQUAL_TO, identifer));

List<Conversation> results = layerClient.executeQuery(query);
```

####Fetching Conversations with a specific set of Participants
```java
// Fetches all conversations between these users
List<String> participants = Arrays.asList(layerClient.getAuthenticatedUserId(), "User 1", "User 2");

Query query = Query.builder(Conversation.class)
    .predicate(new Predicate(Conversation.Property.PARTICIPANTS, Predicate.Operator.IN, participants));

List<Conversation> results = layerClient.executeQuery(query);
```

###Message Queries

####Fetching all Messages
```java
// Fetches all Message objects in random order
Query query = Query.builder(Message.class);

List<Message> results = layerClient.executeQuery(query);
```

####Counting Unread Messages
```java
// Fetches the count of all unread messages for the authenticated user
Query query = Query.builder(Message.class)
    .predicate(new Predicate(Message.Property.IS_UNREAD, Predicate.Operator.EQUAL_TO, true));

List<int> resultArray = (List<int>)layerClient.executeQuery(query, Query.ResultType.COUNT);
int count = resultArray.get(0);
```

####Fetching all Messages in a specific Conversation
```java
// Fetches all messages for a given conversation
Query query = Query.builder(Message.class)
    .predicate(new Predicate(Message.Property.CONVERSATION, Predicate.Operator.EQUAL_TO, myConversation))
    .sortDescriptor(new SortDescriptor(Message.Property.SENT_AT, SortDescriptor.Order.DESCENDING));

List<Message> results = layerClient.executeQuery(query);
```

####Fetching Messages sent in the last week
```java
long DAY_IN_MS = 1000 * 60 * 60 * 24;
Date lastWeek = new Date(System.currentTimeMillis() - (7 * DAY_IN_MS))

Query query = Query.builder(Message.class)
    .predicate(new Predicate(Message.Property.SENT_AT, Predicate.Operator.GREATER_THAN_OR_EQUAL_TO, lastWeek))
    .sortDescriptor(new SortDescriptor(Message.Property.SENT_AT, SortDescriptor.Order.DESCENDING));

List<Message> results = layerClient.executeQuery(query);
```

###Compound Predicates
For more sophisticated queries, applications can utilize the CompoundQuery object to specify multiple constraints for a single query. Compound predicates consist of an array of Predicate objects which represent individual constraints, in addition to a conjunction operator represented by an CompoundPredicate.Type.

The following demonstrates a compound predicate which will constrain the result set to Message objects that conform to the following criteria:

1. The conversation property is equal to the supplied Conversation object.
2. The sentByUserID property is equal to the supplied userId value.

```java
Query query = Query.builder(Message.class)
    .predicate(new CompoundPredicate(CompoundPredicate.Type.AND,
        new Predicate(Message.Property.CONVERSATION, Predicate.Operator.EQUAL_TO, conversation),
        new Predicate(Message.Property.SENT_BY_USER_ID, Predicate.Operator.EQUAL_TO, userID)))
    .sortDescriptor(new SortDescriptor(Message.Property.SENT_AT, SortDescriptor.Order.DESCENDING));

List<Message> results = layerClient.executeQuery(query);
```