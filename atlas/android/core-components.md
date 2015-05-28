#Core Components

## Conversation and Message Frame Layouts
To implement Atlas, you need to add the AtlasConversationsList and AtlasMessagesList views to Layouts in your project. Both work off the same principles, but the AtlasConversationList shows all conversations that the user is a part of, and the AtlasMessagesList shows all messages in a specific conversation (including creating a cell for each MessagePart based on the MimeType).

For example, here is how the AtlasConversationsList is implemented:

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent" 
    android:background="@color/atlas_background_white"
    >

<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    >

<com.layer.atlas.AtlasConversationsList
    android:id="@+id/atlas_screen_conversations_conversations_list"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />

</LinearLayout>

</FrameLayout>
```

Then, when you set this view in your Conversations Screen, you can initialize the AtlasConversationList object to automatically keep the view up to date.

```java
//Grab the conversationsList view
AtlasConversationsList conversationsList = (AtlasConversationsList)findViewById(R.id.atlas_screen_conversations_conversations_list);

//Intialize the conversationsList by passing in its root, the LayerClient object, and 
// Atlas.ParticipantProvider interface (which manages the user's contact list)
conversationsList.init(conversationsList, app.getLayerClient(), app.getParticipantProvider());

//Set the callback handler to start a new Activity that will display and initialize the
// AtlasMessagesList when clicked
conversationsList.setClickListener(new ConversationClickListener() {
    public void onItemClick(Conversation conversation) {
        openChatScreen(conversation, false);
    }
});

//Set the callback handler to delete the conversation when it is long clicked
conversationsList.setLongClickListener(new ConversationLongClickListener() {
    public void onItemLongClick(Conversation conversation) {
        conversation.delete(DeletionMode.ALL_PARTICIPANTS);
        Toast.makeText(this, "Deleted: " + conversation, Toast.LENGTH_SHORT).show();
    }
});
```

##Query Adapters
The AtlasConversationsList and AtlasMessagesList classes use QueryAdapters which automatically update the views whenever relevant changes are detected. For example, a QueryAdapter that takes a conversation Query will automatically add new conversations to the view when the authenticated user either starts a new conversation, or is added to a conversation by another user.