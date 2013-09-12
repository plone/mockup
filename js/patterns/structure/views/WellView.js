
define([
  'underscore',
  'backbone',
], function(_, Backbone) {
  "use strict";

  var WellView = Backbone.View.extend({
    tagName: 'div',
    className: 'well'
  });

  return WellView;
});
