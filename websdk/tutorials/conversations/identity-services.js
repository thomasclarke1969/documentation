/* global layer */
'use strict';

/**
 * Exports Identity Service Utilities
 * * window.layerSampleApp.Identities:
 *   * getList: Gets all registered users
 *   * getIdentityToken: Gets Identity Token from Identity Server
 *   * getDisplayName: Gets display name for a user
 */
(function() {
  var layerSampleApp = window.layerSampleApp;

  /**
   * All code here is specific to a sample identity service to help get
   * sample apps up and running quickly, and should not be a part of any
   * app you build yourself.
   *
   * @method
   * @param  {Object}   options
   * @param  {String}   options.appId    Application ID (shown on Developer Dashboard)
   * @param  {String}   options.userId   User ID to show for this user
   * @param  {String}   options.nonce    Nonce to use to get an Identity Token
   * @param  {Function} options.callback Function to call on getting an Identity Token
   */
  function getIdentityToken(options) {
    var id = options.appId.replace(/^.*\//, '');
    layer.xhr({
      url: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
      headers: {
        'X_LAYER_APP_ID': id,
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      data: {
        user: {
          id: options.userId,
          display_name: 'User ' + options.userId
        },
        nonce: options.nonce,
        app_id: id
      }
    }, function(result) {
      var data = result.data;
      options.callback(data.identity_token);
    });
  }
  layerSampleApp.getIdentityToken = getIdentityToken;
})();
