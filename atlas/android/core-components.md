#Core components
Atlas provides several core pieces that allow you to start building a fully functional GUI experience around Layer.

![](my-atlas-app.png)

These are the key components of Atlas, and this tutorial will walk you through implementing each one:
* AtlasConversationsList - A View that displays all conversations associated with the authenticated user
* AtlasMessagesList - A View that displays the messages associated with a particular conversation
* AtlasMessageComposer - A View used to compose and send messages
* AtlasParticipantPicker - A View used to select participants with dynamic filtering
* AtlasTypingIndicator - A View that indicates whether other participants in a conversation are entering text
* Participant - An Interface which allows Atlas classes to render participant information
* ParticipantProvider - An Interface which provides Atlas classes with a list of potential participants

To learn more about these components, you can build and explore the provided Atlas Messenger app, or you can follow this tutorial which covers building a simple app using Atlas from scratch. We will build an app that will allow you to create conversations between three pre-defined users: the device, simulator, and web interface. With Atlas, the app will have a fully featured GUI experience using each of the components desribed above. 

You can also use this tutorial as a starting point for integrating Atlas into your own app. And since Atlas is completely open, you are free to extend or change the default functionality however you want!

In order to get started, create a new Android Studio project with the following settings
1. Select the Phone and Tablet platform with a minimum SDK of "API 14: Android 4.0 (IceCreamSandwich)"
2. Add a Blank Activity to your project
3. Name the Activity "ConversationActivity" and name the Layout "conversations_screen"

Then follow the steps in the previous section to import the Layer SDK and Atlas into the project.

##Showing the Conversations List
The first thing we want to do is display a list of conversations, and allow the user to create new ones. In `app/main/res/layout/conversations_screen.xml`, configure the layout to show the conversation list and a button for starting new conversations (note, you can import and use your own icons, or use any assets from the layer-atlas-messenger project).

```xml
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:atlas="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.layer.atlas.AtlasConversationsList
        android:id="@+id/conversationlist"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <View
        android:id="@+id/newconversation"
        android:layout_width ="72dp"
        android:layout_height="72dp"
        android:layout_gravity="bottom|right"
        android:layout_marginRight="8dp"
        android:layout_marginBottom="4dp"
        android:gravity="center"
        android:background="@drawable/atlas_ctl_btn_plus_big" />

</FrameLayout>
```

Then, in `ConversationsActivity.java`, you can authenticate your user with Layer. You can learn more about authentication [here](docs/integration#authentication). For this example, you can use the [MyAuthenticationListener class](https://github.com/layerhq/quick-start-android/blob/master/app/src/main/java/com/layer/quick_start_android/MyAuthenticationListener.java) from the Layer SDK Quick Start App.

```emphasis
Keep in mind that the sample Identity Token endpoint provided in the [Quick Start Guide](https://developer.layer.com/docs/quick-start/android) is for testing purposes only and **cannot** be used in production.
```

```java
public class ConversationsActivity extends ActionBarActivity {

    static public String AppID = "%%C-INLINE-APPID%%";

    static public LayerClient layerClient;
    static public Atlas.ParticipantProvider participantProvider;

    private AtlasConversationsList myConversationList;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.conversations_screen);

        layerClient = LayerClient.newInstance(this, AppID);
        layerClient.registerAuthenticationListener(new MyAuthenticationListener(this));
        layerClient.connect();
        if(!layerClient.isAuthenticated()) {
            layerClient.authenticate();
        } else {
            onUserAuthenticated();
        }
    }

    public static String getUserID(){
        if(Build.FINGERPRINT.startsWith("generic"))
            return "Simulator";
        return "Device";
    }

    public void onUserAuthenticated(){
    }
}
```

When the user has authenticated, you can configure the ParticipantProvider and initialize the ConversationList by defining the `onUserAuthenticated` function, which sets some default user data, and initializes each of the components in the layout.

```java
static class User implements Atlas.Participant{
    private String name;
    public User(String id) { name = id; }
    public String getFirstName() { return name; }
    public String getLastName() { return ""; }
}

public void onUserAuthenticated(){
    participantProvider  = new Atlas.ParticipantProvider() {
        Map<String, Atlas.Participant> users = new HashMap<String, Atlas.Participant>();
        {
            users.put("Device", new User("Device"));
            users.put("Simulator", new User("Simulator"));
            users.put("Dashboard", new User("Web"));
        }
        public Map<String, Atlas.Participant> getParticipants(String filter, 
            Map<String, Atlas.Participant> result) {

            for(Map.Entry<String, Atlas.Participant> entry : users.entrySet()){
                if(entry.getValue().getFirstName().indexOf(filter) > -1)
                    result.put(entry.getKey(), entry.getValue());
            }

            return result;
        }
        public Atlas.Participant getParticipant(String userId) {
            return users.get(userId);
        }
    };

    myConversationList = (AtlasConversationsList)findViewById(R.id.conversationlist);
    myConversationList.init(layerClient, participantProvider);
    myConversationList.setClickListener(new AtlasConversationsList.ConversationClickListener() {
        public void onItemClick(Conversation conversation) {
            startMessagesActivity(conversation);
        }
    });

    layerClient.registerEventListener(myConversationList);

    View newconversation = findViewById(R.id.newconversation);
    newconversation.setOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
            startMessagesActivity(null);
        }
    });
}

private void startMessagesActivity(Conversation c){
    //We will define this method later in the tutorial
}
```

If you compile and run your app now, you should authenticate as "Device" if you're running the app on actual hardware, or "Simulator" if you are running the app in an emulator. If you are using a Staging App ID, you should see at least one conversation that has been created for you.

##Showing the Messages in a Conversation
The next step will be defining a new activity to show the messages in each conversation when it is tapped. Create a new layout called `messages_screen.xml` in the `app/main/res/layout` folder and define it as so:

```xml
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:atlas="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1">

        <com.layer.atlas.AtlasMessagesList
            android:id="@+id/messageslist"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>

        <com.layer.atlas.AtlasTypingIndicator
            android:id="@+id/typingindicator"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>

        <com.layer.atlas.AtlasParticipantPicker
            android:id="@+id/participantpicker"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>

    </FrameLayout>

    <com.layer.atlas.AtlasMessageComposer
        android:id="@+id/textinput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>

</LinearLayout>
```

Now we need to create a new class called `MessagesActivity` which will show the layout and initialize each of the components. We will need to handle two different cases: when the user wants to view an existing conversation, and when they want to create a new conversation. To do this, we can pass the selected conversation to this activity through an intent. If no conversation is defined, we make the assumption that a new conversation will be created and show the participant picker.

```java
public class MessagesActivity extends ActionBarActivity {

    private AtlasMessagesList messagesList;
    private AtlasParticipantPicker participantPicker;
    private AtlasTypingIndicator typingIndicator;
    private AtlasMessageComposer atlasComposer;
    private Conversation conversation;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.messages_screen);

        Uri id = getIntent().getParcelableExtra("conversation-id");
        if(id != null)
            conversation = ConversationsActivity.layerClient.getConversation(id);

        messagesList = (AtlasMessagesList) findViewById(R.id.messageslist);
        messagesList.init(ConversationsActivity.layerClient, ConversationsActivity.participantProvider);
        messagesList.setConversation(conversation);

        participantPicker = (AtlasParticipantPicker) findViewById(R.id.participantpicker);
        String[] currentUser = {ConversationsActivity.layerClient.getAuthenticatedUserId()};
        participantPicker.init(currentUser, ConversationsActivity.participantProvider);
        if(conversation != null)
            participantPicker.setVisibility(View.GONE);

        typingIndicator = (AtlasTypingIndicator) findViewById(R.id.typingindicator);
        typingIndicator.init(conversation, new AtlasTypingIndicator.Callback(){
            public void onTypingUpdate(AtlasTypingIndicator indicator, Set<String> typingUserIds) {
            }
        });

        atlasComposer = (AtlasMessageComposer) findViewById(R.id.textinput);
        atlasComposer.init(ConversationsActivity.layerClient, conversation);
        atlasComposer.setListener(new AtlasMessageComposer.Listener(){
            public boolean beforeSend(Message message) {
                if(conversation == null){
                    String[] participants = participantPicker.getSelectedUserIds();
                    if(participants.length > 0){
                        participantPicker.setVisibility(View.GONE);
                        conversation = ConversationsActivity.layerClient.newConversation(participants);
                        messagesList.setConversation(conversation);
                        atlasComposer.setConversation(conversation);
                    } else {
                        return false;
                    }
                }
                return true;
            }
        });
    }

    protected void onResume() {
        super.onResume();
        ConversationsActivity.layerClient.registerEventListener(messagesList);
    }

    protected void onPause(){
        super.onPause();
        ConversationsActivity.layerClient.unregisterEventListener(messagesList);
    }
}
```

Now that we have defined our activities, the last step is to show the messages when the user taps on a specific conversation, or when they start a new conversation. In `ConversationsActivity.java` we can define the `startMessagesActivity` method:

```java
private void startMessagesActivity(Conversation c){
    Intent intent = new Intent(ConversationsActivity.this, MessagesActivity.class);
    if(c != null)
        intent.putExtra("conversation-id",c.getId());
    startActivity(intent);
}
```

And that's it! You can now create new conversations with a specified group of users, and send messages between a device and emulator.

The next sections will explain how to import your existing users into Atlas, as well as advanced topics such as modifying the GUI and sending custom payloads.