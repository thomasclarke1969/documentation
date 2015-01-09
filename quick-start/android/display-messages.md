#Display Messages
The following demonstrates the logic needed to display conversations and messages between an authenticated user and another participant.

```java
//Returns all conversations between the authenticated user and specified <PARTICIPANT>
List<Conversation> allConversations = layerClient.getConversationsWithParticipants("<PARTICIPANT>");
```

You can then take any conversation and iterate through its messages:

```java
List<Message> messages = layerClient.getMessages(conversation);
```

You would access the content of the message through its MessageParts:

```java
public void printMessage(Message msg) {
    
    //Each message is composed of MessgeParts with a mime type that can be defined by the sender (default is "text/plain")
    Iterator itr = msg.getMessageParts().iterator();
    while(itr.hasNext()){
        MessagePart part = (MessagePart)itr.next();

        //In this case, we print text messages, but you can check for and handle whatever content you want
        if(part.getMimeType().equalsIgnoreCase("text/plain")){
            try {
                String msgText = new String(part.getData(), "UTF-8");
                System.out.println(msgText);
            } catch (UnsupportedEncodingException e) {
                //Handle encoding failure
            }
        }
    }
}
```

To detect changes to conversations or messages, take a look at the [Synchronization](https://developer.layer.com/docs/integration/android#synchronization) guide.