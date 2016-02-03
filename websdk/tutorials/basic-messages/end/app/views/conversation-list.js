'use strict';
/**
 * The ConversationList Class renders a list of Conversations and allows the user
 * to select or delete Conversations.
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.ConversationList = Backbone.View.extend({
    el: '.conversation-list',

    initialize: function() {
      this.$el.append("Your conversation list goes here");
    },

    /**
     * Get the displayable name of the Conversation, which consists
     * of the list of participant's displayable names.
     */
    renderTitle: function(conversation) {
      return '<div class="title">' +
        conversation.participants.map(function(userId) {
          return layerSampleApp.Identities.getDisplayName(userId)
        }).join(', ') +
        '</div>';
    },

    /**
     * Render a single row of the list, representing a single Conversation
     */
    renderRow: function(conversation) {
        var cssClasses = ['conversation-list-item'];

        // Highlight any Conversations with unread messages
        if (conversation.unreadCount) cssClasses.push('unread-messages');

        // Highlight the selected Conversation
        if (this.selectedConversation && conversation.id === this.selectedConversation.id) {
          cssClasses.push('selected-conversation');
        }

        // Generate the DOM
        var row =
          this.$el.append(
            '<div class=" ' + cssClasses.join(' ') + '">' +
              '<div class="info">' +
                '<div class="main">' +
                   this.renderTitle(conversation) +
                '</div>' +
              '</div>' +
            '</div>'
          ).children().last();

        // Setup Conversation select click handler
        row.on('click', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          this.trigger('conversation:selected', conversation.id);
        }.bind(this));
    },

    /**
     * Render the Conversation List
     */
    render: function(conversations) {
      if (conversations) this.conversations = conversations;
      this.$el.empty();
      this.conversations.forEach(function(conversation) {
        this.renderRow(conversation);
      }, this);
    }
  });
})();