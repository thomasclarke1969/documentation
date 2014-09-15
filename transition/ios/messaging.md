# Sending A Message

To illustrate the some of the changes made to the Layer SDK, the following sample code demonstrates sending a message with Layer. Going forward, all messages sent with the Layer service will be sent within the context of a conversation. The high level steps to do so are the following:

  1. Initialize a conversation object with a list of participants (which is an array of user identifiers)
  2. Initialize the message content via LYRMessageParts
  3. Initialize a message object with the conversation and parts
  4. Send the message 

```objectivec
// Creates and returns a new conversation object with a sample participant identifier
LYRConversation *conversation = [LYRConversation conversationWithParticipants:@[@"9337289330"]];

// Creates a message part with a text/plain MIMEType
NSData *message = [@"Hi, how are you?" dataUsingEncoding:NSUTF8StringEncoding];LYRMessagePart *messagePart = [LYRMessagePart messagePartWithMIMEType:LYRMIMETypeTextPlain data:message];// Creates and returns a new message object with the given conversation and array of message partsLYRMessage *message = [LYRMessage messageWithConversation:conversation parts:@[messagePart]];
//Sends the specified message[layerClient sendMessage:message error:nil];
```


