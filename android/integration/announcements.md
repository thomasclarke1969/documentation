#Announcements
Announcements are a special `Message` type sent to a list of users or all users of the application that will arrive outside of the context of a conversation (the conversation property will be null). Announcements can only be sent through the [Platform API](https://developer.layer.com/docs/platform).

## Fetching Announcements
You can use the following queries to fetch announcements
```java
// Fetch all Announcements
Query query = Query.builder(Announcement.class)
    .sortDescriptor(new SortDescriptor(Announcement.Property.POSITION, SortDescriptor.Order.ASCENDING))
    .build();
List<Announcement> announcements = layerClient.executeQuery(query, Query.ResultType.OBJECTS);

// Fetch all unread Announcements
Query query = Query.builder(Announcement.class)
    .predicate(new Predicate(Announcement.Property.IS_UNREAD, Predicate.Operator.EQUAL_TO, true))
    .sortDescriptor(new SortDescriptor(Message.Property.POSITION, SortDescriptor.Order.ASCENDING))
    .build();

// Count of objects
Query query = Query.builder(Announcement.class)
    .sortDescriptor(new SortDescriptor(Announcement.Property.POSITION, SortDescriptor.Order.ASCENDING))
    .build();
List<Integer> resultArray = (List<Integer>)layerClient.executeQuery(query, Query.ResultType.COUNT);
int count = resultArray.get(0);
```

## Marking an Announcement as read
The following code shows you how to mark an `Announcement` as read
```java
announcement.markAsRead();
```
