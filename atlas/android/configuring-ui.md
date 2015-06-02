# Configuring the Atlas UI

Atlas uses Style components and Views that allow you change almost any aspect of the user interface. The attributes for each component are defined in `/layer-atlas/src/main/res/values/atlas-styles.xml`, which can be found [here](https://github.com/layerhq/Atlas-Android/blob/master/layer-atlas/src/main/res/values/atlas-styles.xml#L42). Since Atlas is open source, you are free to make whatever changes you would like in order to achieve the look and feel you want in your app.

## Changing message text and background styles

![](atlas-android-msg-style.png)

It is trivial to change the bubble background and color properties in the AtlasMessageList:

```xml
<com.layer.atlas.AtlasMessagesList
    android:id="@+id/messageslist"
    android:layout_width="match_parent"
    android:layout_height="match_parent"

    atlas:myBubbleColor="#CCFFFF"
    atlas:myTextColor="#444444"
    atlas:theirBubbleColor="#FFFFCC"
    atlas:theirTextColor="#444444"/>
```

This results in a light blue bubble when the authenticated user sends a message, and a light yellow bubble when another participant sends a message.

## Displaying the sender's name in the text bubble

![](atlas-android-msg-layout.png)

By default, Atlas displays the sender's initials next to the text bubbles. It's relatively easy to change this behavior so that the sender's name always appears in the text bubble itself. 

This will require making changes to Atlas itself. First, you need to remove the existing avatar components, then add the text components to the message view in order to draw the sender's name, and then populate the the new component.

1. Remove the default avatar view

 In `/layer-atlas/src/main/res/layout/atlas_view_messages_convert.xml`, find and remove (delete) the following components:

 - atlas_view_messages_convert_avatar_container (FrameLayout)
 - atlas_view_messages_convert_initials (TextView)

![](atlas-android-avatar-delete.png)

 Now, we need to remove any references to these components in the AtlasMessagesList class found in `layer-atlas/src/main/java/com/layer/atlas/AtlasMessagesList.java`. Specifically, you want to comment out or remove any references to `textAvatar`:

 ```
messagesList.setAdapter(messagesAdapter = new BaseAdapter() {

    ...

    public View getView(int position, View convertView, ViewGroup parent) {

        ...

        //TextView textAvatar = (TextView) convertView.findViewById(R.id.atlas_view_messages_convert_initials);
        View spacerRight = convertView.findViewById(R.id.atlas_view_messages_convert_spacer_right);
        if (myMessage) {
            spacerRight.setVisibility(View.GONE);
            //textAvatar.setVisibility(View.INVISIBLE);
        } else {
            spacerRight.setVisibility(View.VISIBLE);
            Atlas.Participant participant = participantProvider.getParticipant(userId);
            String displayText = participant != null ? Atlas.getInitials(participant) : "";
            //textAvatar.setText(displayText);
            //textAvatar.setVisibility(View.VISIBLE);
        }

        ...

        //textAvatar.setTextColor(avatarTextColor);
        //((GradientDrawable)textAvatar.getBackground()).setColor(avatarBackgroundColor);
        
        ...
    }
}
 ```

2. Add components to the message view

 Edit `layer-atlas/src/main/res/layout/atlas_view_messages_cell_text.xml` to look like so:

 ```
<FrameLayout
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/atlas_view_messages_cell_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <LinearLayout
        android:orientation="vertical"
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:id="@+id/atlas_linearlayout_outer">

        <LinearLayout
            android:orientation="vertical"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:background="@drawable/atlas_shape_rounded16_gray"
            android:id="@+id/atlas_linearlayout_bubble">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="User Name"
                android:id="@+id/atlas_view_messages_convert_username"
                android:textStyle="bold"
                android:textSize="16sp"
                android:paddingLeft="12dp"
                android:paddingTop="4dp"
                android:paddingRight="12dp"
                android:paddingBottom="6dp"
                android:singleLine="true"
                android:textColor="#ff383838"
                android:gravity="left" />

            <TextView
                android:id="@+id/atlas_view_messages_convert_text_counterparty"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="left|center_vertical"
                android:paddingTop="4dp"
                android:paddingBottom="6dp"
                android:paddingLeft="12dp"
                android:paddingRight="12dp"
                android:text=""
                android:textSize="16sp"
                android:minHeight="34dp" />

            <TextView
                android:id="@+id/atlas_view_messages_convert_text"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="left|center_vertical"
                android:paddingTop="4dp"
                android:paddingBottom="6dp"
                android:paddingLeft="12dp"
                android:paddingRight="12dp"
                android:text=""
                android:gravity="left|center_vertical"
                android:textSize="16sp"
                android:textColor="@color/atlas_text_white"
                android:minHeight="34dp"
                android:visibility="gone"/>

        </LinearLayout>

    </LinearLayout>

</FrameLayout>
 ```

3. Set username text in code

 Now we need to dynamically set the username text when a message is added to the conversation. When we render the message part with the content, we can access the user id, but we will need to access the ParticipantProvider to look up the user's human readable name. To that end, we need to create and set a global ParticipantProvider in `AtlasMessageList.java`:


 ```
private Atlas.ParticipantProvider myParticipantProvider;

public void init(LayerClient layerClient, final Atlas.ParticipantProvider participantProvider) {
    if (layerClient == null) throw new IllegalArgumentException("LayerClient cannot be null");
    if (participantProvider == null) throw new IllegalArgumentException("ParticipantProvider cannot be null");

    myParticipantProvider = participantProvider;

    ...
}
 ```

 Now we can find the right layout components and draw the sender's name in `onBind` method in the `TextCell` class:

 ```
private class TextCell extends Cell {

    ...

    public View onBind(ViewGroup cellContainer) {
        MessagePart part = messagePart;
        Cell cell = this;

        View cellText = cellContainer.findViewById(R.id.atlas_view_messages_cell_text);
        if (cellText == null) {
            cellText = LayoutInflater.from(cellContainer.getContext()).inflate(R.layout.atlas_view_messages_cell_text, cellContainer, false);
        }

        text = new String(part.getData());

        boolean myMessage = client.getAuthenticatedUserId().equals(cell.messagePart.getMessage().getSender().getUserId());
        LinearLayout outerLL = (LinearLayout) cellText.findViewById(R.id.atlas_linearlayout_outer);
        LinearLayout bubbleLL = (LinearLayout) cellText.findViewById(R.id.atlas_linearlayout_bubble);
        TextView username = (TextView) cellText.findViewById(R.id.atlas_view_messages_convert_username);
        TextView textMy = (TextView) cellText.findViewById(R.id.atlas_view_messages_convert_text);
        TextView textOther = (TextView) cellText.findViewById(R.id.atlas_view_messages_convert_text_counterparty);

        Atlas.Participant sender = myParticipantProvider.getParticipant(messagePart.getMessage().getSender().getUserId());
        String senderName = sender.getFirstName() + " " + sender.getLastName();
        username.setText(senderName);

        if (myMessage) {
            textMy.setVisibility(View.VISIBLE);
            textMy.setText(text);
            textOther.setVisibility(View.GONE);

            bubbleLL.setBackgroundResource(R.drawable.atlas_shape_rounded16_blue);

            outerLL.setGravity(Gravity.RIGHT);
            ((GradientDrawable)bubbleLL.getBackground()).setColor(myBubbleColor);
            textMy.setTextColor(myTextColor);
            textMy.setTypeface(myTextTypeface, myTextStyle);
        } else {
            textOther.setVisibility(View.VISIBLE);
            textOther.setText(text);
            textMy.setVisibility(View.GONE);

            ((GradientDrawable)bubbleLL.getBackground()).setColor(otherBubbleColor);
            textOther.setTextColor(otherTextColor);
            textOther.setTypeface(otherTextTypeface, otherTextStyle);
        }
        return cellText;
    }
}
 ```

And that's all you need to do in order to change how components are displayed in Atlas. In general, you need to configure the Layout or View, then specify any dynamic properties (based on conversation or message content) in code. 

Feel free to make as many changes to the Atlas code as you would like! It's open source, and easy to customize. In fact, you can take advantage of Layer's custom payload feature to display any sort of data you would like! In the next section, we will cover sending and displaying a unique message type.