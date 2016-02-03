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
     * Get a displayable date for when the message was sent.
     * Return Time if it was sent today, or Date + Time if sent before today.
     */
    getSentAt: function(message) {
      var now = new Date();
      var date = message.sentAt;

      if (date.toLocaleDateString() === now.toLocaleDateString()) return date.toLocaleTimeString();
      else return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },

    /**
     * Get the read status of the message.  Only the user who Sent the Message cares about
     * its read status.
     */
    getMessageStatus: function(message) {
      var status;
      if (message.sender.userId === layerSampleApp.client.userId) {
        switch (message.readStatus) {
          case 'NONE':
            status = 'unread';
            break;
          case 'SOME':
            status = 'read by some';
            break;
          case 'ALL':
            status = 'read';
            break;
          default:
            status = 'unread';
            break;
        }
      } else {
        status = '';
      }
      return '<span class="message-status">' + status + '</span>';
    },

    /**
     * Get the message text, which typically is just the body property of the only MessagePart.
     * But just to be on the safe side, we'll get the body property
     */
    getMessageText: function(message) {
      return message.parts.filter(function(part) {
        return part.mimeType === 'text/plain';
      }).map(function(part) {
        return part.body;
      }).join('<br/>');
    },

    /**
     * Return the sender's displayable name
     */
    getSenderName: function(message) {
      // If this was sent by a service such as the Layer Platform API, it may use a name
      // to represent the name of the service, "Admin", "Moderator", or just "Layer".
      if (message.sender.name) {
        return message.sender.name;
      } else {
        // Else we need to transform the User ID of the participant into a displayable name.
        return layerSampleApp.Identities.getDisplayName(message.sender.userId);
      }
    },

    /**
     * Render the Message.
     */
    render: function(message) {
      message.isRead = true;
      this.$el.append(
        '<div class="message-content">' +
          '<span class="name">' + this.getSenderName(message) + '</span>' +
          '<div class="bubble">' + this.getMessageText(message) + '</div>' +
        '</div>' +
        '<div class="timestamp">' + this.getSentAt(message) + this.getMessageStatus(message) + '</div>'
      );
    }
  });
})();
