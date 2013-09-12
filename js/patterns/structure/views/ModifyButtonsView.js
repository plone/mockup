
define([
  'underscore',
  'backbone',
  'structure/views/ButtonView',
  'button-groups',
], function(_, Backbone, ButtonView) {
  "use strict";

  var ModifyButtonsView = Backbone.View.extend({
    tagName: 'div',
    className: 'btn-group',
    template: _.template(
      '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' +
        'Modify' +
        '<span class="caret"></span>' +
      '</a>' +
      '<ul class="dropdown-menu">' +
      '</ul>'),
    render: function() {
      this.$el.html(this.template({}));
      var btnContainer = this.$('ul');
      _.each(this.options.buttons, function(btn){
        var view = (new ButtonView({model: btn})).render();
        btnContainer.append(view.el);
      });
      this.$('.dropdown-toggle').dropdown();
      return this;
    },
  });

  return ModifyButtonsView;
});
