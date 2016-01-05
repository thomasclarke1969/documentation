# Querying
Layer provides a flexible and expressive interface with which applications can query for messaging content. Querying is performed with a Query object and can act on Conversations, Messages, or Announcements.

```emphasis
Queries execute on the local database, and will only return results for conversations and messages where the authenticated user is a participant. Queries will **not** return empty conversations - a conversation must have at least one message in it in order to be written to the local database. 
```

To demonstrate a simple example, the following queries Layer for the latest 20 messages in the given conversation.

```java
//Return 20 most recent messages in myConversation
Query query = Query.builder(Message.class)
    .predicate(new Predicate(Message.Property.CONVERSATION, Predicate.Operator.EQUAL_TO, myConversation))
    .sortDescriptor(new SortDescriptor(Message.Property.SENT_AT, SortDescriptor.Order.DESCENDING))
    .limit(20)
    .build();

List<Message> recentMessages = layerClient.executeQuery(query, Query.ResultType.OBJECTS);
```

## Constructing a query
The Query object is built with a Class object representing the class upon which the query will be performed. Querying is available on classes that conform to the Queryable protocol. Currently, `Conversation`, `Message`, and `Announcement` are the only classes which conform to the protocol.

```java
Query query = Query.builder(Conversation.class).build();
```

## Applying constraints
The Predicate object allows applications to apply constraints to a query result set. Constraints are expressed in terms of a public property (such as CREATED_AT or IS_UNREAD), an operator (such as 'is equal to' or 'is greater than or equal to'), and a comparison value.

The following Predicate will constrain the query to Message objects whose conversation property is equal to the supplied conversation object.

```java
Query query = Query.builder(Message.class)
    .predicate(new Predicate(Message.Property.CONVERSATION, Predicate.Operator.EQUAL_TO, myConversation))
    .build();
```

Fields that support querying can be found in Message.Property and Conversation.Property, respectively.

## Sorting results
Applications can describe the sort order in which the query results should be returned. This is done by setting a value for the sortDescriptor property in the Query builder.

The following sort descriptor asks that results be returned in ascending order based on the position property of the Message objects.

```java
Query query = Query.builder(Message.class)
    .sortDescriptor(new SortDescriptor(Message.Property.POSITION, SortDescriptor.Order.ASCENDING))
    .build();
```

## Limits and offsets
To facilitate pagination, queries may be further constrained by applying limit and offset values. The limit configures the maximum number of objects to be returned when the query is executed. The offset configures the number of rows that are to be skipped in the result set before results are returned.

```java
Query query = Query.builder(Conversation.class)
    .limit(20)
    .offset(0)
    .build();
```

## Result types
Query results can be returned as fully realized object instances, object identifiers, or as an aggregate count of the total number of objects matching the query. Applications determine their desired return type by optionally passing in a value to LayerClient.executeQuery(). The default value is Query.ResultType.OBJECTS.

```java
// Fully realized objects
List<Message> results = (List<Message>)layerClient.executeQuery(query, Query.ResultType.OBJECTS);

// Object identifiers
List<URI> results = (List<URI>)layerClient.executeQuery(query, Query.ResultType.IDENTIFIERS);

// Count of objects
Long resultArray = layerClient.executeForCount(query);
```


## Executing The Query
Queries are executed by calling executeQuery on a LayerClient object. The method takes a Query object. If successful, the method will return a List of object which represent the results of the query.

```java
//Return up to 10 conversations with unread messages, newest first
Query query = Query.builder(Conversation.class)
    .predicate(new Predicate(Conversation.Property.HAS_UNREAD_MESSAGES, Predicate.Operator.EQUAL_TO, true))
    .sortDescriptor(new SortDescriptor(Conversation.Property.LAST_MESSAGE_RECEIVED_AT, SortDescriptor.Order.DESCENDING))
    .limit(10)
    .build();

List<Conversation> results = layerClient.executeQuery(query, Query.ResultType.OBJECTS);
```

```emphasis
For many more query examples, please see the [Advanced Querying Guide](/docs/android/guides#advanced-querying).
```
