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

    // Step 2, 3 and 5: Render conversation list here
    render: function() {
      
    }
  });
})();
