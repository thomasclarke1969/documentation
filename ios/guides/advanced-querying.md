# Advanced Querying
LayerKit provides a flexible and expressive interface with which applications can query for messaging content. Querying is performed with an `LYRQuery` object. To demonstrate a simple example, the following queries LayerKit for the latest 20 messages in the given conversation.

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" predicateOperator:LYRPredicateOperatorIsEqualTo value:self.conversation];
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"position" ascending:NO]];
query.limit = 20;
query.offset = 0;

NSError *error = nil;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (messages) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

## Examples

The following examples demonstrate multiple common queries that can be utilized by applications.

## Conversation Queries

### Fetching all Conversations

```objectivec
// Fetches all LYRConversation objects
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];

NSError *error = nil;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (conversations) {
    NSLog(@"%tu conversations", conversations.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

### Fetching a Conversation with a specific identifier

```objectivec
// Fetches conversation with a specific identifier
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"identifier" predicateOperator:LYRPredicateOperatorIsEqualTo value:identifier];
NSError *error = nil;
LYRConversation *conversation = [[self.layerClient executeQuery:query error:&error] firstObject];
```

### Fetching Conversations with a specific set of Participants

```objectivec
// Fetches all conversations between the authenticated user and the supplied user
NSArray *participants = @[ self.client.authenticatedUserID, @"<USER_ID>" ];
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"participants" predicateOperator:LYRPredicateOperatorIsEqualTo value:participants];

NSError *error = nil;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu conversations with participants %@", conversations.count, participants);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

## Message Queries

### Fetching all Messages

```objectivec
// Fetches all LYRMessage objects
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (messages) {
    NSLog(@"%tu messages", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

### Counting Unread Messages

```objectivec
// Fetches the count of all unread messages for the authenticated user
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];

// Messages must be unread
LYRPredicate *unreadPredicate =[LYRPredicate predicateWithProperty:@"isUnread" predicateOperator:LYRPredicateOperatorIsEqualTo value:@(YES)];

// Messages must not be sent by the authenticated user
LYRPredicate *userPredicate = [LYRPredicate predicateWithProperty:@"sender.userID" predicateOperator:LYRPredicateOperatorIsNotEqualTo value:self.client.authenticatedUserID];

query.predicate = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeAnd subpredicates:@[unreadPredicate, userPredicate]];
query.resultType = LYRQueryResultTypeCount;
NSError *error = nil;
NSUInteger unreadMessageCount = [self.client countForQuery:query error:&error];
```

### Fetching all Messages in a specific Conversation

```objectivec
// Fetches all messages for a given conversation
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" predicateOperator:LYRPredicateOperatorIsEqualTo value:self.conversation];
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES]];

NSError *error = nil;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (messages) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

### Fetching Messages sent in the last week

```objectivec
// Fetches all messages sent in the last week
NSDate *lastWeek = [[NSDate date] dateByAddingTimeInterval:-60*60*24*7]; // One Week Ago
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"sentAt" predicateOperator:LYRPredicateOperatorIsGreaterThan value:lastWeek];

NSError *error = nil;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (messages) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

### Fetching all Messages containing PNGs
```objectivec
// Fetch all messages containing 
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"parts.MIMEType" predicateOperator:LYRPredicateOperatorIsEqualTo value:@"image/png"];

NSError *error = nil;
NSOrderedSet *messages = [self.layerClient executeQuery:query error:&error];
if (messages) {
    NSLog(@"%tu messages with image/png", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

## MessagePart Queries

### Fetching MessageParts containing PNGs

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessagePart class]];
query.predicate = [LYRPredicate predicateWithProperty:@"MIMEType" predicateOperator:LYRPredicateOperatorIsEqualTo value:@"image/png"];

NSError *error = nil;
NSOrderedSet *messageParts = [self.layerClient executeQuery:query error:&error];
if (messageParts) {
    NSLog(@"%tu messageParts in conversation with PNGs", messageParts.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

## Compound Predicates

For more sophisticated queries, applications can utilize the `LYRCompoundQuery` object to specify multiple constraints for a single query. Compound predicates consist of an array of `LYRPredicate` objects which represent individual constraints, in addition to a conjunction operator represented by an `LYRCompoundPredicateType`.

The following demonstrates a compound predicate which will constrain the result set to `LYRMessage` objects that conform to the following criteria:

1. The `conversation` property is equal to the supplied `LYRConversation` object.
2. The `sender.userID` property is equal to the supplied `<USER_ID>` value.

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
LYRPredicate *conversationPredicate = [LYRPredicate predicateWithProperty:@"conversation" predicateOperator:LYRPredicateOperatorIsEqualTo value:self.conversation];
LYRPredicate *userPredicate = [LYRPredicate predicateWithProperty:@"sender.userID" predicateOperator:LYRPredicateOperatorIsEqualTo value:@"<USER_ID>"];
query.predicate = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeAnd subpredicates:@[userPredicate, conversationPredicate]];

NSUInteger countOfMessages = [self.client countForQuery:query error:&error];
if (countOfMessages != NSUIntegerMax) {
    NSLog(@"%tu messages matching compound predicate", countOfMessages);
} else {
    NSLog(@"Query failed with error %@", error);
}
```
## Metadata Queries
Running queries on metadata allows developers to search for conversations that contain specific properties, such as background color or conversation titles. The following examples demonstrate the how powerful querying on metadata can be. 

```objectivec
NSDictionary *bigDictionary = @{@"1" : @{@"2" : @"Hello",
                                       @"3" : @{@"4" : @"Hola",
                                                   @"5" : @"Hey"}},
                           @"6" : @"Hi"};
LYRConversation *convoWithNestedDictonary = [layerClient newConversationWithParticipants:participants options: @{@"first" : @{@"second" : @{@"third" : @"NestedResult"}}} error:nil];
LYRConversation *blueConvo = [layerClient newConversationWithParticipants:participants options:@{@"backgroundColor" : @"blue"} error:nil];
LYRConversation *redConvoWithTitle = [layerClient newConversationWithParticipants:participants options:@{@"backgroundColor" : @"red", @"title" : @"testUser"} error:nil];
LYRConversation *convoWithDictionary = [layerClient newConversationWithParticipants:participants options:bigDictionary error:nil];
```
### Fetching conversation with specific metadata
The following demonstrates a predicate which will constrain the result set to `LYRConversation` objects that conform to having a metadata property where the dictionary first.second.third has the value of "NestedResult". 

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"metadata.first.second.third" predicateOperator:LYRPredicateOperatorIsEqualTo value:@"value"];
NSOrderedSet *conversations = [self executeQuery:query error:&error]; // this will return convoWithNestedDictonary
```
### Fetching multiple conversations with specific metadata

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"metadata.backgroundColor" predicateOperator:LYRPredicateOperatorIsIn value:@[@"red", @"blue"]];
NSOrderedSet *conversations = [self executeQuery:query error:&error]; // this will return blueConvo and redConvoWithTitle
```
### Fetching conversations with specific metadata using a compound predicate

The following demonstrates a compound predicate which will constrain the result set to `LYRMessage` objects that conform to the following criteria:

1. The conversation metadata contains either the red or blue value.
2. The metadata property `title` has the value "testUser".

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
LYRPredicate *predicate1 = [LYRPredicate predicateWithProperty:@"metadata.backgroundColor" predicateOperator:LYRPredicateOperatorIsIn value:@[@"red", @"blue"]];
LYRPredicate *predicate2 = [LYRPredicate predicateWithProperty:@"metadata.title" predicateOperator:LYRPredicateOperatorIsEqualTo value:@"testUser"];
LYRCompoundPredicate *compound = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeAnd subpredicates:@[predicate1, predicate2]];
query.predicate = compound;

NSOrderedSet *conversations = [self executeQuery:query error:&error]; // this will give you redConvoWithTitle
```
### Fetching conversations with specific dictionary in metadata
```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"metadata" predicateOperator:LYRPredicateOperatorIsEqualTo value:bigDictionary];
NSOrderedSet *conversations = [self executeQuery:query error:&error]; // this will return convoWithDictionary
```
