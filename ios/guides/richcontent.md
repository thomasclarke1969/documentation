# Rich Content
The Layer messaging service allows developers to send messages with a maximum aggregate content size of up to 2GB. To help applications effectively manage bandwidth and battery concerns when transferring large messages, Layer allows developers to specify the size of `LYRMessageParts` and/or the types of content that should be automatically downloaded. Alternatively, applications can choose to download large message parts only when needed via on-demand downloads. 

### Uploading

If your message contains large `LYRMessagePart`s they will start uploading as soon as you send the message.  You can track the status of the upload by checking the [transfer status](#transferstatus).

### Auto-download Size 
By default, LayerKit will automatically download content for message parts whose content size is less than 2KB. If developers would like to raise this limit, they can do so by setting a value for the `autodownloadMaximumContentSize` property on `LYRClient`.

The following example demonstrates how LayerKit can be configured to automatically download all message parts whose content size is less that 100KB. 

```objc
self.layerClient.autodownloadMaximumContentSize = 1024 * 100;
```

### Auto-download MIME Types
Applications can configure the types content that they would like to be automatically downloaded by setting values for the `autodownloadMIMETypes` property on `LYRClient`. `LYRMessageParts` that are then sent with these MIME Types will always be automatically downloaded, regardless of their content size. 

The following example demonstrates how an application can configure Layer to automatically download data for `LYRMessagePart` objects with a MIME Type of `image/jpeg`.

```objc
self.layerClient.autodownloadMIMETypes = [NSSet setWithObjects:@"image/jpeg", nil];
```

### On-Demand Downloads
`LYRMessagePart` content can also be downloaded on an on-demand basis. This is done via a call to the `downloadContent:` method on `LYRMessagePart`. Method returns a `LYRProgress` that reports progress of the download transfer.

```objc
LYRMessagePart *messagePart = self.message.parts.firstObject;

NSError *error;
LYRProgress *progress = [messagePart downloadContent:&error];
if (error) {
    NSLog(@"Content failed download with error %@", error); 
}
```

### Progress Feedback

Both auto-download and on-demand download report progress of the download transfer through `LYRProgress` which can be accessed depending on download type.
```objc
LYRMessagePart *messagePart = self.message.parts.firstObject;

//auto-download
LYRProgress *progress1 = messagePart.progress;

//on-demand download
NSError *error;
LYRProgress *progress2 = [messagePart downloadContent:&error];
```
The `LYRProgress` object allows applications to observe and track the download or upload status of a message part. The `fractionCompleted` property of `LYRProgress` objects informs applications as to the percentage of the content transfer operation that has completed. The `LYRProgress` object also declares the `LYRProgressDelegate` protocol which applications can implement in order to be notified of progress changes. 

```objc
@interface MyAwesomeApp () <LYRProgressDelegate>

@end

@implementation MyAwesomeApp

- (void)progressDidChange:(LYRProgress *)progress
{
    NSLog(@"Transfer progress changed %@", progress.fractionCompleted);
}
```
Note: Because the `LYRProgress` object has no reference to it's messagePart, it's best practice to set the `LYRProgress` object's delegate as the cell that it will update.

### LYRAggregateProgress 
Applications can also observe the aggregate progress of multiple content transfer operations by combining `LYRProgress` objects into an `LYRAggregateProgress` object. 

```objc
LYRMessagePart *part1 = self.message.parts[0];
LYRMessagePart *part2 = self.message.parts[1];
LYRMessagePart *part3 = self.message.parts[2];

NSError *error;
LYRProgress *progress1 = [LYRClient downloadContent:part1 error:&error];
LYRProgress *progress2 = [LYRClient downloadContent:part2 error:&error];
LYRProgress *progress3 = [LYRClient downloadContent:part3 error:&error];

LYRAggregateProgress *aggregateProgress = [LYRAggregateProgress aggregateProgressWithProgresses:@[progress1, progress2, progress3]];
```

<a name="transferstatus"></a>
### Transfer Status
`LYRMessageParts` provide a `transferStatus` property which allows applications to inquire as to the status of content uploads when sending a message, or content download when downloading message content. This property will return one of the following enumerated values:

* `LYRContentTransferAwaitingUpload` - Message content is enqueued locally and awaiting upload. 
* `LYRContentTransferUploading` - Message content is in the process of uploading. 
* `LYRContentTransferReadyForDownload` - Message content is ready for download but not yet downloaded to the device. 
* `LYRContentTransferDownloading` - Message content is in the process of downloading. 
* `LYRContentTransferComplete` - Message content transfer (either upload or download) is complete. 

If you want to know which messages have their content already downloaded (`transferStatus == LYRContentTransferComplete`) use this:

```objective-c
// Setup the predicate
LYRPredicate *transferStatusPredicate = [LYRPredicate predicateWithProperty:@"parts.transferStatus" operator:LYRPredicateOperatorIsLessThanOrEqualTo value:@(LYRContentTransferDownloading)];
LYRCompoundPredicate *negatedPredicate = [LYRCompoundPredicate compoundPredicateWithType:LYRCompoundPredicateTypeNot subpredicates:@[transferStatusPredicate]];

// Setup the query
LYRQuery *query = [LYRQuery queryWithClass:[LYRMessage class]];
query.predicate = negatedPredicate;

// Fetch results
NSError *error = nil;
NSOrderedSet *messages = [self executeQuery:query error:&error];

// or use it in your query controller...
LYRQueryController *controller = [self.client queryControllerWithQuery:query];
```

### Background Transfers

You can continue to download while in the background by enabling background transfers.  You can enable by setting the `backgroundContentTransferEnabled` property of `LYRClient` to `YES`.

```objc
self.layerClient.backgroundContentTransferEnabled = YES;
```

You must also implement this app delegate method where you invoke our background transfer handling logic:

```objc
- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)())completionHandler
{
    [self.applicationController.layerClient handleBackgroundContentTransfersForSession:identifier completion:^(NSArray *changes, NSError *error) {
        NSLog(@"Background transfers finished with %lu change(s)", (unsigned long)changes.count);
        completionHandler();
    }];
}
```

### Disk Space Management
You have the option to determine how much disk space Layer can use on the local device. If locally cached content goes above this limit, then assets will be deleted, with the least recently accessed content deleted first.

```objc
//Sets the local disk space Layer is allowed to use (in bytes). Passing in a value of 
// 0 will remove the limit (this is the default behavior)
self.layerClient.diskCapacity = 1024 * 1024 * 50; //Sets the limit to 50 MB

//Check Layer's actual usage (in bytes)
long usage = self.layerClient.currentDiskUtilization;

//You can always choose to delete a Message Part (locally only - the server is not affected) 
NSError *error = nil;
LYRProgress *progress = [messagePart purgeContent:&error];
```
