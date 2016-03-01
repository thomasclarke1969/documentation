# Synchronization

LayerKit provides a flexible notification system for informing applications when changes have occurred on Layer objects in response to synchronization. The system is designed to be general purpose and alerts your application to the creation, update, or deletion of an object. Changes are modeled as simple dictionaries with a fixed key space. This is an advanced feature and is intended for use in applications that require granular detail into everything occurring within Layer.

LayerKit leverages the `NSNotification` broadcast mechanism to notify your application when changes occur. Your application should observe `LYRClientObjectsDidChangeNotification` in order to receive notifications.

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

Change notifications occur for both [LYRMessage](/docs/ios/api#lyrmessage) and [LYRConversation](/docs/ios/api#lyrconversation) objects. Your application can retrieve the type of object upon which a change has occurred by retrieving the `object` property from the `LYRObjectChange` object.

```objectivec
for (LYRObjectChange *change in changes) {
    id changeObject = change.object;
    if ([changeObject isKindOfClass:[LYRConversation class]]) {
		// Object is a conversation
	}

    if ([changeObject isKindOfClass:[LYRMessage class]]) {
		// Object is a message
	}
}
```

Change notifications will alert your application to object creation, update and deletion events. In order to acquire the specific type of change, your application can retrieve the `type` property from the `LYRObjectChange` object.

```objectivec
LYRObjectChangeType updateKey = change.type;
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

To above code can be combined in the following code block:

```objectivec
- (void)didReceiveLayerObjectsDidChangeNotification:(NSNotification *)notification;
{
    NSArray *changes = [notification.userInfo objectForKey:LYRClientObjectChangesUserInfoKey];
    for (LYRObjectChange *change in changes) {
        id changeObject = change.object;
        LYRObjectChangeType updateKey = change.type;
        if ([changeObject isKindOfClass:[LYRConversation class]]) {
            // Object is a conversation
            LYRConversation *message = changeObject;

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
            // Object is a message
            LYRMessage *message = changeObject;

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

## Listening for a specific conversation or message

A common use case is to create a conversation/message via the [Platform API](https://developer.layer.com/docs/platform#create-a-conversation), and then access it in the SDK. A common mistake developers make is to try to query for the conversation/message before it's been synchronized to the device. To assist in receiving the object, LayerKit provides a convenience method that notifies you when that conversation/message has been synchronized if it hasn’t already called `waitForCreationOfObjectWithIdentifier`.

```objectivec
    NSURL *messageURL = [NSURL URLWithString:@"layer:///messages/2f002ba4-2a08-4019-9fa6-0fe30e2ac3f7"];
    // Retrieve LYRMessage from Message URL
    LYRQuery *query = [LYRQuery queryWithQueryableClass:[LYRMessage class]];
    query.predicate = [LYRPredicate predicateWithProperty:@"identifier" predicateOperator:LYRPredicateOperatorIsEqualTo value:messageURL];
    
    NSError *error = nil;
    NSOrderedSet *messages = [self.layerClient executeQuery:query error:&error];
    if (error) {
        // query failed
    }
    __block LYRMessage *message = messages.firstObject;
    if (!message) {
        // The message hasn't been synchronized
        [self.layerClient waitForCreationOfObjectWithIdentifier:messageURL timeout:3.0f completion:^(id  _Nullable object, NSError * _Nullable error) {
            if (object) {
                message = (LYRMessage*)object;
                // proceed with object
            } else {
                // object wasn't created in timeout with error
            }
        }];
    } else {
        // proceed with object
    }
```

## Client Delegate
The `LYRClientDelegate` protocol also declares synchronization methods which alert your application when objects have changed or when an operation has failed.

```objectivec
- (void)layerClient:(LYRClient *)client objectsDidChange:(NSArray *)changes;
{
    NSLog(@"Layer Client did finish synchronization");
}

- (void)layerClient:(LYRClient *)client didFailOperationWithError:(NSError *)error
{
	NSLog(@"Layer Client did fail Synchronization with error:%@", error);
}
```

```emphasis
**Best Practice**

For conversations with over 5 participants, you should disable delivery and read receipts to speed up syncing and improve overall performance. [Click here](https://support.layer.com/hc/en-us/articles/204144590-How-do-delivery-and-read-receipts-work-) to learn more.
```
