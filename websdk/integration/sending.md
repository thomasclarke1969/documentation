# Sending Messages

Once authenticated, users can send and receive messages, which are associated with a specific Conversation object.

Conversation objects are created by calling `client.createConversation()`. This method takes a list of participant identifiers.  As Layer Authentication allows you to represent users within the Layer service via your backend’s [federated identifier](https://en.wikipedia.org/wiki/Federated_identity), participants are represented with those same user identifiers.

By default, new Conversations are set to be `distinct`, which ensures that there is only one unique conversation between the given set of users.

```javascript
// Creates and returns a distinct conversation object with the given user
var conversation = client.createConversation(['USER-IDENTIFIER']);

// Or long form:
var conversation = client.createConversation({
    participants: ['USER-IDENTIFIER'],
    distinct: true
});
```

```emphasis
Note, that it is not necessary to include the currently authenticated user in the participant array. They are added to new Conversations automatically.
```

If multiple users independently create distinct Conversations with the same set of users, the server will automatically merge the Conversations. This means that some properties of the Conversation may change after it is created, but the Layer SDK will handle these changes for you.

You can also have multiple Conversations with the same set of users by setting `distinct` to `false`.  This is useful if you need several different Conversations each with a different topic or metadata but among the same set of participants.

```javascript
var conversation = client.createConversation({
    participants: ['USER-IDENTIFIER'],
    distinct: false
});
```

## Add/Remove Participants

Once a Conversation has been created, participant lists remain mutable, meaning participants can be both added and removed. The Layer service does not enforce any ownership, so any client can both add and remove participants.

```javascript
// Adds a participant to a given conversation
conversation.addParticipants(['USER-IDENTIFIER']);

// Removes a participant from a given conversation
conversation.removeParticipants(['USER-IDENTIFIER']);
```

```emphasis
**NOTE**

Adding or removing participants from a distinct Conversation removes the distinct status. For example, if you have the following Conversations:

- Conversation A is distinct and has participants "1" and "2"
- Conversation B is distinct and has participants "1", "2", and "3"

Adding user "3" to Conversation A will result in the following:

- Conversation A is non-distinct and has participants "1", "2", and "3"
- Conversation B is distinct and has participants "1", "2", and "3"
```

Once you have created a Conversation, you are able to send messages as the authenticated user.

The `Message` object represents an individual message within a Conversation. A message within the Layer service can consist of one or many pieces of content, represented by the `MessagePart` object.

## MessagePart

Layer does not place restrictions on the type of data you send through the service. As such, `MessagePart` objects are initialized with a `body` that is either a string or Blob and a [MIME Type string](#warning). The MIME Type simply describes the type of content the `MessagePart` contains.

The following demonstrates creating message parts with both text/plain and image/jpeg MIME types.

```javascript
// Creates a message part with a string of "Hi!..." and text/plain MIME type.
var messagePart = new layer.MessagePart({
    mimeType: 'text/plain',
    body: 'Hi! How are you'
});

// Creates a message part with an image;
// File object represents an object typically received via drag and drop
// or a file upload button (File is a subclass of Blob)
var imagePart = new layer.MessagePart({
    mimeType: 'image/jpeg',
    body: file
});

conversation.createMessage({ parts: [messagePart, imagePart] }).send();
```

Your application can declare additional MIME types that it wishes to support. The following demonstrates sending location data.

```javascript
// Creates a HashMap with latitude and longitude
var location = JSON.stringify({
    lat: 25.43567,
    lon: 123.54383
});
var part = new layer.MessagePart({
    mimeType: 'text/location',
    body: location
});
```
<a name="warning"></a>
```emphasis
**NOTE**

While Layer does not place any restrictions on the MIME Type, Google and Apple dictate that the MIME Type string MUST conform to a "\*/\*" convention.  If the MIME Type does not contain a forward slash (/) you may have issues sending messages. For a comprehensive list of MIME Type values check out the [IANA's official registry of media types](http://www.iana.org/assignments/media-types/media-types.xhtml).
```

## Message

`Message` objects are initialized with either a string (for simple text/plain messages) or an object containing an array of `MessagePart` objects. The Message object is created by calling `conversation.createMessage()`. This creates a `Message` object that is ready to send.

```javascript

// Short form:
var message = conversation.createMessage('Hi! How are you');

// Long form:
var message = conversation.createMessage({
    body: 'Hi! How are you',
    mimeType: 'text/plain'
});
```

```emphasis
**IMPORTANT**:

By default, Layer will automatically download content for message parts whose content size is less that 2KB. If you want to send content larger than 2KB like images or movies, please read the [Rich Content](/docs/websdk/guides#rich-content) guide.
```

## Sending The Message

Once a `Message` object is initialized, it is ready for sending. The message is sent by calling its `send()` method.

```javascript
// Basic send:
message.send();

// Send with notifications:
message.send({
    text: 'Your device is now a machine that goes Ping',
    sound: 'ping.aiff'
});
```

The `send()` method takes an optional notification parameter that contains `text` and `sound` properties.  Consult with the [IOS](/docs/ios) and [Android](/docs/android) documentation for more detail on how these are handled.


## Receipt Status

Each Message object reports on the the receipt status for each participant of the Conversation.  Receipt status is reported in the following ways:

* `Message.isRead` - Was the message read by the user of this session?  Message senders are assumed to have read the Message.
* `Message.isUnread` - A convenience property for those who prefer this to `isRead`.
* `Message.recipientStatus` - Hash of user ids and their status.
* `Message.readStatus` - Synopsis of whether all participants have read the Message
* `Message.deliveryStatus` - Synopsis of whether all participants have received the Message

Status values within the `recipientStatus` property are one of the following:

* `layer.Constants.RECEIPT_STATE.sent` - The message has successfully reached the Layer service and is waiting to be synchronized with recipient devices.
* `layer.Constants.RECEIPT_STATE.delivered` - The message has been successfully delivered to a recipient's device.
* `layer.Constants.RECEIPT_STATE.read` - The message has been marked as read by a recipient's device.

Status values within `readStatus` and `deliveryStatus` properties are one of the following:

* `layer.Constants.RECIPIENT_STATE.NONE` - The message has not been successfully read/received by participants.
* `layer.Constants.RECIPIENT_STATE.SOME` - The message has been successfully read/received by some but not all participants.
* `layer.Constants.RECIPIENT_STATE.ALL` - The message has been successfully read/received by all participants.

You can check a specific participant's status using:

```javascript
// Get the status for a specific participant
var status = message.recipientStatus[userId];
```

All status updates are handled automatically by Layer except for marking messages as read by the user of the current session. When you have determined that a user has actually accessed a message's content, you can set this status directly:

```javascript
message.isRead = true;
```

## Receiving the Message

When displaying the message, you can get the Sender's User ID and, if necessary, do a lookup in your user management system:

```javascript
// The sender's user id
var senderID = message.sender.userId;
var displayName = myUserCache.lookup(senderID);
```

Messages can also be sent from the Platform API as a named service, rather than as coming from a participant of the Conversation:

```javascript
// The named service
var serviceName = message.sender.name;
```

You will also need to check the message's Mime Type (set when the message was sent) in order to know how to decode the message contents.

```javascript
var parts = message.parts, textData, locationData;
parts.forEach(function(part) {
    switch (part.mimeType) {
        case 'text/plain':
            textData = part.body;
            break;

        case 'text/location':
            locationData = JSON.parse(part.body);
            break;
    }
});
```

## Confirming Message Delivery

There a multiple ways in which Layer developers can confirm message delivery. The simplest mechanism is to visit the Layer [Developer Dashboard](/projects) and check the Logs section. If the message was successfully sent, you will see a log similar to the following:

```console
May 02 2015 2:34:27pm Sync: User <USER_IDENTIFIER> created a message in conversation <CONVERSATION_IDENTIFIER>.
```

To view programatic reports of delivery confirmations:

```javascript
var message = conversation.createMessage('Can you see me now?').send();

// Subscribe to changes in the Message's properties
message.on('messages:change', function(evt) {
    var changes = evt.getChangesFor('recipientStatus');
    var count = 0;

    // Typically there is only one change, but there may be more
    changes.forEach(function(change) {

        // Each change contains a before and after version of
        // the recipientStatus property, containing the status
        // of every participant.
        var oldRecipientStatuses = change.oldValue;
        var newRecipientStatuses = change.newValue;
        Object.keys(oldRecipientStatuses).forEach(function(userId) {
            // Any participant who was "sent" and is no longer "sent"
            // has either received OR received and read the message.
            if (oldRecipientStatuses[userId] === layer.Constants.RECEIPT_STATE.sent &&
                oldRecipientStatuses[userId] != newRecipientStatuses[userId]) {
                count++;
            }
        });
    });
    alert(count + ' more participants have received this message');
});
```

Note that the above code may be triggered multiple times as not all participants will receive the message at the same time.
