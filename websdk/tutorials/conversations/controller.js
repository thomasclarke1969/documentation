'use strict';

/**
 * App initializer
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.initialize = function() {

    var titlebarView, conversationListView, conversationListHeaderView,
      userListView, activeConversation, conversationQuery, identityQuery;

    /**
     * During initialization, create all of the views and setup event listeners
     * to handle user interaction events.
     */
    function initializeViews() {
      titlebarView = new layerSampleApp.Titlebar();
      titlebarView.render();

      conversationListView = new layerSampleApp.ConversationList();
      conversationListHeaderView = new layerSampleApp.ConversationListHeader();
      userListView = new layerSampleApp.UserListDialog();

      // When the user clicks the New Conversation button in the
      // Conversation List Header, create a new Conversation
      conversationListHeaderView.on('conversations:new', function() {
        var participants = [];
        for (var i = 1; i < 6; i++) {
          if (Math.random() > 0.5) participants.push('layer:///identities/' + String(i));
        }
        createConversation(participants);
      });

      // When the user is in the User List Dialog and clicks to create a conversation,
      // call createConversation.
      userListView.on('conversation:created', function(participants) {
        createConversation(participants);
      });

      // Tutorial Step 6: Select Conversation listener
    }

    /**
     * During initialization we need to create the queries that will
     * download data from Layer's servers;
     * Also need to setup event handlers to rerender when the query
     * data changes.
     */
    function initializeQueries() {
      // Tutorial Step 3: Create Conversation Query here

      // Tutorial Steps 5 and 7: Create an Identity Query
    }

    /**
     * Handle the user requesting to create a new conversation by showing the User List Dialog.
     */
    function newConversation() {
      userListView.show();
    }

    /**
     * Handle the user creating a Conversation from the User List Dialog.
     */
    function createConversation(participants) {
      // Tutorial Step 2: Create a Conversation

      // Tutorial Step 6: Select the Conversation
    }

    /**
     * Handle the user selecting a Conversation
     */
    function selectConversation(conversationId) {
      // Tutorial Step 6: Select a Conversation Handler

    }

    // Initialize Everything:
    initializeViews();
    initializeQueries();
    createConversation(['0', '1', '2', '3', '4', '5']);
  };
})();
