'use strict';
/**
 * The UserListDialog View renders a dialog with a list of users provided
 * by the Identity Server.  The user selects a set of participants and creates
 * a Conversation with them.
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.UserListDialog = Backbone.View.extend({
    el: '.user-list-dialog',

    /**
     * Create the user list dialog and setup its event handlers
     */
    initialize: function() {
      this.users = [];
      this.$el.append(
        '<div class="user-list-dialog-inner">' +
          '<div class="user-list"></div>' +
          '<div class="button-panel">' +
            '<button class="button-ok">OK</button>' +
            '<button class="button-cancel">Cancel</button>' +
          '</div>' +
        '</div>'
      );
      this.$el.find('.button-ok').on('click', this.createConversation.bind(this));
      this.$el.find('.button-cancel').on('click', this.hide.bind(this));
    },

    /**
     * Hide the dialog
     */
    hide: function() {
      this.$el.removeClass('showing');
    },

    /**
     * Show the dialog
     */
    show: function() {
      this.$el.addClass('showing');
      this.render();
    },

    /**
     * Regenerate the list of users in the dialog.
     * Make sure not to list the current user in the list.
     */
    render: function() {
      var list = this.$el.find('.user-list');
      list.empty();

      // Render each user; except of course we don't need to create a conversation with
      // the current user.
      this.users.forEach(function(user) {
        this.renderUser(list, user);
      }, this);
    },

    /**
     * Render an individual User
     */
    renderUser: function(list, user) {
      // Tutorial Step 7
      if (user !== layerSampleApp.client.user) {
        list.append('<div class="user-list-item">' + user.displayName + '</div>');
      }
    },

    /**
     * When the user hits the OK Button, gather the participants and tell the controller to
     * create the conversation.
     */
    createConversation: function() {
      var participants = [];
      this.$el.find('input:checked').each(function(i, input) {
        participants.push(input.value);
      });
      this.trigger('conversation:created', participants);
      this.hide();
    }
  });
})();
