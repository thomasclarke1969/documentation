'use strict';

/**
 * App initializer
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.initialize = function() {

    var titlebarView, conversationListView, conversationListHeaderView,
      userListView, activeConversation, conversationQuery;

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
      // Conversation List Header, call newConversation.
      conversationListHeaderView.on('conversations:new', function() {
        newConversation();
      });

      // When the user is in the User List Dialog and clicks to create a conversation,
      // call createConversation.
      userListView.on('conversation:created', function(participants) {
        createConversation(participants);
      });

      // Step 5: Select conversation listener
    }

    /**
     * During initialization we need to create the queries that will
     * download data from Layer's servers;
     * Also need to setup event handlers to rerender when the query
     * data changes.
     */
    function initializeQueries() {

      // Step 2: Create Query here
    }

    /**
     * Handle the user requesting to create a new conversation by showing the User List Dialog.
     */
    function newConversation() {
      userListView.show();
    }

    // Step 4: Create a new conversation function

    // Step 5: Select conversation function

    // Initialize Everything:
    initializeViews();
    initializeQueries();
  };
})();
