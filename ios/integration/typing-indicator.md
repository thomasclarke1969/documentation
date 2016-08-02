# Typing indicator

LayerKit provides a simple API which allows applications to both broadcast and receive typing indicator events. This functionality allows Layer powered applications to implement user interfaces to inform users that another participant is actively engaged in communicating with them.

## Broadcasting

Applications can broadcast typing events by calling `sendTypingIndicator:` on `LYRConversation` objects. This will send a typing indicator event on behalf of the currently authenticated user. All participants in the conversation who are currently online will receive the typing indicator. LayerKit supports three typing indicator states: `LYRTypingIndicatorActionBegin`, `LYRTypingIndicatorActionPause`, and `LYRTypingIndicatorActionFinish`.

```
// Sends a typing indicator event to the given conversation.
[conversation sendTypingIndicator:LYRTypingIndicatorActionBegin];
```

## Receiving

Applications are notified of typing indicator events via `NSNotification` objects broadcast via the default `NSNotificationCenter`. Applications should register as an observer of the `LYRConversationDidReceiveTypingIndicatorNotification` notification to be notified when another user is typing.

```
// Registers an object for typing indicator notifications.
[[NSNotificationCenter defaultCenter] addObserver:self
                                         selector:@selector(didReceiveTypingIndicator:)
                                             name:LYRConversationDidReceiveTypingIndicatorNotification
                                           object:nil];
```

Upon receipt of a typing indicator event, applications can inspect properties of the `NSNotification` object received to obtain information about the typing event. The `object` property of the notification is a reference to the `LYRConversation` object in which the typing indicator was sent. The `userInfo` property contains additional detail about the typing event. The `LYRTypingIndicatorParticipantUserInfoKey` key contains the user identifier of the user who sent the typing indicator to the conversation.

```
- (void)didReceiveTypingIndicator:(NSNotification *)notification
{
    NSString *participantID = notification.userInfo[LYRTypingIndicatorParticipantUserInfoKey];
    LYRTypingIndicator *typingIndicator = notification.userInfo[LYRTypingIndicatorObjectUserInfoKey];
    
    if (typingIndicator.action == LYRTypingIndicatorActionBegin) {
        NSLog(@"Typing Started");
    } else {
        NSLog(@"Typing Stopped");
    }
}
```

## Intended use

Typing indicator events are ephemeral, meaning they are not persisted by Layer. Applications are free to call `sendTypingIndicator:toConversation` as often as they would like. LayerKit will coalesce the calls internally and efficiently send typing indicator events as needed.

After calling `sendTypingIndicator:` with the `LYRTypingIndicatorActionBegin` state, if 10 seconds go by without an update, LayerKit will automatically send an `LYRTypingIndicatorActionPause` event. If another 10 seconds go without an update, LayerKit will send an `LYRTypingIndicatorActionFinish` event.
