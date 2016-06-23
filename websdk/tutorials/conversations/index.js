/* global layer */
'use strict';

window.addEventListener('load', function() {
  /**
   * Initialize Layer Client with `appId`.
   */
  layerSampleApp.client = new layer.Client({
    appId: window.layerSampleConfig.appId
  }).connect(window.layerSampleConfig.userId);

  var client = layerSampleApp.client;

  /**
   * Client authentication challenge.
   * Sign in to Layer sample identity provider service.
   */
  client.on('challenge', function(evt) {
    layerSampleApp.getIdentityToken({
      appId: window.layerSampleConfig.appId,
      userId: window.layerSampleConfig.userId,
      nonce: evt.nonce,
      callback: function(identityToken) {
        evt.callback(identityToken);
      }
    });
  });

  /**
   * Client ready. Initialize controller.
   */
  client.once('ready', function() {
    layerSampleApp.initialize();
  });
});
