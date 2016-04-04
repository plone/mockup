define([
  'backbone',
  'mockup-utils',
], function(Backbone, utils) {
  'use strict';

  // use a more primative class than Backbone.Model?
  var Navigation = Backbone.Model.extend({
    initialize: function(options) {
      this.options = options;
      this.app = options.app;
      this.model = options.model;
    },
    folderClicked: function(e) {
      e.preventDefault();
      // handler for folder, go down path and show in contents window.
      var self = this;
      self.app.setCurrentPath(self.model.attributes.path);
      // also switch to fix page in batch
      self.app.collection.goTo(self.app.collection.information.firstPage);
    },
  });

  return Navigation;
});
