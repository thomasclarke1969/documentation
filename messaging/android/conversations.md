# Conversations

The `Conversation` object coordinates all messaging within the Layer service. It represents a stream of messages that are synchronized between all participants of a conversation. All messages sent with the Layer SDK must be sent within the context of a conversation.

`Conversation` objects are created by calling `Conversation.newInstance()`. This method takes a list of participant identifiers.  As Layer Authentication allows you to represent users within the Layer service via your backend’s federated identifier, participants are represented with those same user identifiers.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = Conversation.newInstance(Arrays.asList("USER-IDENTIFIER"));
```

```emphasis
Note, that it is not necessary to include the currently authenticated user in the participant array. They are added to new conversations automatically when the first message gets sent to that conversation.
```

## Add/Remove Participants

Once a conversation has been created, particiapnt lists remain mutable, meaning participants can be both added and removed. The Layer servivce does not enforce any ownership, so any client can both add and remove participants.

```java
// Adds a participant to a given conversation
client.addParticipants(conversation, Arrays.asList("948374848"));

// Removes a participant from a given conversation
client.removeParticipants(conversation, Arrays.asList("948374848"));
```
## Fetching Data

`Layer Client` exposes a simple API for fetching conversations for an authenticated user. In order to fetch all conversations, call `getConversations()`.

```java
// Returns an List of all conversations for the currently authenticated user
List<Conversation> conversations = client.getConversations();
```
Correspondingly, to fetch a specific conversation, that conversation’s identifier must be passed.

```java
// Returns a specific conversation
Conversation conversation = client.getConversation(someConversationIdentifier);
```
