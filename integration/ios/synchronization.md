# Synchronization

LayerKit provides a flexible notification system for informing applications when changes have occurred on Layer objects in response to synchronization. The system is designed to be general purpose and alerts your application to the creation, update, or deletion of an object. Changes are modeled as simple dictionaries with a fixed key space.

LayerKit leverages key-value observing to notify your application when changes occur. Your application should observe `LYRClientObjectsDidChangeNotification` in order to receive notifications.

```objectivec
// Adds the notification observer
[[NSNotificationCenter defaultCenter] addObserver:self
									     selector:@selector(didReceiveLayerObjectsDidChangeNotification:)
                                             name:LYRClientObjectsDidChangeNotification object:layerClient];
```

Upon receipt of an `LYRClientObjectsDidChangeNotification`, your application can obtain a reference to the changes it contains by retrieving the `LYRClientObjectChangesUserInfoKey` key from the `userInfo` dictionary of the notification object. This key references an array value wherein each element is a dictionary value that describes a specific change to a conversation or message object.

```objectivec
// Returns an array of the change dictionaries
 NSArray *changes = [notification.userInfo objectForKey:LYRClientObjectChangesUserInfoKey];
```

Change notifications occur for both [LYRMessage](api/ios#lyrmessage) and [LYRConversation](api/ios#lyrconversation) objects. Your application can retrieve the type of object upon which a change has occurred by retrieving the `LYRObjectChangeObjectKey` key from the change object.

```objectivec
for (NSDictionary *change in changes) {
	if ([[change objectForKey:LYRObjectChangeObjectKey] isKindOfClass:[LYRConversation class]]) {
		// Object is a conversation
	}

	if ([[change objectForKey:LYRObjectChangeObjectKey]isKindOfClass:[LYRMessage class]]) {
	    // Object is a message
	}
}

```

Change notifications will alert your application to object creation, update and deletion events. In order to acquire the specific type of change, your application can retrieve the `LYRObjectChangeTypeKey` key from the change object.

```objectivec
LYRObjectChangeType changeKey = (LYRObjectChangeType)[[change objectForKey:LYRObjectChangeTypeKey] integerValue];
switch (changeKey) {
    case LYRObjectChangeTypeCreate:
        //Object was created
        break;
    case LYRObjectChangeTypeUpdate:
        // Object was updated
        break;
    case LYRObjectChangeTypeDelete:
        // Object was deleted
        break;
    default:
        break;
}

```

Your application can acquire the actual object upon which an update has occurred by retrieving  the `LYRObjectChangeObjectKey` key from the change object.

```objectivec
// Returns the object for which a change has occurred
id changeObject = [change objectForKey:LYRObjectChangeObjectKey]
```

To above code can be combined in the following code block:

```objectivec
- (void) didReceiveLayerObjectsDidChangeNotification:(NSNotification *)notification;
{
    NSArray *changes = [notification.userInfo objectForKey:LYRClientObjectChangesUserInfoKey];
    for (NSDictionary *change in changes) {
        id changeObject = [change objectForKey:LYRObjectChangeObjectKey];
        if ([changeObject isKindOfClass:[LYRConversation class]]) {
            LYRObjectChangeType updateKey = (LYRObjectChangeType)[[change objectForKey:LYRObjectChangeTypeKey] integerValue];
            switch (updateKey) {
                case LYRObjectChangeTypeCreate:
                    //
                    break;
                case LYRObjectChangeTypeUpdate:
                    //
                    break;
                case LYRObjectChangeTypeDelete:
                    //
                    break;
                default:
                    break;
            }
        } else {
            LYRObjectChangeType updateKey = (LYRObjectChangeType)[[change objectForKey:LYRObjectChangeTypeKey] integerValue];
            switch (updateKey) {
                case LYRObjectChangeTypeCreate:
                    //
                    break;
                case LYRObjectChangeTypeUpdate:
                    //
                    break;
                case LYRObjectChangeTypeDelete:
                    //
                    break;
                default:
                    break;
            }
        }
    }
}
```

##Client Delegate
The `LayerClientDelegate` also declares synchronization methods which alert your application when `LayerKit` has successfully completed synchronization, or when a synchronization has failed. 

```objectivec
- (void)layerClient:(LYRClient *)client didFinishSynchronizationWithChanges:(NSArray *)changes;
{
    NSLog(@"Layer Client did finish synchronization");
}

- (void)layerClient:(LYRClient *)client didFailSynchronizationWithError:(NSError *)error
{
	NSLog()@"Layer Cliend did fail Synchronization with error:%@", error);
}
```
