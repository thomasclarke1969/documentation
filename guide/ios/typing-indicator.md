#Typing Indicator
LayerKit provides a simple API which allows applications to both broadcast and receive typing indicator events. This functionality allows Layer powered applications to implement dynamic UI in response to typing events. 

##Broadcasting
Applications can broadcast typing events by calling `sendTypingIndicator:toConversation:` on `LYRClient`. This will send a typing indicator event on behalf of the currently authenticated user. All participants in the conversation will receive the typing indicator. LayerKit supports three typing indicatory states: `LYRTypingDidBegin`, `LYRTypingDidPause`, `LYRTypingDidFinish`. 

```
// Sends a typing indicator event to the given conversation.
[layerClient sendTypingIndicator:LYRTypingDidBegin toConversation:self.conversation];
```

##Receiving 
Applications are notified of typing indicator events via `NSNotificationCenter`. Applications should register as an observer of the `LYRConversationDidReceiveTypingIndicatorNotification` key to be notified when another device is typing.

```
// Registers and object for typing indicator notifications.
[[NSNotificationCenter defaultCenter] addObserver:self
                                         selector:@selector(didReceiveTypingIndicator:)
                                             name:LYRConversationDidReceiveTypingIndicatorNotification 
                                           object:nil];
```

Upon receipt of a typing indicator event, applications can inspect the sending `notification` object's `userInfo` property for information about the typing event. The value for the `LYRTypingIndicatorParticipantUserInfoKey` key will be the sending participant's user identifier. Additionally, the `notification` object's `object` property will be the conversation in which the typing has occurred.

```
- (void)didReceiveTypingIndicator:(NSNotification *)notification
{   
    NSString *participantID = notification.userInfo[LYRTypingIndicatorParticipantUserInfoKey];
    LYRTypingIndicator typingIndicator = (LYRTypingIndicator)[notification[LYRTypingIndicatorValueUserInfoKey] unsignedIntegerValue];
    LYRConversation *conversation = (LYRConversation) [notification object];
    NSLog(@“Received typing indicator from %@ for conversation %@”, participantID, conversation);
}
```

## Intended Use
Typing indicator events are ephemeral, meaning they are not persisted by Layer. Applications are free to call `sendTypingIndicator:toConversation` as often as they would like. LayerKit will coalesce the calls internally and efficiently send typing indicator events as needed. 

After calling `sendTypingIndicator:toConversation` with the `LYRTypingDidBegin` state,  if 10 seconds go by without an update, LayerKit will automatically send an `LYRTypingDidPause` event. If another 10 seconds go without an update, LayerKit will send an `LYRTypingDidFinish` event. 



