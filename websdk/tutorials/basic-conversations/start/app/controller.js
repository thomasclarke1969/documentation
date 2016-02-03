'use strict';

/**
 * Controller initializer
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.Controller = function(client) {

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
    }

    /**
     * During initialization we need to create the queries that will
     * download data from Layer's servers;
     * Also need to setup event handlers to rerender when the query
     * data changes.
     */
    function initializeQueries() {

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

    }

    // Initialize Everything:
    initializeViews();
    initializeQueries();
  };
})();
