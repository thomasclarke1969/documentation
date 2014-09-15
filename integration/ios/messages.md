# Messages

The [LYRMessage](/docs/api/ios#lyrmessage) object represents an individual message within a conversation. A message within the Layer service can consit of one or many pieces of content, represented by the [LYRMessagePart](/docs/api/ios#lyrmessagepart) object. 

## LYRMessagePart 

Layer does not enforce restrictions on the type of data you send through the service. As such, [LYRMessagePart](/docs/api/ios#lyrmessagepart) objects are initialized with an `NSData` object and a MIME type string. The MIME type string simply describes the type of content the [LYRMessagePart](/docs/api/ios#lyrmessagepart) object containts. 

The following demonstrates creating message parts with both `text/plain` and `image/jpeg` MIME types. 

```objectivec
// MIME type declarations
static NSString *const MIMETypeTextPlain = @"text/plain";
static NSString *const MIMETypeImageJPEG = @"image/jpeg";

// Creates a message part with a string of text and text/plain MIMEtype.
NSData *messageData = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeTextPlain data:messageData];

// Creates a message part with an image
UIImage *image = [UIImage imageNamed:@"awesomeImage.jpg"];
NSData *imageData = UIImagePNGRepresentation(image);
LYRMessagePart *imagePart = [LYRMessagePart messagePartWithMIMEType:MIMETypeImageJPG data:imageData];
```

The [LYRMessagePart](/docs/api/ios#lyrmessagepart) object also delares a convenince method for creating messages with `text/plain` MIME Type.

```objectivec
// Creates a message part with a string of text
LYRMessagePart *part = [LYRMessagePart messagePartWithText:@"Hi, how are you?"];
```

## LYRMessage 

[LYRMessage](/docs/api/ios#lyrmessage) objects are initialized with an array of [LYRMessagePart](docs/api/ios#lyrmessagepart) objects and an [LYRConversation](/docs/api/ios#lyrconversation) object.  The object is created by calling `messageWithConversation:parts:` on [LYRMessage](/docs/api/ios#lyrmessage). This creates an [LYRMessage](/docs/api/ios#lyrmessage) object that is ready to be sent.

```objectivec
// Creates and returns a new message object with the given conversation and array of message parts
LYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];
```

## Sending The Message

Once an [LYRMessage](/docs/api/ios#lyrmessage) object is initialized, it is ready to be sent. The message is sent by calling `sendMessage:error:` on `LYRClient`. 

```objectivec
//Sends the specified message
BOOL success = [layerClient sendMessage:message error:nil];
if (success) {
	NSLog(@"Message send succesfull");
} else {
	NSLog(@"Message send failed");
}
```

The `sendMessage` method returns a boolean value which indicates if the message has passed validation and was enqueued for delivery in the local data store. If LayerKit has a current network connection, the message will immediately be sent off of the device. Otherwise it will remain enqueued locally utill the SDK re-establishes a network connection. At that point, the SDK will automatically send the message. 

[LYRMessage](/docs/api/ios#lyrmessage) objects declare a boolean property, `isSent`, which tells your application if the message was succesfully sent from your device and synchronized with the Layer serice. Your application can observe this property to be notified when a message was successfull sent.

```objectivec
// Notifies the LYRClientDelegate that a message or messages were successfully sent
[self addObserver:message forKeyPath:@"isSent" options:NSKeyValueObservingOptionNew context:NULL];
```

Your application will then need to implement `observeValueForKeyPath:ofObject:change:context:` to respond to send notifications.

```objectivec
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"isSent"]) {
 		NSLog(@"Message sent");
    }
}
```

##Fetching Data

The [LYRClient](/docs/api/ios#lyrclient) object exposes a simple API for fetching all messages for a given conversation. This method will return an `NSOrderedSet of messages with in descending order.

```objectivec
// Fetch all messages for a given conversation object
NSOrderedSet *messages = [layerClient messagesForConversation:conversation];
```
