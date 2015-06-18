#Typing Indicator
The Layer SDK provides a simple API which allows applications to both broadcast and receive typing indicator events. This functionality allows Layer powered applications to implement dynamic UI in response to typing events. 

##Broadcasting
Applications can broadcast typing events by calling `send(...)` on the `Conversation` object. This will send a typing indicator event on behalf of the currently authenticated user. All participants in the conversation will receive the typing indicator.  The Layer SDK supports three typing indicatory states: `TypingIndicator.STARTED`, `TypingIndicator.PAUSED`, `TypingIndicator.FINISHED`. 

```
// Sends a typing indicator event to the given conversation.
mConversation.send(TypingIndicator.STARTED);
```

##Receiving 
Applications are notified of typing indicator events via `LayerTypingIndicatorListener`. Applications should register as a `LayerTypingIndicatorListener` in order to be notified when another device is typing.

```
public class MyApplication extends Application implements LayerTypingIndicatorListener {

    @Override
    protected void onResume() {
        super.onResume();
        // Register this Activity to receive remote typing indications from Layer
        layerClient.registerTypingIndicator(this);
    }
 
     @Override
    protected void onPause() {
        // Stop receiving remote typing indications from Layer when this Activity pauses
        mClient.unregisterTypingIndicator(this);
        super.onPause();
    }
     
}
```

Upon receipt of a typing indicator event, applications can check the conversation, userId, and indicator for information about the typing event.

```
   @Override
    public void onTypingIndicator(LayerClient client, Conversation conversation, String userId, TypingIndicator indicator) {
 
        switch (indicator) {
            case STARTED:
                // This user started typing, so add them to the typing list.
                mTypers.add(userId);
                break;
 
            case PAUSED:
                // Ignore pause, since we only show who is and is not typing.
                break;
 
            case FINISHED:
                // This user isn't typing anymore, so remove them from the list.
                mTypers.remove(userId);
                break;
        }
 
        // Update the current-typers UI.
        mTyperTextView.setText(TextUtils.join(", ", mTypers));
    }
}
```

## Intended Use
Typing indicator events are ephemeral, meaning they are not persisted by Layer. Applications are free to call `sendTypingIndicator(conversation, TypingIndicator.indicator)` as often as they would like.  The Layer SDK will coalesce the calls internally and efficiently send typing indicator events as needed. 

After calling `sendTypingIndicator(conversation, TypingIndicator.indicator)` with the `TypingIndicator.STARTED` state, if a few seconds go by without an update, the Layer SDK will automatically send an `TypingIndicator.PAUSED` event. If a few more seconds go without an update, the Layer SDK will send an `TypingIndicator.FINISHED` event. 



