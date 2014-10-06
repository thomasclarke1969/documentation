#Fetching Data
##Fetching Messages

The [LYRClient](/docs/api/ios#lyrclient) object exposes a simple API for fetching all messages for a given conversation. This method will return an `NSOrderedSet of messages in descending order.

```objectivec
// Fetch all messages for a given conversation object
NSOrderedSet *messages = [layerClient messagesForConversation:conversation];
```

##Fetching Conversations

[LYRClient](/docs/api/ios#lyrclient) exposes a simple API for fetching conversations for an authenticated user. In order to fetch all conversations, call `conversationForIdentifiers:`, passing nil for identifiers.  

```objectivec
// Returns an NSOrderedSet of all conversations for the signed in user
NSSet *conversations = [layerClient conversationsForIdentifiers:nil];
```

Correspondingly, to fetch a specific conversation, that conversation’s identifier must be passed.

```objectivec
// Returns an NSOrderedSet of all conversations for the given identifiers
NSSet *conversations = [layerClient conversationsForIdentifiers:[NSSet setWithObject:@"CONVERSATION-IDENTIFER"]];
```
