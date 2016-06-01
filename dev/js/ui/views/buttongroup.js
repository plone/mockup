define([
  'underscore',
  'mockup-ui-url/views/container'
], function(_, ContainerView) {
  'use strict';

  var ButtonGroup = ContainerView.extend({
    tagName: 'div',
    className: 'btn-group',
    idPrefix: 'btngroup-',
    disable: function() {
      _.each(this.items, function(button) {
        button.trigger('disable');
      });
    },
    enable: function() {
      _.each(this.items, function(button) {
        button.trigger('enable');
      });
    }
  });

  return ButtonGroup;
});
