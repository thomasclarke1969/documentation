# Working with Messages

```emphasis
Download tutorial project: [messages.zip](http://static.layer.com/web/docs/tutorials/messages.zip).
```

If you've gotten this far, you can now create Conversations with users, and your probably thinking how nice it would be to actually send Messages to those users. By the end of this tutorial, you should have a better understanding of how to:

* Send a Message
* Display a list of Messages
* Send read receipts
* Display read status

Starting from where we left off in the [Working with Conversations Tutorial](#conversations), we add the following to the template project:

* message-list.js: Placeholder for adding a Messages List Panel.
* message-composer.js: Provides a text box that triggers a `message:new` event when the user types in text and hits ENTER.
* controller.js:
  * Initializes the above views.
  * Wires the `message:new` event to call an empty `sendMessage` function.

Further, your app will no longer be hardcoded to a specific user; you will now be prompted to enter a User ID each time you load the page.  Why? So you can load the app in multiple windows and have them log in as different users who will then talk to each other.  The tutorial below assumes you log in with the User ID `0` (displayed in the UI as `User 0`) until otherwise stated.

## Step 1: Set the App ID

The first thing we need to do is to set the App ID for your application.

Open up your `index.html` file and update the appId variable:

```javascript
window.layerSampleConfig = {
    appId: '%%C-INLINE-APPID%%',
    userId: window.prompt('Please enter a user name', 'Tutorial User')
};
```

You should now be able to run this application, quickly verify that you can:

1. See your Conversation List
2. See a Message Panel with the message `Your messages will go here`
3. Type in text into the Message Composer panel with the `Enter a message...` placeholder, and hit ENTER.  This won't send a Message, but the text box should be cleared on hitting ENTER, showing that the events are processed.

## Step 2: Send a Message

Recall that the `views/message-composer.js` file renders a text box; typing in text and hitting ENTER triggers a `message:new` event, which in turn triggers the controller's `sendMessage` function.  Lets implement the `sendMessage` method.

Open up your `controller.js` and update the `sendMessage` function near the bottom:

```javascript
function sendMessage(text) {
    // Tutorial Step 2: Send a message
    if (activeConversation) {
        var message = activeConversation.createMessage(text).send();
        message.on('messages:sent', function(evt) {
            console.log('Message was sent with text: ' + evt.target.parts[0].body);
        });
    }
}
```

Sending a Message requires a Conversation for it to be sent on (the `activeConversation` variable), on which we can call `createMessage(text)` and then call `send()` on the resulting Message.  This will send it to all participants in the Conversation.

You can now run this application:

1. Load the application
2. Open your debugger
3. Create a Conversation (this will also select the Conversation) by clicking the `New` button
4. Type in a Message
5. Hit ENTER

You should see `Message was sent with text: ...` get logged to the console.

## Step 3: Rendering the Message List

The Message you sent really aught to be displayed somewhere.

Messages are accessed via Queries. Creating a `layer.Query` instance will allow us to see all existing Messages within a Conversation and list them.  Furthermore, the Query will monitor for any changes to the Query results and update its data as Messages are sent, deleted or modified locally or remotely.  Lets start with some Very basic rendering.

Open up your `views/message-list.js` file, and add a `render` method:

```javascript
render: function(messages) {
    // Tutorial Step 3: Render messages here
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

This is called with an array of `messages`.  It will iterate through them and for each Message, it will create a Message View and append it to the dom.

Next, open your `controller.js` file and setup the Query in the `initializeQueries` function and add the following at the bottom of the function:

```javascript
function initializeQueries() {
    ...

    // Tutorial Step 3: Setup the Message Query here
    messagesQuery = layerSampleApp.client.createQuery({
        model: layer.Query.Message
    });

    messagesQuery.on('change', function(e) {
        messageListView.render(messagesQuery.data);
    });
}
```

Once the messagesQuery has completed connecting to the server and downloading the user's Messages, it will trigger a `change` event handler, which will rerender the MessageList view with new data.  We access the Query's data using its `data` property which provides us with an array of Messages (paged 100 at a time).

There's just one last thing we need for this Query to work: It needs to request Messages from a specific Conversation.

Open up `controller.js` and add to the `selectConversation` function and add the following at the bottom of the function:

```javascript
function selectConversation(conversationId) {
    ...

    // Tutorial Step 3: Update Mesage Query here
    messagesQuery.update({
        predicate: 'conversation.id = "' + conversationId + '"'
    });
}
```

> Note: conversationId will be of the form layer:///conversations/UUID

Whenever the Conversation changes, the Message Query's `update` method is called providing it with a new Query Predicate.  Each time the Predicate changes, new data is loaded from the server, triggering the `change` event handler that renders our Message List.

You should be able to run this app and see your Message List Panel rendering when you select a Conversation.

1. Open up the application
2. Create or Select a Conversation
3. Send a few Messages

Initially, each Message is just rendered as `This is a Message`.

## Step 4: Render the Messages

It would be nice to have something nicer than `This is a Message` when rendering individual Messages.

Open up your `views/message.js` and update the `render` method with:

```javascript
render: function(message) {
    // Tutorial Step 4: Render a single message here
    this.$el.append(
        '<div class="message-content">' +
            '<span class="name">' + message.sender.displayName + '</span>' +
            '<div class="bubble"> + message.parts[0].body + '</div>' +
        '</div>' +
        '<div class="timestamp">' + message.sentAt + '</div>'
    );
},
```

The `render()` method renders the following:

* It renders the sender's name by using the Identity Object that is accessed via `message.sender`.  The Identity Object has a `displayName` property that contains the preferred display name for this user, which can be configured via Layer's [Identities API](https://developer.layer.com/docs/platform/users#managing-identity).
* Using `message.parts[0].body` it renders the body of the first MessagePart (more on MessageParts later).
* Using the Date Object from `message.sentAt`, it renders a timestamp for the Message.

For each MessagePart, we will return the appropriately rendering for the `messagePart.body` for its given Mime Type.  For this example, we only send the default Mime Type of `text/plain`.  If any other Mime Types are sent, it will render "not supported" until suitable HTML is returned.

This should render:

* The sender of the Message (`message.sender.userId`)
* The text of the Message (`message.parts[0].body`)
* The time that the Message was sent (`message.sentAt`)

You should be able to run this app:

1. Open the application
2. Select a Conversation

You should now see your Messages rendered showing something nicer than `This is a Message`.  This is pretty basic, so we're going to make this a bit nicer.

### A Nicer Sent Date

The formatting of the `message.sentAt` value could definitely be better.  Javascript has `toLocaleDateString` and `toLocaleTimeString` Date methods.  Lets use them.

Open up your `views/message.js` and add a `getSentAt` method:


```javascript
getSentAt: function(message) {
    var now = new Date();
    var date = message.sentAt;

    if (date.toLocaleDateString() === now.toLocaleDateString()) {
        return date.toLocaleTimeString();
    }
    else {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
},
```
And update the `render` method with:

```javascript
'<div class="timestamp">' + this.getSentAt(message) + '</div>'
```

Reloading the app should render a nicer `sentAt` value.

### A Cleaner Message Text

Our render method uses `message.parts[0].body` to get the message text.  What is really going on here?

* Each Message consists of an array of MessageParts (the `parts` property).
* Each MessagePart has a `mimeType` and a `body`.

If we know without a doubt that Messages will only ever have one part and it will always be text, then `message.parts[0].body` works.  But most applications will need to handle multiple Mime Types, and may support multiple parts, and will need a better approach.

Open up your `views/message.js` and add a `renderPart` method:

```javascript
renderPart: function(messagePart) {
    switch(messagePart.mimeType) {
        case 'text/plain':
            return '<div class="bubble">' + messagePart.body + '</div>';
        default:
            return messagePart.mimeType + ' not supported';
    }
},
```
```

And update the `render` method to call `renderPart`:

```javascript
render: function(message) {
  // Tutorial Step 4: Render a single message here
  this.$el.append(
    '<div class="message-content">' +
        '<span class="name">' + message.sender.displayName + '</span>' +
        message.parts.map(function(messagePart) {
            return this.renderPart(messagePart);
        }, this).join('') +
    '</div>' +
    '<div class="timestamp">' + this.getSentAt(message) + '</div>'
  );
},
```

Running this will offer no discernable change of behavior but will give you the glowing confidence of having done it right.

## Step 5: Working with Read Receipts

Seeing the Messages is good, knowing that someone has read your Message is even better.

Read receipts are sent when the UI wants to notify the sender of a Message that this participant has read the Message.  Typically this is done when the Message has scrolled into view.  One might go a step further and only mark them as read if `!document.hidden && document.hasFocus()` is true.  This is a tutorial; we're going to simplify: If the Message is rendered, then the Message is presumed to be read.

Open up `views/message.js` and add this line to your `render` method:
```javascript
message.isRead = true;
```

If the Message is already marked as read, this will do nothing.  If it is not yet read, it will trigger side effects that notify the server that the Message has been read.

Typically, only the sender of a Message wants to know who has read it.  There are two ways of doing this; using the Message's `recipientStatus` property which contains a hash of all participants in the Conversation and specifies who has read/not read the Message.  Much simpler is just to use the Message `readStatus` which will have a value of `NONE`, `SOME` or `ALL` indicating whether no participants, some participants or all participants have read the Message.

Open up `views/message.js` and add the `getMessageStatus` method:

```javascript
getMessageStatus: function(message) {
    var status = '';
    if (message.sender.userId === layerSampleApp.client.userId) {
        switch (message.readStatus) {
          case layer.Constants.RECIPIENT_STATE.NONE:
            status = 'unread';
            break;
          case layer.Constants.RECIPIENT_STATE.SOME:
            status = 'read by some';
            break;
          case layer.Constants.RECIPIENT_STATE.ALL:
            status = 'read';
            break;
          default:
            status = 'unread';
            break;
        }
    }
    return '<span class="message-status">' + status + '</span>';
},
```

And update the `render` method with:

```javascript
render: function(message) {
    // Tutorial Step 4: Render a single message here
    this.$el.append(
      '<div class="message-content">' +
          '<span class="name">' + message.sender.displayName + '</span>' +
          message.parts.map(function(messagePart) {
              return this.renderPart(messagePart);
          }, this).join('') +
      '</div>' +
      '<div class="timestamp">' + this.getSentAt(message) + this.getMessageStatus(message) + '</div>'
    );
    message.isRead = true;
}
```

If you open this app in two browsers, one logged in as `0` and the second as `1`, you should now be able to see Messages change from `unread` to `read` (or `read by some`) as Messages are sent between them.  To cause Messages to stay unread, simply have the two users open different Conversations.

### Working with Receipts in the Conversation List

Each Conversation keeps track of how many unread Messages it has with an `unreadCount` property.  This lets you emphasize Conversations with unread Messages when rendering.

Open up `views/conversation-list.js` and update the `buildConversationRow` method, adding this below your declaration of the `cssClasses` variable:

```javascript
// Tutorial Step 5: Add Unread Message Highlighting
if (conversation.unreadCount) {
    cssClasses.push('unread-messages');
}
```

You could also have used `unreadCount` as a number and rendered a badge, but for this tutorial, its enough that we render these Conversations in bold.

Open this app in two browsers, one logged in as `0` and the second as `1`. Leave `1` (User 1) with no Conversation selected, and have `0` (User 0) send Messages to User 1.  User 1 should see the Conversation receiving Messages become highlighted.  When User 1 opens the Conversation, Read Receipts will be sent, and the highlighting will be removed.
