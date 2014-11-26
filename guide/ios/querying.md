#Querying
LayerKit provides a flexible and expressive interface with which applications can query for messaging content. Querying is performed with an `LYRQuery` object. To demonstrate a simple example, the following queries LayerKit for the latest 20 messages in the given conversation.

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:self.conversation];
query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"index" ascending:YES]];
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

##Constructing A Query
An instance of an `LYRQuery` object is initialized with a `Class` object representing the class upon which the query will be performed. Querying is available on classes that conform to the `LYRQueryable` protocol. Currently, `LYRConversation` and `LYRMessage` are the only classes which conform the protocol.

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
```

##Applying Constraints
The `LYRPredicate` object allows applications to apply constraints to a query result set. Constraints are expressed in terms of a public property (such as `createdAt` or `isUnread`), an operator (such as 'is equal to' or 'is greater than or equal to'), and a comparison value.

The following `LYRPredicate` will constrain the query result set to `LYRMessage` objects whose `conversation` property is equal the supplied conversation object.

```
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:self.conversation];
```

Properties that support querying are identified by the `LYR_QUERYABLE_PROPERTY` macro.

##Sorting Results
Applications can describe the sort order in which the query results should be returned. This is done by setting a value for the `sortDescriptors` property on `LYRQuery` objects. This value must be an array of `NSSortDescriptor` instances.

The following sort descriptor asks that results be returned in ascending order based on the `index` property of the `LYRMessage` objects.

```
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"index" ascending:YES]];
```

##Limits and Offsets
To facilitate pagination, queries may be further constrained by applying a limit and offset value. The limit onfigures the maximum number of objects to be returned when the query is executed. The offset configures the number of rows that are to be skipped in the result set before results are returned.

```
query.limit = 20;
query.offset = 0;
```

## Results Type
Query results can be returned as fully realized object instances, object identifiers, or as an aggregate count of the total number of objects matching the query. Applications determine their desired return type by optionally setting a value for the `resultsType` property on the `LYRQuery` object. The default value is `LYRQueryResultsTypeObjects`.

```
// Fully realized objects
query.resultsType = LYRQueryResultTypeObjects;

// Object Identifers
query.resultsType = LYRQueryResultsTypeIdentifiers;

// Count of Objects
query.resultsType = LYRQueryResultsTypeCount;
```


##Executing The Query
Queries are executed by calling `executeQuery:error:` on `LYRClient`. The method takes an `LYRQuery` object and a pointer to an `NSError` object. If successful, the method will return an `NSOrderedSet` of objects which represent the results of the query. If an error occurs, the supplied error pointer will be set to an error object describing why execution failed.

```
NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

Additionally, when querying for results with a `resultsType` of `LYRQueryResultsTypeCount`, `LYRClient` declares a convenience method that returns an `NSUInteger`, `countForQuery:error:`.

```
NSError *error;
NSUInteger countOfMessages = [self.client countForQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages in conversation", countOfMessages);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

##Compound Predicates
For more sophisticated queries, applications can utilize the `LYRCompoundQuery` object to specify multiple constraints for a single query. Compound predicates consist of an array of `LYRPredicate` objects which represent individual constraints, in addition to a conjunction operator represented by an `LYRCompoundPredicateType`.

The following demonstrates a compound predicate which will constrain the result set to objects that conform to the following criteria:

1. The `conversation` property is equal to the supplied `LYRConversation` object
2. The `sentByUserID` property is equal to the supplied `<USER_ID>` value.

```
LYRPredicate *conversationPredicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:self.conversation];
LYRPredicate *userPredicate = [LYRPredicate predicateWithProperty:@"sentByUserID" operator:LYRPredicateOperatorIsEqualTo value:@"<USER_ID>"];
LYRCompoundPredicate *predicate = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeAnd subpredicates:@[userPredicate, conversationPredicate]];
```

## Examples

### All Conversations

```
// Fetches all `LYRConversation` objects
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];

NSError *error;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu conversations", conversations.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

### All Messages

```
// Fetches all `LYRMessage` objects
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

###Unread Message Count

```
// Fetches the count of all unread messages for the authenticated user
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];

// Messages must be unread
LYRPredicate *unreadPredicate =[LYRPredicate predicateWithProperty:@"isUnread" operator:LYRPredicateOperatorIsEqualTo value:@(YES)];

// Messages must not be sent by the authenticated user
LYRPredicate *userPredicate = [LYRPredicate predicateWithProperty:@"sentByUserId" operator:LYRPredicateOperatorIsNotEqualTo value:self.client.authenticatedUserID];
query.predicate = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeAnd subpredicates:@[unreadPredicate, userPredicate]];
query.resultType = LYRQueryResultTypeCount;
NSUInteger unreadMessageCount = [self.client countForQuery:query error:nil];
```

### Messages For Conversation

```
// Fetches all messages for a given conversation
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

### Conversations With A Specific User

```
// Fetches all conversations between the supplied user and the authenticated user
NSArray *participants = @[self.client.authenticatedUserID, @"<USER_ID>"];
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"participants" operator:LYRPredicateOperatorIsEqualTo value:participants];

NSError *error;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu conversations with participants %@", conversations.count, participants);
} else {
    NSLog(@"Query failed with error %@", error);
}

```

### Messages From Last Week

```
// Fetches all messages sent in the last week
NSDate *lastWeek = [[NSDate date] dateByAddingTimeInterval:-60*60*24*7]; // One Week Ago
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"sentAt" operator:LYRPredicateOperatorIsGreaterThan value:lastWeek];

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

#LYRQueryController
The `LYRQueryController` class can be used to efficiently manage the results from an `LYRQuery` and provide that data to be used in a `UITableView` or `UICollectionView`. The object is similar in concept to an `NSFetchedResultsController` and provides the following functionality:

1. Executes the actual query and caches the result set.
2. Monitors changes to objects in the result set and reports those changes to its delegate (see `LYRQueryControllerDelegate`).
3. Listens for newly created objects that fit the query criteria and notifies it's delegate on creation.

The following demonstrates constructing a `LYRQueryController` that can be used to display a list of `LYRConversation` objects in a `UITableView`.

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
LYRQueryController * queryController = [self.client queryControllerWithQuery:query];
queryController.delegate = self;
NSError *error = nil;
BOOL success = [queryController execute:&error];
if (success) {
    NSLog(@"Query fetched %tu conversation objects", [queryController numberOfObjectsInSection:0]);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

In order to acquire the number of objects in a result set, applications can call `numberOfObjectsInSection:`. This method can be used for the return value in the `UITableViewDataSource` method `numberOfRowsInSection:`

```
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.queryController numberOfObjectsInSection:section];
}
```

In order to acquire an object for a given index, applications can call `objectAtIndexPath:`. This method can be used in your implementation of `cellForRow:atIndexPath:` in order to acquire the proper `LYRConversation` object that is to be displayed.

```
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    LYRConversation *conversation = [self.queryController objectAtIndexPath:indexPath];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"<CELL_IDENTIFIER>"];
    /**
     Configure cell for conversation
     */
    return cell;
}
```

#LYRQueryControllerDelegate
The `LYRQueryController` declares the `LYRQueryControllerDelegate` protocol. The `LYRQueryController` itself listens for changes that occur upon Layer model objects in response to synchronization by observing the `LYRClientObjectsDidChangeNotification` key. When changes occur which effect objects in the controllers result set, or new objects which fit the controller's query criteria are created, the controller will inform it's delegate. Application will then be able to update their UI in response to these changes. 

The following represents the ideal implementation of the `LYRQueryControllerDelegate` methods for a `UITableViewController`. This implementation with handle animating a UITableView in response to changes on Layer model objects.

```
- (void)queryControllerWillChangeContent:(LYRQueryController *)queryController
{
    [self.tableView beginUpdates];
}


- (void)queryController:(LYRQueryController *)controller
        didChangeObject:(id)object
            atIndexPath:(NSIndexPath *)indexPath
          forChangeType:(LYRQueryControllerChangeType)type
           newIndexPath:(NSIndexPath *)newIndexPath
{
    switch (type) {
        case LYRQueryControllerChangeTypeInsert:
            [self.tableView insertRowsAtIndexPaths:@[newIndexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        case LYRQueryControllerChangeTypeUpdate:
            [self.tableView reloadRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        case LYRQueryControllerChangeTypeMove:
            [self.tableView deleteRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            [self.tableView insertRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        case LYRQueryControllerChangeTypeDelete:
            [self.tableView deleteRowsAtIndexPaths:@[indexPath]
                                  withRowAnimation:UITableViewRowAnimationAutomatic];
            break;
        default:
            break;
    }
}

- (void)queryControllerDidChangeContent:(LYRQueryController *)queryController
{
    [self.tableView endUpdates];
}
```
