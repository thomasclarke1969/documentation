# Identity

The `layer.Identity` class represents a User (ID, display name, avatar url, etc) provided by your application to the Layer platform.  Identities can be created via extension of the [authentication handshake](/docs/websdk/integration/authentication) or via [Platform API](/docs/platform/).  The most common properties of an Identity are:

* `userId`: Allows you to map the Identity to a user in your own User Management system
* `id`: Allows you to identify the user to Layer
* `displayName` & `avatarUrl`: Helps you to render the user

You will see Identities in:

* The `layer.Conversation` `participants` property
* The `layer.Message` `sender` property
* The `layer.Client` `user` property

## Following

Users can be followed in order to receive updates when their Identity changes on the platform.  Any participant in a Conversation with your user is already implicitly followed and cannot be explicitly unfollowed.  Other users can be explicitly followed by calling `client.followIdentity(identityID)` or unfollowed via `client.unfollowIdentity(identityID)`.  This is useful for presenting a list of identities a user can begin a new conversation with, without relying on an external user management system.

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

## Full Identities vs Basic Identities

Typically, only a Basic Identity is loaded.  A Basic Identity loads only the following properties:

* id
* userId
* url
* displayName
* avatarUrl

A Basic Identity is loaded when Identities are loaded for Converation pariticipants and Message senders.

A full identity adds the following properties:

* firstName
* lastName
* phoneNumber
* emailAddress
* metadata
* publicKey

These fields are not typically needed to render a UI, and are only loaded when explicitly requested via a Query.