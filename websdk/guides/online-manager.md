# Online State Manager

The Client's `onlineManager` property provides a component for monitoring if the client appears to be online or offline.  While there are browser events for reporting when the browser is online/offline, browsers are inconsistent in how these are interpreted.  For example Chrome will report you as online if your connected to a wifi router, even if that router is not connected to the internet.

The manager sends all of its events to the client, allowing you to simply monitor online state using:

```javascript
client.on('online', function(evt) {
    if (evt.isOnline) {
        document.body.classList.remove('offline-mode');
    } else {
        document.body.classList.add('offline-mode');
    }
});
```

You can also directly query the onlineManager for the browser's current state:

```javascript
if (client.onlineManager.isOnline) {
    document.body.classList.remove('offline-mode');
    var query = client.createQuery({
        model: layer.Query.Conversation
    });
}
```
