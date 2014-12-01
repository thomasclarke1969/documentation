#Fetching Data

The [LYRQuery](/docs/api/ios#lyrquery) object exposes a simple API for fetching all messages or conversations given a particular criteria.

##Fetching Messages

To fetch all the message for a given conversation use:

```objectivec
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:self.conversation];
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"index" ascending:YES]];

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

Correspondingly, to fetch a specific message, that message’s identifier must be passed.

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"identifier" operator:LYRPredicateOperatorIsEqualTo value:identifier];
LYRMessage *message = [[self.layerClient executeQuery:query error:nil] lastObject];
```

##Fetching Conversations

To fetch all the conversations for the currently authenticated user:

```objectivec
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];

NSError *error;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu conversations", conversations.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

Correspondingly, to fetch a specific conversation, that conversation’s identifier must be passed.

```objectivec
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"identifier" operator:LYRPredicateOperatorIsEqualTo value:identifier];
LYRConversation *conversation = [[self.layerClient executeQuery:query error:nil] firstObject];
```

To fetch all the conversation for given participants
```objectivec
NSMutableSet *set = [NSMutableSet setWithObjects:@"USER-1", @"USER-2", nil];
[set addObject:self.layerClient.authenticatedUserID];
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"participants" operator:LYRPredicateOperatorIsEqualTo value:set];
return [[self.layerClient executeQuery:query error:nil] lastObject];
```
