'use strict';

/**
 * Controller initializer
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.Controller = function(client) {

    var titlebarView;

    /**
     * During initialization, create all of the views and setup event listeners
     * to handle user interaction events.
     */
    function initializeViews() {
      titlebarView = new layerSampleApp.Titlebar();
      titlebarView.render();
    }


    // Initialize Everything:
    initializeViews();
  };
})();
