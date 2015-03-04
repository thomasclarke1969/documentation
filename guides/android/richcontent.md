# Rich Content
Rich Content will be coming to Android in version v0.10

# Rich Content
The Layer messaging service allows developers to send messages with a maximum aggregate content size of up to 2GB. To help applications effectively manage bandwidth and battery concerns when transferring large messages, Layer allows developers to specify the size of `MessageParts` and/or the types of content that should be automatically downloaded. Alternatively, applications can choose to download large message parts only when needed via on-demand downloads. 

### Auto-download Size 
Be default, LayerKit will automatically download content for message parts whose content size is less than 2KB. If developers would like to raise this limit, they can do so by passing a value to the `setAutoDownloadSizeThreshold` method on the `LayerClient` object.

The following example demonstrates how LayerKit can be configured to automatically download all message parts whose content size is less that 100KB. 

```java
layerClient.setAutoDownloadSizeThreshold(1024 * 100);
```

### Auto-download MIME Types
Applications can configure the types content that they would like to be automatically downloaded by passing values to the `setAutoDownloadMimeTypes` method on the `LayerClient` object. `MessageParts` that are then sent with these MIME Types will always be automatically downloaded, regardless of their content size. 

The following example demonstrates how an application can configure Layer to automatically download data for `MessagePart` objects with a MIME Type of `image/jpeg`.

```java
layerClient.setAutoDownloadMimeTypes(Arrays.asList("image/jpeg"));
```

### On-Demand Downloads and Progress Feedback
`MessagePart` content can also be downloaded on an on-demand basis. This is done via a call to the `downloadContent:` method on the `LayerClient` object. The method takes a `LayerProgressListener` that reports progress of the download transfer.

First, define your progress listener. Keep in mind that each callback method has an `Operation` which will either be set to `UPLOAD` or `DOWNLOAD` depending on which function the Progress Listener is attached to.

```java
public class MyProgressListener implements LayerProgressListener {

    @Override
    public void onProgressUpdate(MessagePart part, Operation operation, long bytes){
        //You can calculate the percentage complete based on the size of the Message Part
        float pctComplete = bytes / part.getSize();

        //Use this to update any GUI elements associated with this Message Part
        System.out.println(operation.toString() + " Percent Complete: " + pctComplete);
    }

    @Override
    public void onProgressComplete(MessagePart part, Operation operation){
        System.out.println("Message part finished " + operation.toString());
    }

    @Override
    public void onProgressError(MessagePart part, Operation operation, Exception e){
        System.out.println("Message part error " + operation.toString());
        System.out.println(e);
    }
}
```

Then, you can initiate the Message Part download.

```java
//If invoked on a message with data already locally available, it will be returned 
// in the callback immediately
layerClient.getMessageData(messagePart, new MyProgressListener());
```

### Transfer Status
`MessagePart` provides a `TransferStatus` property which allows applications to inquire as to the status of content uploads when sending a message, or content download when downloading message content. This property will return one of the following enumerated values:

* `AWAITING_UPLOAD` - Message content is enqueued locally and awaiting upload. 
* `UPLOADING` - Message content is in the process of uploading. 
* `READY_FOR_DOWNLOAD` - Message content is ready for download but not yet downloaded to the device. 
* `DOWNLOADING` - Message content is in the process of downloading. 
* `COMPLETE` - Message content transfer (either upload or download) is complete. 

###Disk Space Management
You have the option to determine how much disk space Layer can use on the local device. If locally cached content goes above this limit, then assets will be deleted, with the least recently accessed content deleted first.

```java
//Sets the local disk space Layer is allowed to use (in bytes). Passing in a value of 
// 0 will remove any limit (this is the default behavior)
layerClient.setDiskCapacity(1024 * 1024 * 50); //Sets the limit to 50 MB

//Returns the amount of disk capacity (in bytes) Layer is set to use
long layerCapacity = layerClient.getDiskCapacity();

//Check Layer's actual usage (in bytes)
long usage = layerClient.getDiskUtilization();

//You can always choose to delete a Message Part (locally only - the server is not affected) 
layerClient.deleteLocalMessageData(messagePart);
```