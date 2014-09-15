# Metadata

****Please Note, Metadata Functionality is not yet exposed in the Layer SDK****

Metadata is a flexible mechanism by which applications can attach contextually relevant information to conversations and messages. Applications do this by associating key-value stores of information, called metadata, to any `Conversation` or `Message` object. Layer supports two distinct types of metadata:

  * Participant Metadata - Information that is synchronized among participants in a Conversation.
  * Private Metadata - Information that is private to a given participant, but synchronized among all of their devices.

Metadata may be any mix of nested dictionaries, arrays, strings, booleans, integers, longs, doubles, or NULL. 
 

```objectivec
// Adds metadata to an object
public abstract void mergeMetadata(Map<String, Parcelable> metadata, Map<String, Parcelable> userInfo, Object object);

// Removes any existing metadata for an object
public abstract void removeMetadata(List<String> metadataKeys, List<String> userInfoKeys, Object object);
```

The following demonstrates how to attach latitude and longitude info to a new conversation.

```java
List<Conversation> conversation = client.getConversations(identifier);
HashMap metadata = new HashMap<String, String>();
metadata.put("lat", "25.43567");
metadata.put("lon", "123.54383");
client.mergeMetadata(metadata, null, conversation);
```

A common use case for Private metadata is a 'Favorites' feature. The following demonstrates how you could attach boolean metadata to implement a favorites feature. 

```java
List<Conversation> conversation = client.getConversations(identifier);
HashMap metadata = new HashMap<String, String>();
location.put("favorite", true);
client.mergeMetadata(null, metadata, conversation);
```