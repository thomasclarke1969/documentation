# Offline

Web applications need to be able to survive running on a device that has gone offline. There are three mechanisms provided for managing running offline:

1. Sync Manager
2. Websocket Manager
3. Persistence

## Sync Manager

The [Sync Manager](http://static.layer.com/sdk/docs-1.1/#!/api/layer.SyncManager) caches all of your requests.  This means that if your user types in Messages, deletes Messages, change Conversation metadata, sends read receipts, all while offline, all of these requests will queue up.  When the browser/device goes back online these will all be sent to the server.  For more information on the Sync Manager, see [Synchronization](guides#synchronization).

## Websocket Manager

The [WebSocket Manager](http://static.layer.com/sdk/docs-1.1/#!/api/layer.Websockets.SocketManager) monitors the state of the Websocket connection, reconnects when needed, and requests missed events from the server any time it reconnects, or suspects it may have missed data.

After going offline for a few hours, your app should automatically receive events from the past few hours once the connection is restored to your device.  Going offline for more than a day may cause all Queries to refire and load fresh data from the server rather than attempt to replay all changes.

## Persistence

Before getting into persistence, its important to note that persistence is only enabled if [isTrustedDevice](integration#trusted-devices) is enabled.

Persistence allows your web application to maintain a database (IndexedDB) of Messages, Announcements, Conversations, Identities and unsent server requests.  By keeping these in sync, its possible to load Conversation lists and Message lists from the database while offline... and to get a quicker list if on a slow network.

Loading of Conversations and Messages from the database vs from the server is managed by the layer.Query class; with persistence enabled, this behavior will transparently occur in the background, adding no complexity to your application.

However, it is worth being aware that the device really should be trusted before saving Any data to the browser's database.  Messages with credit card numbers, Messages with personal photos, dating arrangements, these are not things that someone with access to a user's browser should be able to access.  However, a developer console is all one needs to access this data.

Similarly, if an app stores confidential information in Conversation metadata, perhaps it should not be persisted.

The `persistenceFeatures` property allows you to specify which of these types of data should be enabled or disabled.  Default is that all types of data are written if `isTrustedDevice` is true.  The following code allows Identities and Session Tokens to be saved, and all other data is not saved:

```javascript
var client = new layer.Client({
    appId: myAppId,
    isTrustedDevice: true,
    persistenceFeatures: {
        identities: true,
        messages: false,
        conversations: false,
        syncQueue: false,
        sessionToken: true
    }
}
```

Some guidelines on deciding what to enable

* If its a Hybrid/Cordova/Ionic app thats installed on a mobile device rather than running in a standard web browser, its probably safe to trust it with all of your user's data.
* If you don't know whether this is a public terminal or a private laptop, its best to just turn off all persistence.
* If you have any security concerns, keep in mind that allowing the Session Token to be cached means that any request can be made to your server; this makes questions of whether to write data to a database or not a little less relevant.
* Identities seem pretty safe to cache.  However, a dating app may want to treat the list of people you talk with as highly confidential, and disable this.
* Messages contain the meat of the data one typically wants to secure.  Whether its a credit card number, dating information or a work related discussion, consider the likelihood of a coworker, spouse or misc person getting access to this "trusted" laptop.
* The Sync Queue options allows any Messages sent, Conversations created, and other interactions to be saved to a database.  This means that the next time the app is loaded, anything unprocess can be sent, updated or deleted on the server.  While these seem like relatively safe things privacy-wise, this setting is only available if both `messages` and `conversations` are enabled.
