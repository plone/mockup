define([
  'jquery',
  'backbone',
  'underscore',
  'mockup-ui-url/views/button',
  'text!mockup-patterns-structure-url/templates/selection_button.xml'
], function($, Backbone, _, ButtonView, tplButton) {
  'use strict';

  var SelectionButton = ButtonView.extend({
    collection: null,
    template: tplButton,
    initialize: function(options) {
      ButtonView.prototype.initialize.apply(this, [options]);

      if (this.collection !== null) {
        this.collection.on('add remove reset', function() {
          this.render();
          if (this.collection.length === 0) {
            this.$el.removeClass('active');
          }
        }, this);
      }
    },
    serializedModel: function() {
      var obj = {icon: '', title: this.options.title, length: 0};
      if (this.collection !== null) {
        obj.length = this.collection.length;
      }
      return obj;
    }
  });

  return SelectionButton;
});
