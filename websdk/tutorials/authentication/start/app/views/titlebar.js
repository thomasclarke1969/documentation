'use strict';
/**
 * The Titlebar View class simply renders the participant names of the selected Conversation.
 * @type {Object}
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.Titlebar = Backbone.View.extend({
    el: '.conversation-header',

    /**
     * Render the title for the current Conversation.
     * Use the Identity Service's getDisplayName to turn userIds
     * into displayable names.
     */
    render: function(conversation) {
      var title = 'Welcome to the Tutorial Sample App';
      this.$el.html('<div class="title">' + title + '</div>');
    }
  });
})();