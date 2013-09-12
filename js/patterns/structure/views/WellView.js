
define([
  'underscore',
  'backbone',
], function(_, Backbone) {
  "use strict";

  var WellView = Backbone.View.extend({
    tagName: 'div',
    render: function(){
      this.$el.addClass('well');
      return this;
    }
  });

  return WellView;
});
