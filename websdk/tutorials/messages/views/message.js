'use strict';
/**
 * The MessageView Class renders a single Message which consists of
 * * Sender: Displayable name of the participant or service that sent the Message
 * * Read Status: Has the Message been read by none, some or all recipients
 * * Sent Date: Today's time, or prior days date + time
 * * Message Text: What was said
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.Message = Backbone.View.extend({
    tagName: 'div',
    className: 'message-item',

    /**
     * Render the Message.
     */
    render: function(message) {
      this.$el.append('This is a Message');

      // Tutorial Step 4: Render a single message here

      // Tutorial Step 5: Mark message as read here
    }
  });
})();
