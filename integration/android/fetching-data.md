# Fetching Data
##Conversations

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

Please view the [Layer Conversations Guide](http://www.layer.com) for a full tutorial on creating, displaying and updating conversations.

## Fetching Messages

`Layer Client` exposes a simple API for fetching all messages for a given conversation. 

```java
// Fetch all messages for a given conversation object
List<Message> messages =  client.getMessages(conversation);
```
