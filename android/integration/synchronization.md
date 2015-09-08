# Synchronization

The Layer client provides a flexible notification system for informing applications when changes have occurred on Layer objects in response to synchronization. The system is designed to be general purpose and alerts your application to the creation, update, or deletion of an object. Changes are modeled as simple dictionaries with a fixed key space.

## Event Listener
The Layer SDK leverages listeners to notify your application when changes occur. Your application should register as a `LayerChangeEventListener` in order to receive change notifications.

```java
public class MyApplication extends Application implements LayerChangeEventListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LayerClient client = LayerClient.newClient(this, "%%C-INLINE-APPID%%");
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

## Historic Synchronization
With historic synchronization, the client can specify the messages of the conversation that should be retrieved instead of syncing all historic data. If the client would like to sync it's older messages, it can simply request the next set of messages, and those messages will be synced locally. By default the Layer SDK will sync messages starting with the earliest unread message in the conversation. In order to change this, the client will need to pass a specific historic sync policy via option. There are three options that can be passed into the options object:

  1. `FROM_EARLIEST_UNREAD_MESSAGE` - This option will retrieve all messages from the earliest unread messages.     This is the new default in the LayerSDK.
  2. `ALL_MESSAGES` - This option will sync all messages from every conversation.
      Note: This might significantly affect bandwidth and performance.
  3. `FROM_LAST_MESSAGE` - This will sync only the last message of each conversation.

```java
final LayerClient.Options options = new LayerClient.Options();
options.historicSyncPolicy(LayerClient.Options.HistoricSyncPolicy.ALL_MESSAGES);
```

To support partial sync, the Conversation object has been updated with the following new methods:

  1. `getTotalMessageCount()` - This method will return the total number of messages in a conversation, including all historic messages that have yet to be synced.
  2. `getTotalUnreadMessageCount()` - This method will return the total number of unread messages in a conversation including all unread historic messages.
  3. `syncMoreHistoricMessages(int suggestedNumberOfMessages)` - This method will sync at least the specified number of historic messages in a conversation.
  4. `syncFromEarliestUnreadMessage` - Synchronizes message history starting from the earliest unread Message up to the last Message.
  5. `syncAllHistoricMessages()` - This method will sync all messages in the conversation.
  6. `getHistoricSyncStatus()` - This method will return one of values from HistoricMessageStatus. Based on the returned value, you can determine the historic message status for the conversation. The states are as follows:

  	1. `NO_MORE_AVAILABLE` - This state is returned if the all the messages have been downloaded from the server.
  	2. `MORE_AVAILABLE` - This state is returned if there are messages that could be synced from the server.
  	3. `SYNC_PENDING` - This state is returned when there is a pending request to sync historic messages from the server.

## Synchronization Listener
The Layer SDK also provides a synchronization listener that alerts your application when a synchronization is about to begin, and when a synchronization has successfully completed. `onBeforeSync`,`onSyncProgress` and`onAfterSync` will only recieve notifications during the first sync (first time a user logs in or when a user logs in on a new device). `onSyncError` will be notified if any error occurs anytime a syncronization is happening. Your application should register as a `LayerSyncListener` to receive these call backs.

```java
public class MyApplication extends Application implements LayerSyncListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LayerClient client = LayerClient.newClient(this, "%%C-INLINE-APPID%%");
        client.registerSyncListener(this);

    }

    public void onBeforeSync(LayerClient client) {
    	// LayerClient is starting synchronization
    }
    public void onSyncProgress(LayerClient client) {
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
