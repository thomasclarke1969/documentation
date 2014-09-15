# Metadata

Metadata is a flexible mechanism by which applications can attach contextually relevant information to conversations or messages. Applications do this by associating key-value stores of information to any [LYRConversation](api/ios#lyrconversation) or [LYRMessage](api/ios#lyrmessage) object. Layer supports two distinct types of metadata:

  * **Participant Metadata** - Information that is synchronized among all participants in a conversation or recipients of a message.
  * **Private Metadata** - Information that is private to a given participant, but synchronized among all of their devices.

Metadata may be any mix of nested dictionaries, arrays, strings, booleans, integers, longs, doubles, or NULL. 

```objectivec
// Adds metadata to an object
- (void)setMetadata:(NSDictionary *)metadata forObject:(id)object;

// Updates any existing metadata for an object
- (void)updateMetadata:(NSDictionary *)metadata forObject:(id)object merge:(BOOL)mergeWithExistingValue;
```

The following demonstrates how to attach latitude and longitude info to a new conversation.

```objectivec
// Adds location metadata to a new conversation object
LYRConversation *conversation = [client conversationWithParticipants:@[@"USER_IDENTIFIER"]];
NSDictionary *metadata = @{@"lat"   :   @"37.7833",
                           @"lon"   :   @"122.4167"}; 
[layerClient setMetadata:metadata forObject:conversation];
```

A common use case for Private metadata is a 'Favorites' feature. The following demonstrates how an application could attach metadata to implement a favorites feature. 

```objectivec
// Adds location metadata to a new conversation object
LYRConversation *conversation = [LYRConversation conversationWithParticipants:@[@"USER-IDENTIFIER"]];
NSDictionary *metadata = @{@"lat"   :   @"37.7833",
                           @"lon"   :   @"122.4167"};
[layerClient setMetadata:metadata onObject:conversation];
```