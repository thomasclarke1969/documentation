# Rich Content
The Layer messaging service allows developers to send `MessageParts` with a maximum size of up to 2GB. To help applications effectively manage bandwidth and battery concerns when transferring large messages, Layer allows developers to specify the size of `MessageParts` and/or the types of content that should be automatically downloaded. Alternatively, applications can choose to download large message parts only when needed via on-demand downloads. 

When either uploading or downloading Rich Content, you have the option of assigning a `ProgressListener` which has callbacks associated with the upload/download progress. These callbacks can help drive progress bars in your GUI, or any other user feedback mechanism in your app. Each callback method has an `Operation` parameter which will either be set to `UPLOAD` or `DOWNLOAD` depending on which function the Progress Listener is attached to.

```
public class MyProgressListener implements LayerProgressListener {

    public void onProgressStart(MessagePart part, Operation operation){
        System.out.println("Message part started " + operation.toString());
    }

    public void onProgressUpdate(MessagePart part, Operation operation, long bytes){
        //You can calculate the percentage complete based on the size of the Message Part
        float pctComplete = bytes / part.getSize();

        //Use this to update any GUI elements associated with this Message Part
        System.out.println(operation.toString() + " Percent Complete: " + pctComplete);
    }

    public void onProgressComplete(MessagePart part, Operation operation){
        System.out.println("Message part finished " + operation.toString());
    }

    public void onProgressError(MessagePart part, Operation operation, Throwable e) {
        System.out.println("Message part error " + operation.toString());
        System.out.println(e);
    }
}
```

### Sending Large Files
Sending large files with Rich Content works the same way as standard messages. You will create a new `MessagePart` with a Mime Type and `byte[]` array, attach it to a `Message` object and send it to a conversation. However, you can attach a ProgressListener like so:

```
// Creates a message part with an image and sends it to the specified conversation
public void sendImage(Bitmap imageBitmap, Conversation conversation, LayerClient layerClient){
    
    //Extract the byte data
    ByteArrayOutputStream stream = new ByteArrayOutputStream();
    imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
    byte[] imageData = stream.toByteArray();

    //Add the message part to a message and send it with a ProgressListener
    MessagePart messagePart = layerClient.newMessagePart("image/jpeg", imageData);
    Message message = layerClient.newMessage(Arrays.asList(messagePart));
    conversation.send(message, new MyProgressListener());
}
```

### Transfer Status
`MessagePart` provides a `TransferStatus` property which allows applications to inquire as to the status of content uploads when sending a message, or content download when downloading message content. This property will return one of the following enumerated values:

* `AWAITING_UPLOAD` - Message content is enqueued locally and awaiting upload. 
* `UPLOADING` - Message content is in the process of uploading. 
* `READY_FOR_DOWNLOAD` - Message content is ready for download but not yet downloaded to the device. 
* `DOWNLOADING` - Message content is in the process of downloading. 
* `COMPLETE` - Message content transfer (either upload or download) is complete. 

### Auto-download Size 
Be default, LayerKit will automatically download content for message parts whose content size is less than 2KB. If developers would like to raise this limit, they can do so by passing a value to the `setAutoDownloadSizeThreshold` method on the `LayerClient` object.

The following example demonstrates how Layer can be configured to automatically download all message parts whose content size is less than 100KB. 

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
`MessagePart` content can also be downloaded on an on-demand basis. The method takes a `LayerProgressListener` that reports progress of the download transfer.

```java
public void downloadMessagePart(MessagePart part){
    
    //You can add whatever conditions make sense. In this case, we only start the download if the MessagePart is ready (not DOWNLOADING or COMPLETE)
    if(part.getTransferStatus() == MessagePart.TransferStatus.READY_FOR_DOWNLOAD){
        part.download(new LayerProgressListener() {
            @Override
            public void onProgressStart(MessagePart messagePart, Operation operation) {

            }

            @Override
            public void onProgressUpdate(MessagePart messagePart, Operation operation, long l) {
                //You can calculate the percentage complete based on the size of the Message Part
                float pctComplete = bytes / part.getSize();

                //Use this to update any GUI elements associated with this Message Part
                System.out.println(operation.toString() + " Percent Complete: " + pctComplete);
            }

            @Override
            public void onProgressComplete(MessagePart messagePart, Operation operation) {
    
                //Handle whatever MIME types you are expecting
                if(messagePart.getMimeType().equals("image/jpg")){
                    byte[] myData = messagePart.getData();
                    Bitmap image = BitmapFactory.decodeByteArray(myData, 0, myData.length);
                    //Display image in GUI
                }
            }

            @Override
            public void onProgressError(MessagePart messagePart, Operation operation, Throwable throwable) {

            }
        });
    }
}
```

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