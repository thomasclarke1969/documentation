# Sending Messages
[LYRConversation](/docs/api/ios#lyrconversation) objects are created by calling `newConversationWithParticipants`on [LYRClient](/docs/api/ios#lyrclient). The participants array is simply an array of user identifiers. As Layer Authentication allows you to represent users within the Layer service via your backend’s identifier for that user, a participant in a conversation is represented with that same user identifier.

```objectivec
// Creates and returns a new conversation object with a participant identifier
LYRConversation *conversation = [layerClient newConversationWithParticipants:[NSSet setWithArray:@[@"USER-IDENTIFIER"]] options:nil error:nil];
```

```emphasis
Note, that it is not necessary to include the currently authenticated user in the participant array. They are implicit in all new conversations.***
```

##Participants

Once a conversation has been created, participant lists remain mutable, meaning participants can be added or removed. The Layer service does not enforce ownership of conversations so any client can both add or remove participants from a conversation.

```objectivec
// Adds a participant to an existing conversation
// New participants will gain access to all previous messages in a conversation.
[conversation addParticipants:@[@"USER-IDENTIFIER"] error:nil];

// Removes a participant from an existing conversation
// Removed participants will only lose access to future content. They will retain access
// to the conversation and all preceding content.
[conversation removeParticipants:@[@"USER-IDENTIFIER"] error:nil];
```

The [LYRMessage](/docs/api/ios#lyrmessage) object represents an individual message within a conversation. A message within the Layer service can consist of one or many pieces of content, represented by the [LYRMessagePart](/docs/api/ios#lyrmessagepart) object.

## LYRMessagePart

Layer does not enforce restrictions on the type of data you send through the service. As such, [LYRMessagePart](/docs/api/ios#lyrmessagepart) objects are initialized with an `NSData` object and a MIME type string. The MIME type string simply describes the type of content the [LYRMessagePart](/docs/api/ios#lyrmessagepart) object contains.

The following demonstrates creating message parts with both `text/plain` and `image/png` MIME types.

```objectivec
// MIME type declarations
static NSString *const MIMETypeTextPlain = @"text/plain";
static NSString *const MIMETypeImagePNG = @"image/png";

// Creates a message part with a string of text and text/plain MIMEtype.
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];

// Creates a message part with an image
UIImage *image = [UIImage imageNamed:@"awesomeImage.jpg"];
NSData *imageData = UIImagePNGRepresentation(image);
LYRMessagePart *imagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeImageJPG data:imageData];
```

The [LYRMessagePart](/docs/api/ios#lyrmessagepart) object also declares a convenience method for creating messages with `text/plain` MIME Type.

```objectivec
// Creates a message part with a string of text
LYRMessagePart *part = [LYRMessagePart messagePartWithText:@"Hi, how are you?"];
```

## LYRMessage

[LYRMessage](/docs/api/ios#lyrmessage) objects are initialized with an array of [LYRMessagePart](docs/api/ios#lyrmessagepart) objects and an [LYRConversation](/docs/api/ios#lyrconversation) object.  The object is created by calling `newMessageWithParts` on [LYRClient](/docs/api/ios#lyrclient). This creates an [LYRMessage](/docs/api/ios#lyrmessage) object that is ready to be sent.

```objectivec
// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [layerClient newMessageWithParts:@[messagePart] options:nil error:nil];
```

The service declares 4 recipient states; Invalid, Sent, Delivered, and Read. The only state that we allow developers to set is Read. The system itself determines when to mark a message as Invalid, Sent or Delivered. Because of this, we also do not automatically mark messages as read for the sender. That is up to the developer to do so.

## Sending The Message

Once an [LYRMessage](/docs/api/ios#lyrmessage) object is initialized, it is ready to be sent. The message is sent by calling `sendMessage:message` on `LYRConversation`.

```objectivec
//Sends the specified message
BOOL success = [conversation sendMessage:message error:nil];
if (success) {
	NSLog(@"Message enqueued for delivery");
} else {
	NSLog(@"Message send failed");
}
```

The `sendMessage` method returns a boolean value which indicates if the message has passed validation and was enqueued for delivery in the local data store. If LayerKit has a current network connection, the message will immediately be sent off of the device. Otherwise it will remain enqueued locally until the SDK re-establishes a network connection. At that point, the SDK will automatically send the message.

[LYRMessage](/docs/api/ios#lyrmessage) objects declare a boolean property, `isSent`, which tells your application if the message was successfully sent from your device and synchronized with the Layer service.
