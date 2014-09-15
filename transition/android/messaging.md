# Sending A Message

To illustrate the some of the changes made to the Layer SDK, the following sample code demonstrates sending a message with Layer. Going forward, all messages sent with the Layer service will be sent within the context of a conversation. The high level steps to do so are the following:

  1. Initialize a conversation object with a list of participants (which is an array of user identifiers)
  2. Initialize the message content via LYRMessageParts
  3. Initialize a message object with the conversation and parts
  4. Send the message 

```
// 1. Initialize a conversation object
LYRConversation *conversation =[self.client conversationWithIdentifier:nil participants:@[@"USER_IDENTIFIER"]];

// 2. Initialize the message content via LYRMessageParts
LYRMessagePart *messagePart = [LYRMessagePart messagePartWithText:@"Hey there, how are you?"];

// 3. Initialize a message object with the content
LYRMessage *message = [self.client messageWithConversation:conversation parts:@[messagePart]];

// 4. Send the message within the context of the conversation
NSError *error;
[self.client sendMessage:message error:&error];
```


