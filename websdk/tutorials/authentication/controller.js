'use strict';

/**
 * App initializer
 */
(function() {
  var layerSampleApp = window.layerSampleApp;
  layerSampleApp.initialize = function() {

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
