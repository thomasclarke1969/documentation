# Part 2. Working with Conversations

Everyone prefers a chat application that actually sends messages.
However, before we can send a Message, we need to be able to create and select Conversations.
Once we have a Conversation we can then [Send a Message](#sending-messages) on that Conversation.  By the end of this tutorial, you should know how to:

* Create a Conversation
* Get a list of all of your Conversations
* Have a better understanding of userIDs/Conversation Participants

Starting from where we left off in the [Authentication Tutorial)(#authentication), we add the following to the template project:

* [conversation-list.js](./views/conversation-list.js): Placeholder for adding a Conversation List Panel
* [conversation-list-header.js](./views/conversation-list-header.js): Adds a header over your Conversation List Panel, and a `New Conversation` button.
* [user-list-dialog.js](./views/user-list-dialog.js): Adds a dialog for selecting users to create a Conversation with
* [controller.js](./views/controller.js):
  * Initializes the above views
  * Wires the `New Conversation` button to open the User List Dialog
  * Wires the User List Dialog's `OK` button to call `createConversation` stub function

## Step 1: Set the App ID

The first thing we need to do is to set the App ID for your application.

Open up your `index.html` file and update the appId variable:

```javascript
window.layerSampleConfig = {
    appId: '%%C-INLINE-APPID%%',
    userId: 'Web Tutorial'
};
```

You should now be able to run this application, quickly verify that you can:

1. See `YOUR CONVERSATIONS` and `NEW` button on the top left header.
2. The `NEW` button opens the User List Dialog, showing a list of users.
3. Clicking `Cancel` and `OK` in the User List Dialog closes the dialog, but doesn't do anything else.

## Step 2: Create a Query

Conversations are accessed via Querys.  Creating a layer.Query instance will allow us to see all existing Conversations and list them.  Furthermore, the Query will monitor for any changes to the Query results and update its data as Conversations are created, deleted or modified locally or remotely.

Lets start with some Very basic rendering; Open up your `views/conversation-list.js` file, and add a `render` method:

```javascript
render: function(conversations) {
    if (conversations) this.conversations = conversations;
    this.$el.empty();
    this.$el.append('Found ' + this.conversations.length + ' conversations');
}
```

So, if this is called with an array of Conversations it will simply report on the number of Conversations in my account.

Next, open your `controller.js` file and lets setup the Query.

Instantiate your query in the `initializeQueries` function:

```javascript
function initializeQueries() {
    conversationQuery = layerSampleApp.client.createQuery({
        model: layer.Query.Conversation
    });
}
```

Once the conversationQuery has completed connecting to the server and downloading the user's Conversations, it will trigger a `change` event handler:

```javascript
conversationQuery.on('change', function() {
    conversationListView.render(conversationQuery.data);
});
```

We access the Query's data using its `data` property which provides us with an array of all Conversations for this user (paged 100 at a time).  We provide those Conversations to our new `render` method in the ConversationListView.

You should be able to run this app and see your Conversation List Panel rendering that the Query has found a single Conversation.

## Step 3: Render the Conversation List

A simple Conversation list consists of iterating over all Conversations and rendering the participants of each Conversation.  Each time `conversationQuery` triggers a `change` event, there has been a change in the data in its `data` property and we tell the ConversatinList View to rerender the list.

Open up your `views/conversation-list.js` file and replace the `render` method with:

```javascript
render: function(conversations) {
  if (conversations) this.conversations = conversations;
  this.$el.empty();

  // Iterate through conversations and append HTML
  this.conversations.forEach(function(conversation) {
    var title = conversation.participants.join(', ');

    this.$el.append(
      '<div class="conversation-list-item">' +
          '<div class="info">' +
              '<div class="main">' +
                  '<div class="title">' + title + '</div>' +
              '</div>' +
          '</div>' +
      '</div>'
    );
  }, this);
}
```

So we iterate over each Conversation.  Each conversation is rendered by getting the `conversation.participants` array and displaying all of the User IDs.

You can run this now.  It should render a single Conversation that looks something like `1, 2, 3, 4, 5`.

Ok, we can do better, lets get a displayable name for each participant from the Identities service.  Lets create a `betterTitle` function that uses the `Identities.getDisplayName` to get a display name for each user, and set that to be our new `title` variable:

```javascript
function betterTitle(conversation) {
  return conversation.participants.map(function(userId) {
    return layerSampleApp.Identities.getDisplayName(userId);
  }).join(', ');
}

var title = betterTitle(conversation);
```

You can now run this.  Your Conversation should now display something a bit more usable, like `Web, User 2, User 3, User 4, User 5`.

## Step 4: Create a new Conversation

Well, that was a nice list of one Conversation.  This will be a little more convincing if we have more Conversations.  Your application should already have a `New` button for creating a Conversation.  Selecting it shows a dialog listing people you can create a Conversation with.  Selecting a few users and hitting `OK` calls the empty `controller.js` `createConversation` function.  Lets make that function create actual Conversations.

Open up `controller.js` and add the following to the `createConversation` function:

```javascript
function createConversation(participants) {
    var conversation = layerSampleApp.client.createConversation({
        participants: participants,
        distinct: true
    });
}
```

Some explanation is required here:

1. Calling `client.createConversation()` creates the conversation locally; these conversations won't show up on any remote clients until we send our first message on the conversation.
2. We are creating conversations where `distinct = true` (this happens to be the default).  This means that if you try to create a Conversation with `User 4` and `User 5` and you already  have a Conversation with exactly those two users, you will be sent to the existing Conversation.
3. The `participants` parameter to the `creatConversation` function is userIds, which in this sample app are `1`, `2`, `3`, `4` and/or `5`.

You should be able to run this app, and add a few more Conversations to your list.

## Step 5: Selecting a Conversation

Lets finish up this tutorial by making sure we are able to select a Conversation.  We'll need to be able to do that before we can start dealing with sending or receiving Messages.

Lets start with some basic rendering and selection events.  Open `views/conversation-list.js` and replace the `render` method with:

```javascript
render: function(conversations) {
  if (conversations) this.conversations = conversations;
  this.$el.empty();

  this.conversations.forEach(function(conversation) {
    var title = betterTitle(conversation);

    var cssClasses = ['conversation-list-item'];

    // Highlight the selected Conversation
    if (this.selectedConversation && conversation.id === this.selectedConversation.id) {
        cssClasses.push('selected-conversation');
    }

    var $div = $('<div/>', { class: cssClasses.join(' ') });
    $div.append(
      '<div class="info">' +
          '<div class="main">' +
              '<div class="title">' + title + '</div>' +
          '</div>' +
      '</div>'
    );
    this.$el.append($div);

    // Click handler to trigger an event when each conversation is selected
    $div.on('click', function(evt) {
        this.trigger('conversation:selected', conversation.id);
    }.bind(this));
  }, this);
}
```

So, if we have a `selectedConversation`, and its the same as the Conversation Row being rendered, it will get the `selected-conversation` css class.

And if the user clicks on a row, it will trigger a `conversation:selected` event for the app.

Also open `controller.js` and update the `initializeViews` function, adding:

```javascript
conversationListView.on('conversation:selected', function(conversationId) {
    selectConversation(conversationId);
});
```

And then after the end of the `createConversation` function, add a new function:

```javascript
function selectConversation(conversationId) {
    // Get the Conversation instance associated with the selected Conversation ID
    var conversation = layerSampleApp.client.getConversation(conversationId);

    // Set our activeConversation state
    activeConversation = conversation;

    // Update the Conversation List to highlight the selected Conversation
    conversationListView.selectedConversation = conversation;
    conversationListView.render();
}
```

So here we set the ConversationList View's `selectedConversation` so that it can add its `selected-conversation` css class.

Lets wrap up this section on selecting conversations by updating the rendering of the Titelbar View.  Open up `views/titlebar.js` and replace the `render` method with:

```javascript
render: function(conversation) {
    var title = '';

    if (conversation) {
        title = betterTitle(conversation);
    }
    else {
        title = 'Logged in as: ' + layerSampleApp.Identities.getDisplayName(layerSampleApp.client.userId);
    }

    this.$el.html('<div class="title">' + title + '</div>');
}
```

In other words: If there is no `conversation` parameter, tell us who is logged in, otherwise, use the `Identities.getDisplayName` function to help render the Conversation participants in the titlebar.

In the `controller.js` file update the `selectConversation` function with:

```javascript
titlebarView.render(conversation);
```

You should now be able to run this application, and see selecting conversations update the Titlebar and the ConversationList Views.

## Step 6: Cleanup

A quick little cleanup step to make this nice:  Open up `controller.js` and add to the end of the `createConversation` function a call to `selectConversation`.

```javascript
function createConversation(participants) {
    var conversation = layerSampleApp.client.createConversation({
        participants: participants,
        distinct: true
    });
    selectConversation(conversation.id);
}
```

You should be able to run this, and when you create a new conversation, it should be selected.

Recall that this Conversation does not yet exist on the server, and won't be sent to the server until we send a Message.  We've simply selected the local copy of the Conversation.  The ID of this Conversation is *also* local-only, and will be replaced with a permanent ID once its created on the server.  So while you can use this Conversation's `id` property, be aware that its ID will change.
