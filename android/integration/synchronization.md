# Synchronization

The Layer client provides a flexible notification system for informing applications when changes have occurred on Layer objects in response to synchronization. The system is designed to be general purpose and alerts your application to the creation, update, or deletion of an object. Changes are modeled as simple dictionaries with a fixed key space.

## Event Listener
The Layer SDK leverages listeners to notify your application when changes occur. Your application should register as a `LayerChangeEventListener` in order to receive change notifications.

```java
public class MyApplication extends Application implements LayerChangeEventListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LayerClient client = LayerClient.newClient(this, "%%C-INLINE-APPID%%", "GCM Project Number");
        client.registerEventListener(this);

    }
}
```

Upon receipt of a call to the `onMainThreadChanges()` method, your application can obtain a reference to all changes by calling `getChanges()` on the event object. This will return an array value wherein each element describes a specific change to a conversation or message object.

```java
public void onEventMainThread(LayerChangeEvent event) {
	List<LayerChange> changes = event.getChanges();
}
```

Change notifications occur for both `Message` and `Conversation` objects. Your application can retrieve the type of object upon which a change has occurred by calling `getObjectType()` on the change object.

```java
switch (change.getObjectType()) {
     case CONVERSATION:
     // Object is a conversation
     break;

     case MESSAGE:
     // Object is a message
     break;
}
break;
```

Layer Change notifications will alert your application to object creation (insert), update and deletion events. In order to acquire the specific type of change, your application can call getChangeType() on the change object.

``` java
switch (change.getChangeType()) {
	case INSERT:
	// Object was created
	break;

	case UPDATE:
	// Object was updated
	break;

	case DELETE:
	// Object was deleted
	break;
}
break;
```

Your application can acquire the actual object on which an update has occurred with `change.getObject()`.

```java
Object changeObject = change.getObject();
```

## Partial Synchronization
With partial sync, the Layer client can specify the messages of the conversation that should be retrieved instead of pulling down all historic data. If the client would like to see their older messages they can simply request the next set of messages and it will be fetched locally. By default the Layer SDK will download messages starting with the earliest unread message in the conversation. In order to change this, the client will need to pass a specific cold sync option. There are three options that can be passed into the options object:

1. `FETCH_FROM_EARLIEST_UNREAD_MESSAGE` - This option will retrieve all messages from the earliest unread messages.     This is the new default in the LayerSDK.
2. `FETCH_ALL_MESSAGES` - This option will fetch all messages from every conversation.
    Note: This might significantly affect bandwidth and performance.
3. `FETCH_LAST_MESSAGE_ONLY` - This will fetch only the last message of each conversation.
```java
final LayerClient.Options options = new LayerClient.Options();
options.coldSyncOptions(LayerClient.Options.ColdSyncOption.FETCH_ALL_MESSAGES); 
```
To support partial sync, the Conversation object has been updated with the following new methods:

1. `getTotalMessageCount()` - This method will return the total number of messages in a conversation, including all historic messages that have yet to be fetched.
2. `getTotalUnreadMessageCount()` - This method will return the total number of unread messages in a conversation including all unread historic messages.
3. `fetchMoreHistoricMessages(int suggestedNumberOfMessages)` - This method will fetch at least the specified number of historic messages in a conversation. 
4. `fetchAllHistoricMessages()` - This method will fetch all messages in the conversation.
5. `getHistoricMessageStatus()` - This method will return one of values from HistoricMessageStatus. Based on the returned value, you can determine the historic message status for the conversation. The states are as follows:

	5.1. `FETCHED_ALL_MESSAGES` - This state is returned if the all the messages have been downloaded from the  	             server.
	5.2. `HAS_MORE_MESSAGES_TO_FETCH` - This state is returned if there are messages that could be fetched from 	             the server. 
	5.3. `FETCH_PENDING` - This state is returned when there is a pending request to fetch historic messages 	              from the server.

## Synchronization Listener
The Layer SDK also provides a synchronization listener that alerts your application when a synchronization is about to begin, and when a synchronization has successfully completed. `onBeforeSync`,`onProgress` and`onAfterSync` will only recieve notifications during a cold sync (first time a user logs in or when a user logs in on a new device). `onSyncError` will be notified if any error occurs anytime a syncronization is happening. Your application should register as a `LayerSyncListener` to receive these call backs.

```java
public class MyApplication extends Application implements LayerSyncListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LayerClient client = LayerClient.newClient(this, "%%C-INLINE-APPID%%", "GCM Project Number");
        client.registerSyncListener(this);

    }

    public void onBeforeSync(LayerClient client) {
    	// LayerClient is starting synchronization
    }
    public void onProgress(LayerClient client) {
    	// LayerClient synchronization progress
    }
    public void onAfterSync(LayerClient client) {
    	// LayerClient has finished synchronization
    }
    void onSyncError(LayerClient client, List<LayerException> exceptions);
    	// Sync has thrown an error
    }
}
```

```emphasis
**Best Practice**

For conversations with over 5 participants, you should disable delivery and read receipts to speed up syncing and improve overall performance. [Click here](https://support.layer.com/hc/en-us/articles/204144590-How-do-delivery-and-read-receipts-work-) to learn more.
```
