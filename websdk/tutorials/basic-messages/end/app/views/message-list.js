'use strict';
/**
 * The Message List class renders a list of Message Views and insures
 * we stay scrolled to the bottom of the Message List.
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.MessageList = Backbone.View.extend({
    el: '.message-list',
    initialize: function() {
      this.$el.append("Your messages will go here");
    },

    /**
     * Render the messages in reverse order. Most recent message is at
     * index 0, but index 0 of our messages array goes on the bottom of the list of Message
     * Views.
     */
    render: function(messages) {
      var messages = messages.concat().reverse();

      // Make sure we are adding all our messages to an empty list
      this.$el.empty();

      // Render each item
      messages.forEach(this.addMessage, this);

      // Make sure the user can see the last message in the list
      this.scrollBottom();
    },

    /**
     * Render a single Message View, and mark the Message as read.
     */
    addMessage: function(message) {
      var messageView = new layerSampleApp.Message();
      this.$el.append(messageView.$el);
      messageView.render(message);
    },

    /**
     * Scroll to the bottom of the list so the most recent Message is visible.
     */
    scrollBottom: function() {
      this.el.scrollTop = this.el.scrollHeight;
    }
  });
})();
