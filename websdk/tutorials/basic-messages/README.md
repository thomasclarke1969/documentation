# Part 3. Working with Messages

If you've gotten this far, you can now create Conversations with users, and your probably thinking how nice it would be to actually send Messages to those users. By the end of this tutorial, you should have a better understanding of how to:

* Send a Message
* Display a list of Messages
* Send read receipts
* Display read status

Starting from where we left off in the [Basic Conversations)(#basic-conversations), we add the following to the template project:

* message-list.js: Placeholder for adding a Messages List Panel
* message-composer.js: Provides a textinput that triggers a `message:new` event when the user types in text and hits ENTER
* controller.js:
  * Initializes the above views
  * Wires the `message:new` event to call a `sendMessage` stub function

Further, your app will no longer be hardcoded to a specific user; you will now be prompted to enter a User ID each time you load the page.  Why? So you can load the app in multiple browsers and have them log in as different users who will then talk to each other.  The tutorial below assumes you log in as `Web Tutorial` until otherwise stated.

## Step 1: Set the App ID

The first thing we need to do is to set the App ID for your application.

Open up your `index.html` file and update the appId variable:

```javascript
window.layerSampleConfig = {
    appId: '%%C-INLINE-APPID%%',
    userId: window.prompt('Please enter a user name', 'Web Tutorial')
};
```

You should now be able to run this application, quickly verify that you can:

1. See your Conversation List
2. A Message Composer panel consisting of a textbox with a `Enter a message...` placeholder
3. A Message Panel with the message `Your messages will go here`

## Step 2: Send a Message

Recall that the `views/message-composer.js` file renders a text box; typing in text and hitting ENTER triggers a `message:new` event, which in turn triggers the `controller.js` `sendMessage` function.  Lets implement that method.  Open up `controller.js` and update `sendMessage` function at the bottom:

```javascript
function sendMessage(text) {
    if (activeConversation) {
        var message = activeConversation.createMessage(text).send();
        message.on('messages:sent', function(evt) {
            console.log('Message was sent with text: ' + evt.target.parts[0].body);
        });
    }
}
```

Sending a Message requires a Conversation for it to be sent on (`activeConversation`), on which we can call `createMessage(text)` and then call `send()` on the resulting Message to send it to all participants in the Conversation.

You can now run this application, with your debugger open; select a Conversation, type in a Message, hit ENTER and you should see `Message was sent with text: ...` get logged to the console.

## Step 3: Rendering the Message List

The Message you sent really aught to be displayed somewhere.

Messages are accessed via Queries. Creating a layer.Query instance will allow us to see all existing Messages within a Conversation and list them.  Furthermore, the Query will monitor for any changes to the Query results and update its data as Messages are sent, deleted or modified locally or remotely.

Lets start with some Very basic rendering; Open up your `views/message-list.js` file, and add a `render` method:

```javascript
render: function(messages) {
    this.$el.empty();

    // NOTE: Do NOT modify the query.data i.e. messages array
    // Create a copy of the array and reverse the order so that most recent message is at the bottom
    var messages = messages.concat().reverse();

    // Render each message view
    messages.forEach(function(message) {
        var messageView = new layerSampleApp.Message();
        messageView.render(message);

        this.$el.append(messageView.$el);
    }, this);

    // Make sure the user can see the last message in the list
    this.scrollBottom();
}
```

This is called with an array of `messages` it will iterate through them and for each message create a Message View and append it to the dom.

Next, open your `controller.js` file and setup the Query in the `initializeQueries` function:

```javascript
messagesQuery = layerSampleApp.client.createQuery({
    model: layer.Query.Message
});

messagesQuery.on('change', function(e) {
    messageListView.render(messagesQuery.data);
});
```

Once the messagesQuery has completed connecting to the server and downloading the user's Messages, it will trigger a `change` event handler, which will rerender the MessageList view with new data.  We access the Query's data using its `data` property which provides us with an array of Messages (paged 100 at a time).

There's just one last thing we need for this Query to work: It needs to request Messages from a specific Conversation; open up `controller.js` and add to the `selectConversation` function:

```javascript
messagesQuery.update({
    predicate: 'conversation.id = "' + conversationId + '"'
});
```

Whenever the Conversation changes, the Message Query's `update` method is called providing it with a new Query Predicate, and new data from the server is loaded, triggering the `change` event handler that renders our Message List.

You should be able to run this app and see your Message List Panel rendering when you select a Conversation.  Send a few Messages to make this Message List more convincing.  Initially, each Message is just rendered as `Your Message goes here`.

## Step 4: Render the Messages

It would be nice to have something nicer than `Your Message goes here` when rendering individual Messages.  Open up `views/message.js` and update the `render` method with:

```javascript
render: function(message) {
    this.$el.append(
        '<div class="message-content">' +
            '<span class="name">' + message.sender.userId + '</span>' +
            '<div class="bubble">' + message.parts[0].body + '</div>' +
        '</div>' +
        '<div class="timestamp">' + message.sentAt + '</div>'
    );
}
```
This should render:

* The sender of the Message (`message.sender.userId`)
* The text of the Message (`message.parts[0].body`)
* Then time that the Message was sent (`message.sentAt`)

You should be able to run this app, select a Conversation, and see your Messages rendered.  This is pretty basic, so we're going to make this a bit nicer.

### A Nicer Sent Date

Well, the formatting of the `message.sentAt` value could definitely be better.  Javascript has `toLocalDateString` and `toLocalTimeString` Date methods.  Lets use them:

```javascript
function getSentAt(message) {
    var now = new Date();
    var date = message.sentAt;

    if (date.toLocaleDateString() === now.toLocaleDateString()) {
        return date.toLocaleTimeString();
    }
    else {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}
```
And update the `render` method with:

```javascript
'<div class="timestamp">' + getSentAt(message) + '</div>'
```

Reloading the app should render a nicer `sentAt` value.

### A Nicer Sent By

The `message.sender.userId` is just a userId, which like the userIds in Conversation's `participants` list, is a unique identifier rather than a display name.  Lets user `Identities.getDisplayName` to improve this:

```javascript
function getSenderName(message) {
    return layerSampleApp.Identities.getDisplayName(message.sender.userId);
}
```

And update the `render` method with:

```javascript
'<span class="name">' + getSenderName(message) + '</span>' +
```

Running the application will now show a reasonable Sender name.  You can try this out by logging into two browsers, one browser logged in as `Web Tutorial` and the second as `User 4`.  Have `User 4` create a Conversation with `Web Tutorial` and send messages in that Conversation.  `Web Tutorial` should see the Conversation added to the Conversation List and should be able to respond with Messages.  Messages should be clearly labeled as coming from `User 4` or `Web Tutorial`.

One last refinement to the `getSenderName` method.  Occasionally, a Message is sent via [Layer's Platform API](/docs/platform#send-a-message), and are sent as from a Service (`Admin`, `Moderator`, `Layer-Bot`, etc...) rather than from a participant of the Conversation.  Lets make sure our method can handle that:

```javascript
function getSenderName(message) {
    if (message.sender.name) {
        return message.sender.name;
    } else {
        return layerSampleApp.Identities.getDisplayName(message.sender.userId);
    }
}
```

Messages will either have a `message.sender.name` or a `message.sender.userId` (never both).  The `sender.name` can typically be rendered as is, while the `sender.userId` must be looked up Identity Services to get a displayable name.

### A Cleaner Message Text

Our render method uses `message.parts[0].body` to get the message text.  What is really going on here?  Each Message consists of an array of MessageParts (the `parts` property).  Each MessagePart has a `mimeType` and a `body`.  If we know without a doubt that Messages will only ever have one part and it will always be text, then `message.parts[0].body` works.  But its a lot safer to check that the `mimeType` is `text/plain`, and to handle the possibility that there is more than one Message Part:

```javascript
function getMessageText(message) {
    return message.parts.filter(function(part) {
        return part.mimeType === 'text/plain';
    }).map(function(part) {
        return part.body;
    }).join('<br/>');
}
```

And update the `render` method with:

```javascript
'<div class="bubble">' + getMessageText(message) + '</div>' +
```

Running this will offer no discernable change of behavior but will give you the glowing confidence of having done it right.

## Step 5: Working with Read Receipts

Seeing the Messages is good, knowing that someone has read your Message is even better.

Read receipts are sent when the UI wants to notify the sender of a Message that this participant has read the Message.  Typically this is done when the Message has scrolled into view.  One might got a step further and only mark them as read if `!document.hidden && document.hasFocus()`.  This is a tutorial; we're going to simplify: If the Message is rendered, then the Message is presumed to be read.

Open up `views/message.js` and add this line to your `render` method:
```javascript
message.isRead = true;
```

If the Message is already marked as read, this will do nothing.  If it is not yet read, it will trigger side effects that notify the server that the Message has been read.

Typically, only the sender of a Message wants to know who has read it.  There are two ways of doing this; using the Message's `recipientStatus` property which contains a hash of all participants in the Conversation and how has read/not read the Message.  Much simpler is just to use the Message `readStatus` which will have a value of `none`, `some` or `all` indicating whether no participants, some participants or all participants have read the Message.

Open up `views/message.js` and add this method:

```javascript
function getMessageStatus(message) {
    var status = '';
    if (message.sender.userId === layerSampleApp.client.userId) {
        switch (message.readStatus) {
          case 'NONE':
            status = 'unread';
            break;
          case 'SOME':
            status = 'read by some';
            break;
          case 'ALL':
            status = 'read';
            break;
          default:
            status = 'unread';
            break;
        }
    }
    return '<span class="message-status">' + status + '</span>';
}
```

And update the `render` method with:

```javascript
render: function(message) {
    this.$el.append(
        '<div class="message-content">' +
          '<span class="name">' + getSenderName(message) + '</span>' +
          '<div class="bubble">' + getMessageText(message) + '</div>' +
        '</div>' +
        '<div class="timestamp">' + getSentAt(message) + getMessageStatus(message) + '</div>'
    );

    message.isRead = true;
}
```

If you open this app in two browsers, one logged in as `Web Tutorial` and the second as `User 4`, you should now be able to see Messages change from `unread` to `read` (or `read by some`) as Messages are sent between them.

### Working with Receipts in the Conversation List

Each Conversation keeps track of how many unread Messages it has within its `unreadCount` property.  This lets you emphasize Conversations with unread Messages when rendering.  Open up `views/conversation-list.js` and update the `render` method, adding this below your declaration of the `cssClasses` variable:

```javascript
if (conversation.unreadCount) {
    cssClasses.push('unread-messages');
}
```
You could also have used `unreadCount` as a number and rendered a badge, but for this tutorial, its enough that we render these Conversation in bold.

Open this app in two browsers, one logged in as `Web Tutorial` and the second as `User 4`. Leave `User 4` with no Conversation selected, and have `Web Tutorial` send Messages to `User 4`.  The Conversation receiving Messages should be highlighted.  When `User 4` opens the Conversation, Read Receipts will be sent, and the highlighting will be removed.
