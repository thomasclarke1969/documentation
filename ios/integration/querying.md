# Querying
Layer provides a flexible and expressive interface with which applications can query for messaging content. Querying is performed with a `LYRQuery` object and can act on `LYRConversation`, `LYRMessage`, or `LYRAnnoucement` objects.

```emphasis
Queries execute on the local database, and will only return results for conversations and messages where the authenticated user is a participant. Queries will **not** return empty conversations - a conversation must have at least one message in it in order to be written to the local database. 
```

To demonstrate a simple example, the following queries LayerKit for the latest 20 messages in the given conversation.

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

## Constructing a query

An instance of an `LYRQuery` object is initialized with a `Class` object representing the class upon which the query will be performed. Querying is available on classes that conform to the `LYRQueryable` protocol. Currently, `LYRConversation`, `LYRMessage`, and `LYRAnnouncement` are the only classes which conform to the protocol.

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
```

## Applying constraints

The `LYRPredicate` object allows applications to apply constraints to a query result set. Constraints are expressed in terms of a public property (such as `createdAt` or `isUnread`), a predicateOperator (such as 'is equal to' or 'is greater than or equal to'), and a comparison value.

The following `LYRPredicate` will constrain the query result set to `LYRMessage` objects whose `conversation` property is equal to the supplied conversation object.

```objectivec
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" predicateOperator:LYRPredicateOperatorIsEqualTo value:self.conversation];
```

Properties that support querying are identified by the `LYR_QUERYABLE_PROPERTY` macro.

## Sorting results

Applications can describe the sort order in which the query results should be returned. This is done by setting a value for the `sortDescriptors` property on `LYRQuery` objects. This value must be an array of `NSSortDescriptor` instances.

The following sort descriptor asks that results be returned in ascending order based on the `position` property of the `LYRMessage` objects.

```objectivec
query.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES]];
```

## Limits and offsets

To facilitate pagination, queries may be further constrained by applying limit and offset values. The limit onfigures the maximum number of objects to be returned when the query is executed. The offset configures the number of rows that are to be skipped in the result set before results are returned.

```objectivec
query.limit = 20;
query.offset = 0;
```

## Result types

Query results can be returned as fully realized object instances, object identifiers, or as an aggregate count of the total number of objects matching the query. Applications determine their desired return type by optionally setting a value for the `resultType` property on the `LYRQuery` object. The default value is `LYRQueryResultTypeObjects`.

```objectivec
// Fully realized objects
query.resultType = LYRQueryResultTypeObjects;

// Object identifiers
query.resultType = LYRQueryResultTypeIdentifiers;

// Count of objects
query.resultType = LYRQueryResultTypeCount;
```

## Executing The Query

Queries are executed by calling `executeQuery:error:` on `LYRClient`. The method takes an `LYRQuery` object and a pointer to an `NSError` object. If successful, the method will return an `NSOrderedSet` of objects which represent the results of the query. If an error occurs, the supplied error pointer will be set to an error object describing why execution failed.

```objectivec
NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages in conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

Additionally, when querying for results with a `resultType` of `LYRQueryResultTypeCount`, `LYRClient` declares a convenience method that returns an `NSUInteger`, `countForQuery:error:`.

```objectivec
NSError *error;
NSUInteger countOfMessages = [self.client countForQuery:query error:&error];
if (!error) {
    NSLog(@"%tu messages in conversation", countOfMessages);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

```emphasis
For many more query examples, please see our Advanced Querying Guide.
```
# <a name="LYRQueryController"></a>LYRQueryController

The `LYRQueryController` can be used to efficiently manage the results from an `LYRQuery` and provide that data to be used in a `UITableView`. The object is similar in concept to an `NSFetchedResultsController` and provides the following functionality:

1. Executes the actual query and caches the result set.
2. Monitors changes to objects in the result set and reports those changes to its delegate (see `LYRQueryControllerDelegate`).
3. Listens for newly created objects that fit the query criteria and notifies its delegate on creation.

The following demonstrates constructing a `LYRQueryController` that can be used to display a list of `LYRConversation` objects in a `UITableView`.

```objectivec
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRConversation class]];
LYRQueryController *queryController = [self.client queryControllerWithQuery:query error:nil];
queryController.delegate = self;
NSError *error;
BOOL success = [queryController execute:&error];
if (success) {
    NSLog(@"Query fetched %tu conversation objects", [queryController numberOfObjectsInSection:0]);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

In order to acquire the number of objects in a result set, applications can call `numberOfObjectsInSection:`. This method can be used for the return value in the `UITableViewDataSource` method `numberOfRowsInSection:`

```objectivec
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.queryController numberOfObjectsInSection:section];
}
```

In order to acquire an object for a given position, applications can call `objectAtIndexPath:`. This method can be used in your implementation of `cellForRow:atIndexPath:` in order to acquire the proper `LYRConversation` object to display.

```objectivec
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

# LYRQueryControllerDelegate

`LYRQueryController` declares the `LYRQueryControllerDelegate` protocol. `LYRQueryController` observes `LYRClientObjectsDidChangeNotification` to listen for changes to Layer model objects during synchronization. When changes occur which effect objects in the controller's result set, or new objects which fit the controller's query criteria are created, the controller will inform its delegate. The delegate will then be able to update its UI in response to these changes.

The following represents the ideal implementation of the `LYRQueryControllerDelegate` methods for a `UITableViewController`. This implementation will handle animating a `UITableView` in response to changes on Layer model objects.

```objectivec
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
            [self.tableView insertRowsAtIndexPaths:@[newIndexPath]
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
