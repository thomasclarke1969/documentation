# Conversations

The [LYRConversation](/docs/api/ios#lyrconversation) object coordinates all messaging within the Layer service. It represents a stream of messages that are synchronized among all participants of a conversation. All messages sent with LayerKit must be sent within the context of a conversation.

[LYRConversation](/docs/api/ios#lyrconversation) objects are created by calling the class method `conversationWithParticipants:`. The participants array is simply an array of user identifiers. As [Layer Authentication](/docs/resources#authentication-guide) allows you to represent users within the Layer service via your backend’s identifier for that user, a participant in a conversation is represented with that same user identifier. 

```objectivec
// Creates and returns a new conversation object with a participant identifier
LYRConversation *conversation = [LYRConversation conversationWithParticipants:@[@"USER-IDENTIFIER"]];
```

```emphasis
Note, that it is not necessary to include the currently authenticated user in the participant array. They are implicit in all new conversations.***
```

##Participants

Once a conversation has been created, participant lists remain mutable, meaning participants can be added or removed. The Layer service does not enforce ownership of conversations so any client can both add or remove participants from a conversation.

```objectivec
// Adds a participant to an existing conversation
// New participants will gain access to all previous messages in a conversation.
[layerClient addParticipants:@[@"USER-IDENTIFIER"] toConversation:conversation error:nil];

// Removes a participant from an existing conversation
// Removed participants will only lose access to future content. They will retain access
// to the conversation and all preceding content.
[layerClient removeParticipants:@[@"USER-IDENTIFIER"] fromConversation:conversation error:nil];
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
