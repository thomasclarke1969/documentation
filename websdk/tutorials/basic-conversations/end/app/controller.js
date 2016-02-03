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

      // When the user selects a Conversation, call selectConversation.
      conversationListView.on('conversation:selected', function(conversationId) {
          selectConversation(conversationId);
      });
    }

    /**
     * During initialization we need to create the queries that will
     * download data from Layer's servers;
     * Also need to setup event handlers to rerender when the query
     * data changes.
     */
    function initializeQueries() {
      conversationQuery = client.createQuery({
        model: layer.Query.Conversation
      });

      conversationQuery.on('change', function() {
        conversationListView.render(conversationQuery.data);
      });
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
      var conversation = client.createConversation({
          participants: participants,
          distinct: true
      });
      selectConversation(conversation.id);
    }

    /**
     * Handle the user selecting a Conversation
     */
    function selectConversation(conversationId) {
      var conversation = client.getConversation(conversationId);
      activeConversation = conversation;

      // Update the Conversation List to highlight the selected Conversation
      conversationListView.selectedConversation = conversation;
      conversationListView.render();

      titlebarView.render(conversation);
    }

    // Initialize Everything:
    initializeViews();
    initializeQueries();
  };
})();
