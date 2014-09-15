# Displaying A Conversation

In order to display a list of messages comprising an individual conversation, you would implement the following;

```
// Fetch all messages for a given conversation object
NSOrderedSet *messages = [layerClient messagesForConversation:conversation];
```


In order to extract the actual content from a message, you must acquire the individual message parts

```
//Get the array of parts from a message
LYRMessage *message = [messages objectAtIndex:0];

NSArray *parts = [message parts];

//Get the first part
LYRMessagePart *part =[ parts objectAtIndex:0]

//If the part is plain text, convert NSData to NSString
if (part.MIMEType == LYRMIMETypeTextPlain) {
    NSString *string = [[NSString alloc] initWithData:part.data encoding:NSUTF8StringEncoding];
}
```


Additionally, you can fetch all conversations for the currently signed in user via the following:

```
// Returns an NSOrderedSet of all conversations for the signed in user
NSOrderedSet *conversations = [layerClient conversationsForIdentifiers:nil];
```
