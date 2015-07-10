# Advanced Querying
LayerKit provides a flexible and expressive interface with which applications can query for messaging content. Querying is performed with an `LYRQuery` object. To demonstrate a simple example, the following queries LayerKit for the latest 20 messages in the given conversation.

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" predicateOperator:LYRPredicateOperatorIsEqualTo value:self.conversation];
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES]];
query.limit = 20;
query.offset = 0;

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
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

NSError *error;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
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
LYRConversation *conversation = [[self.layerClient executeQuery:query error:nil] firstObject];
```

### Fetching Conversations with a specific set of Participants

```objectivec
// Fetches all conversations between the authenticated user and the supplied user
NSArray *participants = @[self.client.authenticatedUserID, @"<USER_ID>"];
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"participants" predicateOperator:LYRPredicateOperatorIsEqualTo value:participants];

NSError *error;
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
if (!error) {
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
NSUInteger unreadMessageCount = [self.client countForQuery:query error:nil];
```

### Fetching all Messages in a specific Conversation

```objectivec
// Fetches all messages for a given conversation
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" predicateOperator:LYRPredicateOperatorIsEqualTo value:self.conversation];
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES]];

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
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

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
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

NSError *error;
NSOrderedSet *messages = [self.layerClient executeQuery:query error:&error];
if (!error) {
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

NSError *error;
NSOrderedSet *messageParts = [self.layerClient executeQuery:query error:&error];
if (!error) {
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
if (!error) {
    NSLog(@"%tu messages matching compound predicate", countOfMessages);
} else {
    NSLog(@"Query failed with error %@", error);
}
```
