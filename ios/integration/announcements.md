#Announcements
Announcements are a special `LYRMessage` type sent to a list of users or all users of the application that will arrive outside of the context of a conversation (the conversation property will be null). Announcements can only be sent through the [Platform API](https://developer.layer.com/docs/platform).

## Fetching Announcements
You can use the following queries to fetch announcements
```objectivec
// Fetch all Announcements
NSError *error = nil;
LYRQuery *query = [LYRQuery queryWithClass:[LYRAnnouncement class]];
query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES] ];
NSOrderedSet *announcements = [layerClient executeQuery:query error:&error];

// Fetch all unread Announcements
NSError *error = nil;
LYRQuery *query = [LYRQuery queryWithClass:[LYRAnnouncement class]];
query.predicate = [LYRPredicate predicateWithProperty:@"isUnread" operator:LYRPredicateOperatorIsEqualTo value:@YES];
query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES] ];
NSOrderedSet *announcements = [layerClient executeQuery:query error:&error];

// Count all unread announcements
NSError *error = nil;
LYRQuery *query = [LYRQuery queryWithClass:[LYRAnnouncement class]];
query.predicate = [LYRPredicate predicateWithProperty:@"isUnread" operator:LYRPredicateOperatorIsEqualTo value:@YES];
query.sortDescriptors = @[ [NSSortDescriptor sortDescriptorWithKey:@"position" ascending:YES] ];
NSUInteger count = [layerClient countForQuery:query error:&error];
```

## Marking an Announcement as read
The following code shows you how to mark an `LYRAnnouncement` as read
```objectivec
NSError *error = nil;
if ([announcement markAsRead:&error]) {
    NSLog(@"New Conversation creation failed: %@", error);
}
```
