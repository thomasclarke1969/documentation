# Working with Conversations

```emphasis
Download tutorial project: [conversations.zip](http://static.layer.com/web/docs/tutorials/conversations.zip).
```

Everyone prefers a chat application that actually sends messages.
However, before we can send a Message, we need to be able to create and select Conversations.

Once we have a Conversation, we can then send a Message on that Conversation.  By the end of this tutorial, you should know how to:

* Create a Conversation
* Get a list of all of your Conversations
* Have a better understanding of userIDs/Conversation Participants

Starting from where we left off in the [Authentication Tutorial](#authentication), we add the following to the template project:

* `conversation-list.js`: Placeholder for adding a Conversation List Panel.
* `conversation-list-header.js`: Adds a header over your Conversation List Panel, and a `New Conversation` button.
* `user-list-dialog.js`: Adds a dialog to help create a Conversation.
* `controller.js`:
  * Initializes the above views
  * Wires the `New Conversation` button to open the User List Dialog
  * Wires the User List Dialog's `OK` button to call the empty `createConversation` function

## Step 1: Set the App ID

The first thing we need to do is to set the App ID for your application.

Open up your `index.html` file and update the appId variable:

```javascript
window.layerSampleConfig = {
    appId: '%%C-INLINE-APPID%%',
    userId: '0'
};
```

You should now be able to run this application, quickly verify that you can:

1. See the `YOUR CONVERSATIONS` label and the `NEW` button on the top left header.
2. See the titlebar showing `Logged in as: User 0`, proving that you have authenticated with Layer's Servers.

## Step 2: Create a Conversation

Before we get started rendering a list of Conversations, lets make sure that your application has a Conversation to show.

Open up `controller.js` and add the following to the `createConversation` function:

```javascript
function createConversation(participants) {
    // Tutorial Step 2: Create a Conversation
    var conversation = layerSampleApp.client.createConversation({
        participants: participants,
        distinct: true
    });
    console.log('Conversation created (locally) with participants ' +
        conversation.participants.map(function(identity) {return identity.displayName;}) + ', and ID: ' + conversation.id);

    // Tutorial Step 6: Select the Conversation
}
```

Some explanation is required here:

1. Calling `client.createConversation()` creates the conversation locally; these conversations won't show up on any remote clients until we send our first message on the conversation.
2. We are creating conversations where `distinct = true` (this happens to be the default).  This means that if you try to create a Conversation with `User 4` and `User 5` and you already have a Distinct Conversation with exactly those two users, you will be sent to the existing Conversation instead of creating a new Conversation.
3. The `participants` parameter to the `createConversation` function is an array of Identity IDs, which in this sample app are `layer://identities/0`, `layer://identities/1`, `layer://identities/2`, `layer://identities/3`, `layer://identities/4` and/or `layer://identities/5`.
4. The `New` button is wired to call `createConversation(participants)`

You should be able to run this application, click the `New` button and see a console log statement that your Conversation has been created.  Each time it will add a new Conversation... unless it tries to create a Conversation with the same set of participants... in which case the logs will show it will returns the previously created Conversation ID.


## Step 3: Create a Conversation Query

Conversations are accessed via Querys.  Creating a `layer.Query` instance will allow us to see all existing Conversations and list them.  Furthermore, the Query will monitor for any changes to the Query results and update its data as Conversations are created, deleted or modified locally or remotely.

Lets start with some *very* basic rendering; Open up your `views/conversation-list.js` file, and update the `render` method:

```javascript
render: function(conversations) {
    if (conversations) this.conversations = conversations;
    this.$el.empty();
    this.$el.append('Found ' + this.conversations.length + ' conversations');
}
```

So, if this is called with an array of Conversations it will simply report on the number of Conversations in your account.

Next, open your `controller.js` file and lets setup the Query.

Instantiate your query in the `initializeQueries` function:

```javascript
function initializeQueries() {
    // Tutorial Step 3: Create Conversation Query here
    conversationQuery = layerSampleApp.client.createQuery({
        model: layer.Query.Conversation
    });
}
```

Once `conversationQuery` has completed connecting to the server and downloading the user's Conversations, it will invoke this `change` event handler which you put into your `initializeQueries` function:

```javascript
conversationQuery.on('change', function() {
    conversationListView.render(conversationQuery.data);
});
```

We access the Query's data using its `data` property which provides us with an array of all Conversations for this user (paged 100 at a time).  We provide those Conversations to our new `render` method in the ConversationListView.

You should be able to run this app and see your Conversation List Panel increment the conversation count each time you click the `New` button.  Note that it will NOT increment the counter if it tries to create a Conversation that already exists.  Feel free to change the `distinct` property to false to disable this behavior.

## Step 4: Render the Conversation List

A simple Conversation list consists of iterating over all Conversations and rendering the participants of each Conversation.  Each time `conversationQuery` triggers a `change` event, there has been a change to the contents of its `data` property and we tell the ConversatinList View to rerender the list.

The `layer.Conversation.participants` property contains an array of Identity Objects.  An Identity Object contains

* A `userId` property that maps to User ID names used by your server
* A `displayName` property that makes rendering this user easy

Open up your `views/conversation-list.js` file and replace the `render` method with:

```javascript
buildConversationRow: function(conversation) {
    var title = conversation.participants
        map(function(identity) {
            return identity.displayName;
        });
        .join(', ');
    var cssClasses = ['conversation-list-item'];

    var row = $('<div/>', { class: cssClasses.join(' ') });
    row.append(
        '<div class="info">' +
            '<div class="main">' +
                '<div class="title">' + title + '</div>' +
            '</div>' +
        '</div>'
    );
    return row;
},


render: function(conversations) {
    // Tutorial Step 3, 4 and 5: Render conversation list here
    if (conversations) this.conversations = conversations;
    this.$el.empty();

    // Iterate through conversations and append HTML Rows
    this.conversations.forEach(function(conversation) {
        var row = this.buildConversationRow(conversation);
        this.$el.append(row);
    }, this);
}
```

So we iterate over each Conversation.  Each conversation is rendered by getting the `conversation.participants` array and displaying the `displayName` of each participant.

You can run this now.  Each time you click `New` it should render an additional Conversation that looks something like `User 0, User 1, User 2, User 3, User 4, User 5`.

## Step 5: Selecting a Conversation

In order to send a Message, we'll need a Conversation to send the Message on.  That means we need the user to be able to select a Conversation.  Lets start with some basic rendering and selection events.

Open `views/conversation-list.js` and replace the `buildConversationRow` method with:

```javascript
buildConversationRow: function(conversation) {
    var title = conversation.participants
        map(function(identity) {
            return identity.displayName;
        });
        .join(', ');
    var cssClasses = ['conversation-list-item'];

    // Highlight the selected Conversation
    if (this.selectedConversation && conversation.id === this.selectedConversation.id) {
        cssClasses.push('selected-conversation');
    }

    var row = $('<div/>', { class: cssClasses.join(' ') });
    row.append(
        '<div class="info">' +
            '<div class="main">' +
                '<div class="title">' + title + '</div>' +
            '</div>' +
        '</div>'
    );

    // Click handler to trigger an event when each conversation is selected
    row.on('click', function(evt) {
        this.trigger('conversation:selected', conversation.id);
    }.bind(this));

    return row;
},
```

What has changed?

* If we have a `selectedConversation`, and its the same as the Conversation Row being rendered, it will get the `selected-conversation` css class.
* If the user clicks on a row, it will trigger a `conversation:selected` event for the controller to handle.

Open `controller.js` and update the `initializeViews` function to handle the `conversation:selected` event, adding:

```javascript
// Tutorial Step 6: Select Conversation Event Handler
conversationListView.on('conversation:selected', function(conversationId) {
    selectConversation(conversationId);
});
```

And then near the bottom of `controller.js` find the `selectConversation` function and add:

```javascript
function selectConversation(conversationId) {
    // Tutorial Step 6: Select a Conversation Handler

    // Get the Conversation instance associated with the selected Conversation ID
    var conversation = layerSampleApp.client.getConversation(conversationId);

    // Set our activeConversation state
    activeConversation = conversation;

    // Update the Conversation List to highlight the selected Conversation
    conversationListView.selectedConversation = conversation;
    conversationListView.render();
}
```

So here we set the ConversationList View's `selectedConversation` so that it can render the selected Conversation with emphasis.

You should be able to run this sample, add new Conversations, and see the selection state change as you click on a Conversation.

### Setting the Titlebar

Lets wrap up this section on selecting conversations by updating the rendering of the Titlebar View.

Open up `views/titlebar.js` and replace the `render` method with:

```javascript
render: function(conversation) {
    // Tutorial Step 6: Change title when a conversation is selected
    var title;

    if (conversation) {
        title = betterTitle(conversation.participants);
    }
    else {
        title = 'Logged in as: ' + client.user.displayName;
    }

    this.$el.html('<div class="title">' + title + '</div>');
}
```

In other words: If there is no `conversation` parameter, tell us who is logged in, otherwise, use `betterTitle` to help render the Conversation participants in the titlebar.

Open your `controller.js` file update the `selectConversation` function with:

```javascript
titlebarView.render(conversation);
```

You should now be able to run this application, and see selecting conversations update the Titlebar and the ConversationList Views.

### Selecting Conversations on Creation

A quick little cleanup step to make this nice:  Open up `controller.js` and add to a call to `selectConversation` to the end of the `createConversation` function.

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

## Step 6: Gathering a list of Users

There are two ways that an Application can get a list of Users to present to the current user:

1. You can load the list from your own servers
2. You can use Layer's Identities, and its [Follows API](https://developer.layer.com/docs/platform) to load all Users that you have told Layer this user can see.

An Identity Query can be used to load full details of all users you follow, including anyone you are in a Conversation with.

Open up your `controller.js` file and update the `initializeQueries()` method:

```javascript
function initializeQueries() {
  ...

  // Tutorial Steps 5 and 7: Create an Identity Query
  identityQuery = layerSampleApp.client.createQuery({
    model: layer.Query.Identity
  });
  identityQuery.on('change', function() {
    console.log('Loaded data about ' + identityQuery.data.map(function(identity) {
        return '"' + identity.userId + '": ' + identity.displayName;
    }).join(', '));
  });
}
```

This query will load all of the Identities followed by this user, with the following results:

1. `identityQuery.data` will contain an array of Identities
2. `client.getIdentity(identityId)` can now be called with an Identity ID to get any of the Identities loaded by this Query (or by any of the other ways of receiving Identity data listed above)
3. `conversation.addParticipant(identity)` can now be called to add any of these users to a Conversation
4. `client.createConversation({participants: [identity]})` can now be called to create a Conversation

Run this app; you should see a list of all users logged to the console in the form of `1: User 1, 2: User 2, ...`


## Step 7: Selecting Users for a Conversation

There may be a few applications out there that like creating conversations with completely random participants.  For the rest of you, lets take a look at using the Identity Query to drive a `New Conversation` dialog.  The goal is to have clicking the `New` button open a dialog listing users to chat with, and allow our user to select whom they want to create a Conversation with.  As mentioned above, one might load information about users to chat with directly from your own servers, or using Layer's [Identities API](https://developer.layer.com/docs/platform/users#managing-identity).  This tutorial will use Identities, and as it happens, we already have an Identity Query.

This tutorial also has a View `user-list-dialog.js` which:

1. Has an `OK` button that will trigger an event named `conversation:created` telling the controller to create a Conversation with the specified participants, and then close the dialog
2. A `Cancel` button that will close the dialog
3. A `users` property that the Controller will populate, providing the view with a list of users to render
4. A `renderUser` method that will render each user as a separate row.

Open your `controller.js` file and update the `initializeQueries()` method to pass the `UserListView` the Query data:

```javascript
function initializeQueries() {
  ...

  // Tutorial Steps 5 and 7: Create an Identity Query
  identityQuery = layerSampleApp.client.createQuery({
    model: layer.Query.Identity
  });
  identityQuery.on('change', function() {
    userListView.users = identityQuery.data;
    console.log('Loaded data about ' + identityQuery.data.map(function(identity) {
        return '"' + identity.userId + '": ' + identity.displayName;
    }).join(', '));
  });
}
```

In the same file, update the handler for clicking the `New` button within the `initializeViews()` method; this will no longer call `createConversation(participants)` but will instead call `newConversation()`:

```javascript
    // When the user clicks the New Conversation button in the
    // Conversation List Header, call newConversation.
    conversationListHeaderView.on('conversations:new', function() {
      newConversation();
    });
```

You should be able to run this. Clicking `New` will show a dialog with `OK` and `Cancel` buttons, and a list of Users rendered as `User 0`-`User 5` (not necessarily sorted as such).

Finally, lets enable these to be selected as checkboxes so that we can click `OK` and create the Conversation.

Open up the `views/user-list-dialog.js` file and edit the `renderUsers()` method:

```javascript
renderUser: function(list, user) {
  // Tutorial Step 7
  if (user !== layerSampleApp.client.user) {
    list.append('<div class="user-list-item">' +
      user.displayName +
      '<input value="' + user.id + '" ' +
          'type="checkbox" ' +
          'name="userList"/>' +
    '</div>');
  }
},
```

Running this, we should now see a list of users, with a checkbox next to each one.  The `createConversation()` method of the UserListDialog will get the User IDs associated with the selected checkboxes and trigger a `conversation:created` event with those User IDs so that the controller can create a Conversation with thos users.  You can try this, and as before, should be able to create multiple new Conversations... but creating the same Conversation multiple times should not result in a new Conversation being added to the list.

### Polishing up the User List

Two improvements are needed to make this nice:

1. Proper use of `<label>` in a checkbox list will allow us to click anywhere on the row
2. Each Identity object comes with an `avatarUrl` property.  Typically it is up to your application and services to populate each Identity with an `avatarUrl`; however, this tutorial comes with Identities prepopulated with avatar images.

Lets open `views/user-list-dialog.js` and update the `renderUser()` method to address these:

```javascript
renderUser: function(list, user) {
  // Tutorial Step 7
  if (user !== layerSampleApp.client.userId) {
    list.append(
      '<div class="user-list-item">' +
        '<label for="participant-checkbox-' + user.id + '">' +
          '<img src="' + user.avatarUrl + '"/>' +
          user.displayName +
        '</label>' +
        '<input value="' + user.id + '" ' +
            'id="participant-checkbox-' + user.id + '" ' +
            'type="checkbox" ' +
            'name="userList"/>' +
      '</div>'
    );
  }
},
```

You can run this, and should now see a polished UserListDialog that lets you create Conversations.


