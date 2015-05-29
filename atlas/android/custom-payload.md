# Sending a Custom Payload
This HowTo guide will show you how to add a custom payload to Atlas Messanger. In this case, we will have a new widget that sends a JSON formatted message with a specific text payload. However, you can follow these steps to add any custom payload that isn't already supported by Atlas.

To add support for a custom message payload, we need to do the following:

1. Add a new button to the Atlas Message Composer
2. Send a message containing a custom mime type
3. Display a custom cell when rendering a message with that custom mime type


##Add a Custom Widget

Add the following button after the `atlas_message_composer_send` text view in `/layer-atlas/src/main/res/layout/atlas_message_composer.xml`

```xml
<TextView
android:id="@+id/atlas_message_composer_star"
android:layout_width="wrap_content"
android:layout_height="40dp"
android:layout_gravity="bottom"
android:layout_marginRight="4dp"
android:gravity="left|center_vertical"
android:maxLines="1"
android:paddingLeft="12dp"
android:paddingRight="12dp"
android:textSize="@dimen/atlas_text_size_general"
android:textColor="@color/atlas_text_gray"
android:text="STAR"
/>
```

##Send a Message with a Custom Mime Type

First, we need to define the Mimetype for the payload. In the `Atlas` class, you can find a list of mime types that are supported by default. You can add your own here.

```java
public static final String MIME_TYPE_STAR = "application/json+starobject";
```

We now need to define a new behavior when the user clicks the STAR button. In order to do so, we can add functionality to the `init` function of the `AtlasMessageComposer` class:

```java
class AtlasMessageComposer extends FrameLayout {

    private View btnStar;

    ...

    public void init(LayerClient client, Conversation conversation) {

        this.layerClient = client;
        this.conv = conversation;

        LayoutInflater.from(getContext()).inflate(R.layout.atlas_message_composer, this);

        btnStar = findViewById(R.id.atlas_message_composer_star);
        btnSend.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {

                String payload =   "{
                                        \"reward\": \"star\"
                                    }";

                MessagePart part = layerClient.newMessagePart(Atlas.MIME_TYPE_STAR, 
                                                                payload.getBytes());

                Message msg = layerClient.newMessage(Arrays.asList(part));

                if (listener != null) {
                    boolean proceed = listener.beforeSend(msg);
                    if (!proceed) return;
                } else if (conv == null) {
                    Log.e(TAG, "Cannot send message. Conversation is not set");
                    return;
                }
                
                conv.send(msg);
            }
        });

        //Set up the other GUI components
        ...

    }
    ...
}
```

##Displaying a Message with a Custom Mime Type

Each mime type is displayed in Atlas using a custom cell. You first define the cell layout, then inflate it and populate any relevant fields.

In order to define a cell, create a new layout called `atlas_view_messages_cell_star.xml` and set its views:

```xml
<FrameLayout

    xmlns:tools="http://schemas.android.com/tools"
    xmlns:android="http://schemas.android.com/apk/res/android"

    android:id="@+id/atlas_view_messages_cell_star"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"        
    >

    <TextView
        android:id="@+id/atlas_view_messages_star_text"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingTop="4dp"
        android:paddingBottom="6dp"
        android:paddingLeft="12dp"
        android:paddingRight="12dp"

        android:text="Sample Text"
        android:background="@drawable/atlas_shape_rounded16_gray"

        android:textSize="16sp"
        android:minHeight="34dp"

        android:textAlignment="gravity"
        android:gravity="center_horizontal" />

</FrameLayout>
```

Now, we can add the cell definition in the `AtlasMessageList` class:

```java
private class StarCell extends Cell {

    public StarCell(MessagePart messagePart) {
        super(messagePart);
    }

    public View onBind(ViewGroup cellContainer) {

        MessagePart part = messagePart;
        Cell cell = this;

        View cellStar = LayoutInflater.from(cellContainer.getContext()).inflate(
                            R.layout.atlas_view_messages_cell_star, cellContainer, false);

        TextView starText = (TextView) cellText.findViewById(
                                           R.id.atlas_view_messages_star_text);

        starText.setText("You are a star!");

        return cellText;
    }
}
```

Finally, you instantiate the StarCell when rendering a message with the appropriate message part. Add this check to `buildCellForMessage` in the `AtlasMessagesList` class.

```java
protected void buildCellForMessage(Message msg, ArrayList<Cell> destination) {

    final ArrayList<MessagePart> parts = new ArrayList<MessagePart>(msg.getMessageParts());

    for (int partNo = 0; partNo < parts.size(); partNo++ ) {
        final MessagePart part = parts.get(partNo);
        final String mimeType = part.getMimeType();

        if (Atlas.MIME_TYPE_IMAGE_PNG.equals(mimeType) || 
                Atlas.MIME_TYPE_IMAGE_JPEG.equals(mimeType)) {

            //Handle rendering images

        } else if (Atlas.MIME_TYPE_ATLAS_LOCATION.equals(part.getMimeType())){
        
            //Handle rendering location

        } else if (Atlas.MIME_TYPE_ATLAS_STAR.equals(part.getMimeType())){

            destination.add(new StarCell(part));

        } else {

            //Handle rendering text

        }
    }
}
```