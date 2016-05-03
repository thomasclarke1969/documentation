#Announcements

Announcements are a special `Message` type sent to a list of users or all users of the application that will arrive outside of the context of a conversation (the conversation property will be null). Announcements can only be sent through your web service using the [Platform API](https://developer.layer.com/docs/platform).

## Fetching Announcements

You can use the following queries to fetch announcements

```javascript
var query = client.createQuery({
    model: layer.Query.Announcement
});

query.on('change', function(evt) {
    renderMyAnnouncements(query.data);
});
```
For more information see [Querying](#querying).

## Marking an Announcement as read

The following code shows you how to mark an `Announcement` as read; this code will set the property and trigger the necessary side effects to update the server.

```javascript
announcement.isRead = true;
```

## Deleting an Announcement

```javascript
announcement.delete();
```