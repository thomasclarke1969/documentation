# Identity

The `layer.Identity` class represents a User Identity model representing information about a User (ID, display name, avatar url, etc) provided by your application to the Layer platform.  Identities can be created via extension of the [authentication handshake](/docs/websdk/integration/authentication) or via [Platform API](/docs/platform/).
All `layer.Conversation` `participants` and `layer.Message` `sender` properties are of type `layer.Identity`.

## Following

Users can be followed in order to receive updates when their Identity changes on the platform.  Conversation participants are already implicitly followed and cannot be explicitly unfollowed.  Other users can be explicitly followed by calling `client.followIdentity(identityID)` or unfollowed via `client.unfollowIdentity(identityID)`.  This is useful for presenting a list of identities a user can begin a new conversation with, without relying on an external user management system.

```javascript
// Follow a user to create a queryable `layer.Identity` object that receives updates via Platform API
client.followIdentity('layer:///identities/frodo_the_dodo%40layer.com');

// Unfollow a user to stop receiving identity updates
client.unfollowIdentity('layer:///identities/frodo_the_dodo%40layer.com');
```

Note that the following shorthand of using a User ID instead of an Identity ID is currently accepted:

```
client.followIdentity('frodo_the_dodo@layer.com');
```

## Querying

`layer.Identity` can be accessed via the `layer.Query` class.  Until full server Querying is available, this simply exposes a way to load Identities from the server and page through them.

```javascript
var identityQuery = client.createQuery({
    model: layer.Query.Identity
});

identityQuery.on('change', function(evt) {
    render(identityQuery.data);
});
```
