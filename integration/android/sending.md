# Sending Messages
Once authenticated, users can send and receive messages, which are associated with a specific conversation object.

Conversation objects are created by calling `layerClient.newConversation()`. This method takes a list of participant identifiers.  As Layer Authentication allows you to represent users within the Layer service via your backend’s federated identifier, participants are represented with those same user identifiers.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = layerClient.newConversation(Arrays.asList("USER-IDENTIFIER"));
```

```emphasis
Note, that it is not necessary to include the currently authenticated user in the participant array. They are added to new conversations automatically when the first message gets sent to that conversation.
```

## Add/Remove Participants

Once a conversation has been created, participant lists remain mutable, meaning participants can be both added and removed. The Layer servivce does not enforce any ownership, so any client can both add and remove participants.

```java
// Adds a participant to a given conversation
conversation.addParticipants(Arrays.asList("948374848"));

// Removes a participant from a given conversation
conversation.removeParticipants(Arrays.asList("948374848"));
```

The `Message` object represents an individual message within a conversation. A message within the Layer service can consist of one or many pieces of content, represented by the `MessagePart` object.

## MessagePart

Layer does not place restrictions on the type of data you send through the service. As such, `MessagePart` objects are initialized with a `byte` array and a [MIME Type string](#warning). The MIME Type simply describes the type of content the `MessagePart` contains.

The following demonstrates creating message parts with both text/plain and image/jpeg MIME types.

```java
// Creates a message part with a string of next and text/plain MIME type.
String messageText = "Hi! How are you";
MessagePart messagePart = layerClient.newMessagePart("text/plain", messageText.getBytes());

// Creates a message part with an image
Bitmap imageBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.back_icon);
ByteArrayOutputStream stream = new ByteArrayOutputStream();
imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
byte[] imageData = stream.toByteArray();
MessagePart messagePart = layerClient.newMessagePart("image/jpeg", imageData);
```

The MessagePart object also declares a convenience method for creating messages with text/plain MIME type:

```java
String messageText = "Hi! How are you";
MessagePart messagePart = layerClient.newMessagePart(messageText);
```

Your application can declare additional MIME types that it wishes to support. The following demonstrates sending location data.

```java
// Creates a HashMap with latitude and longitude
HashMap location = new HashMap<String, String>();
location.put("lat", "25.43567");
location.put("lon", "123.54383");

//Convert the location to data
ByteArrayOutputStream locationData = new ByteArrayOutputStream();
ObjectOutputStream outputStream = new ObjectOutputStream(locationData);
outputStream.writeObject(location);

MessagePart locationPart = layerClient.newMessagePart("text/location", locationData.toByteArray());
```
<a name="warning"></a>
```emphasis
**NOTE**
While Layer does not place any restrictions on the MIME Type, Google and Apple dictate that the MIMEType string MUST conform to a "\*/\*" convention.  If the MIME Type does not contain a forward slash (/) you may have issues sending messages. For a comprehensive list of MIME Type values check out the [IANA's official registry of media types](http://www.iana.org/assignments/media-types/media-types.xhtml).
```

## Message

`Message` objects are initialized with an array of `MessagePart` objects. The object is created by calling `newMessage()` on the Layer object. This creates a `Message` object that is ready to send.

```java
Message message = layerClient.newMessage(Arrays.asList(messagePart))
```

The service declares 4 recipient states; Invalid, Sent, Delivered, and Read. The only state that we allow developers to set is Read. The system itself determines when to mark a message as Invalid, Sent or Delivered. Because of this, we also do not automatically mark messages as read for the sender. That is up to the developer to do so.

```emphasis
**IMPORTANT**

By default, Layer will automatically download content for message parts whose content size is less that 2KB. If you want to send content larger than 2k like images or movies, please read the [Rich Content](/docs/guides#richcontent) guide.
```

## Sending The Message

Once an `Message` object is initialized, it is ready for sending. The message is sent by calling `send()` on the `Conversation` object.

```java
// Sends the specified message
conversation.send(message);
```

```emphasis
**Best Practice**

Conversations are not pushed to other participants, and are not queryable, until the first message is sent. Depending on your app's flow, you can use an invitation MIME Type to notify all participants that a new conversation has been created. [Click here](https://support.layer.com/hc/en-us/articles/204193200-Why-can-t-participants-query-a-newly-created-conversation-) to learn more.
```

## Recipient Status
Layer allows you the current status of a message for every participant in a conversation. The states are the following:

* `Message.RecipientStatus.PENDING` - The message is waiting to be synced with the Layer service.
* `Message.RecipientStatus.SENT` - The message has successfully reached the Layer service and is waiting to be synchronized with recipient devices.
* `Message.RecipientStatus.DELIVERED` - The message has been successfully delivered to a recipient's device.
* `Message.RecipientStatus.READ` - The message has been "marked as read" by a recipient's device.

You can check a message's status for an individual participant or get a map of the recipient status for all participants:

```java
//Get the status for a specific participant
Message.RecipientStatus status = message.getRecipientStatus(userID);

//Get statuses for all participants
Map<String, Message.RecipientStatus> statuses = message.getRecipientStatus();
```

All status updates are handled automatically by Layer except for marking messages as read. When you have determined that a user has actually accessed a message's content, you can set this status directly:

```java
message.markAsRead();
```

## Receiving the Message

When displaying the message, you can get the Sender's User ID and, if necessary, do a lookup in your user management system:

```
//The sender's user id
String senderID = msg.getSender().getUserId();
```

You will also need to check the message's Mime Type (set when the message was sent) in order to know how to decode the message contents.

```
List<MessagePart> parts = message.getMessageParts();
for(MessagePart part : parts) {
    switch (part.getMimeType()) {

        case "text/plain":
            String textMsg = new String(part.getData());
            break;

        case "image/jpeg":
            Bitmap imageMsg = BitmapFactory.decodeByteArray(part.getData(), 0, part.getData().length);
            break;
    }
}
```

## Confirming Message Delivery

There a multiple ways in which Layer developers can confirm message delivery. The simplest mechansim is to visit the Layer [Logs Dashboard](/projects/layer-sample/logs) in the Layer developer portal. If the message was succesfully sent, you will see a log similar to the following:

```
May 02 2015 2:34:27pm Sync: User <USER_IDENTIFIER> created a message in conversation <CONVERSATION_IDENTIFIER>.
```