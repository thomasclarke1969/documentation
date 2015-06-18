#Display Messages
The following demonstrates the logic needed to display conversations and messages between an authenticated user and another participant. You can find all the conversations between the authenticated user and any other participant(s) like so:

```java
//Returns all conversations between the authenticated user and specified <PARTICIPANT>
List<Conversation> allConversations = layerClient.getConversationsWithParticipants("<PARTICIPANT>");
```

After you choose a conversation, you can display all of its messages. In this example, we assume that you have a LinearLayout, but you can use any layout object that allows multiple children, or a custom view that you have configured.

```java
//Takes a LinearLayout and Layer Conversation and constructs a TextView with each message
public void drawConversation(LinearLayout parent, Conversation conversation) {
    //Get a list of all messages in the conversation
    List<Message> messages = layerClient.getMessages(conversation);

    //Display each message in turn
    for(int i = 0; i < messages.size(); i++){
        //Grab the current message
        Message currentMessage = messages.get(i);

        //Find out who sent it, and what the message says. The format will look like:
        //  User says:
        //  Hi, I'm using Layer to send real time messages!
        String senderText = currentMessage.getSentByUserId() + " says:";
        String messageText = getMessageText(currentMessage);

        //Create a new text view and set its content
        TextView messageView = new TextView(parent.getContext());
        messageView.setText(senderText + "\n" + messageText);

        //Add that view to your parent object
        parent.addView(messageView);
    }
}

//Takes a Layer Message and returns the contents
public String getMessageText(Message msg) {
    //Stores the contents of the message
    String msgText = "";

    //Each message is composed of MessgeParts with a mime type that can be defined by the sender (default is "text/plain")
    Iterator itr = msg.getMessageParts().iterator();
    while(itr.hasNext()){
        MessagePart part = (MessagePart)itr.next();

        //In this case, we print text messages, but you can check for and handle whatever content you want
        if(part.getMimeType().equalsIgnoreCase("text/plain")){
            try {
                //Put together the message, with a newline between each part
                msgText += new String(part.getData(), "UTF-8") + "\n";
            } catch (UnsupportedEncodingException e) {
                //Handle encoding failure
            }
        }
    }

    return msgText;
}
```

To detect changes to conversations or messages, take a look at the [Synchronization](/docs/android/integration#synchronization) guide.