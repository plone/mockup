
define(['backbone', 'underscore'], function(Backbone, _) {
  "use strict";

  var ButtonView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<a href="#"><%- title %></a>'),
    events: {
      'click a': 'handleClick'
    },
    handleClick: function(e){
      return this.model.click(e);
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  return ButtonView;
});
