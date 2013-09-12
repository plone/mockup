define([
  'underscore',
  'backbone',
], function(_, Backbone) {
  "use strict";

  var TableRowView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template(
      '<td><input type="checkbox" /></td>' +
      '<td><a href="<%- getURL %>"><%- Title %></td></a>' +
      '<td><%- ModificationDate %></td>' +
      '<td><%- EffectiveDate %></td>' +
      '<td><%- review_state %></td>'),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      var attrs = this.model.attributes;
      this.$el.addClass('state-' + attrs.review_state).
        addClass('type-' + attrs.Type);
      if(attrs.is_folderish){
        this.$el.addClass('folder');
      }
      return this;
    },
  });

  return TableRowView;
});
