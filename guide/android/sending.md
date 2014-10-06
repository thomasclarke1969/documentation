# Sending Messages
Conversation` objects are created by calling `Conversation.newInstance()`. This method takes a list of participant identifiers.  As Layer Authentication allows you to represent users within the Layer service via your backend’s federated identifier, participants are represented with those same user identifiers.

```java
// Creates and returns a new conversation object with sample participant identifiers
Conversation conversation = Conversation.newInstance(Arrays.asList("USER-IDENTIFIER"));
```

```emphasis
Note, that it is not necessary to include the currently authenticated user in the participant array. They are added to new conversations automatically when the first message gets sent to that conversation.
```

## Add/Remove Participants

Once a conversation has been created, particiapnt lists remain mutable, meaning participants can be both added and removed. The Layer servivce does not enforce any ownership, so any client can both add and remove participants.

```java
// Adds a participant to a given conversation
client.addParticipants(conversation, Arrays.asList("948374848"));

// Removes a participant from a given conversation
client.removeParticipants(conversation, Arrays.asList("948374848"));
```

The `Message` object represents an individual message within a conversation. A message within the Layer service can consist of one or many pieces of content, represented by the `MessagePart` object.

## MessagePart

Layer does not place restrictions on the type of data you send through the service. As such, `MessagePart` objects are initialized with an `Byte` object and a MIME Type string. The MIME Type simply describes the type of content the `MessagePart` contains.

The following demonstrates creating message parts with both text/plain and image/jpeg MIMEtypes.

```java
// Creates a message part with a string of next and text/plain MIMEtype.
String messageText = "Hi! How are you";
MessagePart messagePart = MessagePart.newInstance("text/plain", messageText.getBytes());

// Creates a message part with an image
Bitmap imageBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.back_icon);
ByteArrayOutputStream stream = new ByteArrayOutputStream();
imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
byte[] imageData = stream.toByteArray();
MessagePart messagePart = MessagePart.newInstance("image/jpeg", imageData);
```

The MessagePart object also declares a convenience method for creating messages with text/plain MIME type:

```java
String messageText = "Hi! How are you";
MessagePart messagePart = MessagePart.newInstance(messageText);
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

MessagePart locationPart = client.newMessagePart("text/location", locationData.toByteArray());
```

## Message

`Message` objects are initialized with an array of `MessagePart` objects and a `Conversation` object. The object is created by calling newInstance(). This creates a `Message` object that is ready to send.

```java
Message message = Message.newInstace(conversation, Arrays.asList(messagePart))
```

## Sending The Message

Once an `Message` object is initialized, it is ready for sending. The message is sent by calling `sendMessage()` on `LayerClient`.

```java
// Sends the specified message
client.sendMessage(message);
```
