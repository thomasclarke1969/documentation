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
     * Render the Conversation List
     */
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
  });

  function betterTitle(conversation) {
    return conversation.participants.map(function(userId) {
      return layerSampleApp.Identities.getDisplayName(userId);
    }).join(', ');
  }
})();
