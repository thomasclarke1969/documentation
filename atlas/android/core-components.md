#Core Components

##Participants and the ParticipantProvider
Every conversation can contain up to 25 users, which are referenced in Atlas through the `Atlas.Participant` interface. You can then add other relevant fields (such as avatar image, username, phone number, etc).

```java
public class Participant implements Atlas.Participant {
    public String userId;
    public String firstName;
    public String lastName;
    public Bitmap avatarImg;

    public String getId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
    
    public Bitmap getAvatarImasge(){
        return avatarImg;
    }
}
```

You will also need to implement the `Atlas.ParticipantProvider` interface in order to allow the authenticated user to start conversations with other users:

```java
public class ParticipantProvider implements Atlas.ParticipantProvider {

    private final Map<String, Participant> mParticipantMap = new HashMap<String, Participant>();

    public ParticipantProvider() {

    }

    public void refresh() {
        //Load this user's contact list into the mParticipantMap
    }

    public Map<String, Atlas.Participant> getParticipants(String filter, Map<String, Atlas.Participant> result) {
        if (result == null) {
            result = new HashMap<String, Atlas.Participant>();
        }

        if (filter == null) {
            for (Participant p : mParticipantMap.values()) {
                result.put(p.getId(), p);
            }
            return result;
        }

        for (Participant p : mParticipantMap.values()) {
            if (p.firstName != null && !p.firstName.toLowerCase().contains(filter)) {
                result.remove(p.getId());
                continue;
            }
            if (p.lastName != null && !p.lastName.toLowerCase().contains(filter)) {
                result.remove(p.getId());
                continue;
            }
            result.put(p.getId(), p);
        }
        return result;
    }

    @Override
    public Atlas.Participant getParticipant(String userId) {
        return get(userId);
    }
}
```

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

//Intialize the conversationsList by passing in its root, the LayerClient and Atlas.ParticipantProvider
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