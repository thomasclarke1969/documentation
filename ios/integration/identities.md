# Identity

The `LYRIdentity` class represents a synchronized user identity model from an application's own provider to the Layer platform.  Identities can be created via extension of the [authentication handshake](/docs/ios/integration/authentication) or via [Platform API](/docs/platform/).

## Following

All `LYRConversation` `participants` and `LYRMessage` `sender` objects are of type `LYRIdentity`, with a minimum of property `userID`. All followed identity's properties updated via authentication handshake or Platform API are synchronized to the clients. Conversation participants are already implicitly followed and cannot be explicitly unfollowed.  Non-conversation participant identities can be explicitly followed by calling `LYRClient` method `followUserIDs:error:` and unfollowed via `unfollowedUserIDs:error:`.  Following a userID ensures the client synchronizes new identity information for the associated identity.

## Querying

`LYRIdentity` conforms to the `LYRQueryable` protocol and in addition to default `LYRPredicateOperator`s is also specially queryable via `LYRPredicateOperatorLike` which allows for wildcard querying.

```objectivec
// Queries for all identities with display name `randomName`
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRIdentity class]];
query.predicate = [LYRPredicate predicateWithProperty:@"displayName" predicateOperator:LYRPredicateOperatorIsEqualTo value:@"randomName"];

// Queries for all identities with display name beginning with `rando`
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRIdentity class]];
query.predicate = [LYRPredicate predicateWithProperty:@"displayName" predicateOperator:LYRPredicateOperatorLike value:@"rando%"];

// Queries for all identities that start with `random` and end with `ame`
LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRIdentity class]];
query.predicate = [LYRPredicate predicateWithProperty:@"displayName" predicateOperator:LYRPredicateOperatorLike value:@"random_ame"];

```