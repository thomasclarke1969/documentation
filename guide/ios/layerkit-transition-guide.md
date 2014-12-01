#LayerKit v0.9.0 Transition Guide

## Breaking API Changes
LayerKit v0.9.0 includes two breaking API changes. The initializer methods of both `LYRConversation` and `LYRMessage` objects have been moved from the model classes themselves onto the `LYRClient` object. 

```
// Instantiates a new LYRConversation object
- (LYRConversation *)newConversationWithParticipants:(NSSet *)participants options:(NSDictionary *)options error:(NSError **)error;

// Instantiates a new LYRMessage object
- (LYRMessage *)newMessageWithParts:(NSArray *)messageParts options:(NSDictionary *)options error:(NSError **)error;
```

Both `LYRMessage` and `LYRConversation` objects are now initialized with an `options` dictionary. For conversation objects, this feature allows developers to attach `metadata` to the conversation. For messages, this feature allows developers to set [push notification options](#push-notification-options). 

## New Model Object Methods
Methods that allow applications to take action upon Layer model objects (such as sending or deleting messages) have been moved from the `LYRClient` object onto the models themselves.  

Methods moved from `LYRClient`to `LYRConversation`:

```
// Sends a message to the conversation
- (BOOL)sendMessage:(LYRMessage *)message error:(NSError **)error;

// Adds a participant(s) to the conversation
- (BOOL)addParticipants:(NSSet *)participants error:(NSError **)error;

// Removes a participant(s) from a conversation
- (BOOL)removeParticipants:(NSSet *)participants error:(NSError **)error;

// Deletes the conversation
- (BOOL)delete:(LYRDeletionMode)delete;

// Sends a typing indicator to the conversation
- (void)sendTypingIndicator:(LYRTypingIndicator)typingIndicator;
```

Methods moved from `LYRClient` to `LYRMessage`:

```
// Deletes the message
- (BOOL)delete:(LYRDeletionMode)deletionMode error:(NSError **)error;

// Marks the message as read
- (BOOL)markAsRead:(NSError **)error;
```

In addition to the model API changes, a new method for marking all unread messages as read for a given conversation has been introduced to the `LYRConversation` class:
```
// Marks all unread messages as read
- (BOOL)markAllMessagesAsRead:(NSError **)error;
```

## Typing Indicators
Typing indicators are a common UI element in messaging applications. LayerKit now provides platform support for implementing typing indicators across Android and iOS applications. 

Applications can broadcast typing indicators by calling `sendTypingIndicator:` on a `LYRConversation` object. This method will broadcast a typing indicator on behalf of the currently authenticated user. Each participant in the conversation will recieve a typing indicator notification.

```
// Sends a typing indicator event to a specific conversation
[self.conversation sentTypingIndicator:LYRTypingDidBegin];
```

Applications are notified to incoming typing indicators via an `NSNotification`. Applications should register as an observer of the `LYRConversationDidReceiveTypingIndicatorNotification` key to receive typing indicator notifications.

```
// Registers and object for typing indicator notifications.
[[NSNotificationCenter defaultCenter] addObserver:self
                                         selector:@selector(didReceiveTypingIndicator:)
                                             name:LYRConversationDidReceiveTypingIndicatorNotification 
                                           object:nil];
```

Passing a `nil` value to the `object:` argument of the `addObserver:selector:name:object` method will make the observer listen for typing indicators of **all the conversations**. To receive typing indicators for a specific conversation, a `LYRConversation` instance should be passed as an `object:` argument.

##Metadata
Metadata is a new feature which provides an elegant mechanism for expressing and synchronizing contextual information about Conversations. This is implemented as a free-form structure of string key-value pairs that is automatically synchronized among the participants in a conversation. A few use cases for metadata may include:

1. Setting a conversation title.
2. Storing information about participants within the Conversation.
3. Attaching dates or tags to the Conversation.
4. Storing a reference to a background image URL for the Conversation.

```
NSDictionary *metadata = @{@"title" : @"My Conversation",
                           @"participants" : @{
                                   @"0000001" : @"Greg Thompson",
                                   @"0000002" : @"Sally Price",
                                   @"0000003" : @"Tom Jones"},
                           @"created_at" : @"Dec, 01, 2014",
                           @"img_url" : @"/path/to/img/url"};
[self.conversation setValuesForKeysWithDictionary:metadata];
```

For convenience and to facilitate the namespacing of information within metadata, values may be manipulated as key paths. A key path is a dot (.) delimited string that identifies a series of nested keys leading to a leaf value. For example, given the above metadata structure, an application could change the name of a participant via the following: 

```
[self.converation setValue:@"Tom Douglas" forMetadataAtKeyPath:@"participants.0000003"];
```

Applications can fetch metadata for a given conversation by accessing the public `metadata` property on `LYRConversation` objects. 

```
NSString *title = [self.conversation.metadata valueForKey:@"title"];
```

## Push Notification Options
Prior to LayerKit v0.9.0, applications could set push notification options, such as the push text or push sound, by setting `metadata` values on `LYRMessage` objects. Going forward, applications should set push notification options via the `options` parameter in the `LYRMessage` object's designated initializer method. 

```
NSDictionary *pushOptions = @{LYRMessagePushNotificationAlertMessageKey : @"Some Push Text",
                                 LYRMessagePushNotificationSoundNameKey : @"default"};
NSError *error;
LYRMessage *message = [self.client newMessageWithParts:@[parts]
                                               options:pushOptions
                                                 error:&error];
```

## Querying
One of the major feature releases that accompanies our v0.9.0 release is the introduction of the `LYRQuery` object. This object provides application developers with a flexible and expressive interface with which they can query LayerKit for messaging content. All `LYRClient` methods which previously allowed applications to fetch content from the SDK have been deprecated. Developers should now leverage the `LYRQuery` object in order to fetch only the specific content their application needs.  

Below are the deprecated `LYRClient` methods with the corresponding query that can be used in their place. 

####- (LYRConversation *)conversationsForIdentifiers:(NSSet *)identifiers;

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"identifier" operator:LYRPredicateOperatorIsIn value:identifiers];

NSError *error;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"Fetched %tu Conversations", conversations.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

####- (NSSet *)messagesForIdentifiers:(NSSet *)messageIdentifiers;

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"identifier" operator:LYRPredicateOperatorIsIn value:identifiers];

NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"Fetched %tu messages", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

####- (LYRConversation *)conversationForIdentifier:(NSURL *)identifier;

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"identifier" operator:LYRPredicateOperatorIsEqualTo value:identifier];

NSError *error;
NSOrderedSet *conversation = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"Fetched %tu messages", [conversation objectAtIndex:0]);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

####- (NSSet *)conversationsForParticipants:(NSSet *)participants;
```
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predicate = [LYRPredicate predicateWithProperty:@"participants" operator:LYRPredicateOperatorIsEqualTo value:participants];

NSError *error;
NSOrderedSet *conversations = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"Fetched %tu Conversations", conversations.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

####- (NSOrderedSet *)messagesForConversation:(LYRConversation *)conversation 

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:conversation];
query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"index" ascending:YES]];
NSError *error;
NSOrderedSet *messages = [self.client executeQuery:query error:&error];
if (!error) {
    NSLog(@"%tu Messages in Conversation", messages.count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

####- (NSUInteger)countOfConversationsWithUnreadMessages

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
query.predic
ate = [LYRPredicate predicateWithProperty:@"hasUnreadMessages" operator:LYRPredicateOperatorIsEqualTo value:@(YES)];

NSError *error;
NSUInteger conversationCount = [self.client countForQuery:query error:&error];
if (!error) {
    NSLog(@"%tu conversations", conversationCount);
} else {
    NSLog(@"Query failed with error %@", error);
}
```

#####- (NSUInteger)countOfUnreadMessagesInConversation:(LYRConversation *)conversation

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
LYRPredicate *conversationPredicate = [LYRPredicate predicateWithProperty:@"conversation" operator:LYRPredicateOperatorIsEqualTo value:conversation];
LYRPredicate *unreadPredicate = [LYRPredicate predicateWithProperty:@"isUnread" operator:LYRPredicateOperatorIsEqualTo value:@(YES)];
LYRPredicate *userPredicate = [LYRPredicate predicateWithProperty:@"sendByUserId" operator:LYRPredicateOperatorIsNotEqualTo value:self.client.authenticatedUserID];
query.predicate = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeAnd subpredicates:@[conversationPredicate, unreadPredicate, userPredicate]];

NSError *error;
NSUInteger count = [self.client countForQuery:query error:&error];
if (!error) {
    NSLog(@"%tu unread messages in conversation", count);
} else {
    NSLog(@"Query failed with error %@", error);
}
```
##LYRQueryController
The `LYRQueryController` class can be used to efficiently manage the results from an `LYRQuery` and provide that data to be used in a `UITableView` or `UICollectionView`. The object is similar in concept to an `NSFetchedResultsController` and provides the following functionality:

1. Executes the actual query and caches the result set.
2. Monitors changes to objects in the result set and reports those changes to its delegate (see `LYRQueryControllerDelegate`).
3. Listens for newly created objects that fit the query criteria and notifies its delegate on creation.

The following demonstrates constructing a `LYRQueryController` that can be used to display a list of `LYRConversation` objects in a `UITableView`.

```
LYRQuery *query = [LYRQuery queryWithClass:[LYRConversation class]];
LYRQueryController *queryController = [self.client queryControllerWithQuery:query];
queryController.delegate = self;
NSError *error;
BOOL success = [queryController execute:&error];
if (success) {
    NSLog(@"Query fetched %tu conversation objects", [queryController numberOfObjectsInSection:0]);
} else {
    NSLog(@"Query failed with error %@", error);
}
```
#LYRQueryControllerDelegate

`LYRQueryController` declares the `LYRQueryControllerDelegate` protocol. `LYRQueryController` observes `LYRClientObjectsDidChangeNotification` to listen for changes to Layer model objects during synchronization. When changes occur which effect objects in the controller's result set, or new objects which fit the controller's query criteria are created, the controller will inform its delegate. The delegate will then be able to update its UI in response to these changes.

For more information on using the `LYRQueryControllerDelegate` with a `UITableViewController`, please see the `LYRQueryController` guide. 
