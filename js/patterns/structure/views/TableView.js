
define([
  'underscore',
  'backbone',
  'structure/views/TableRowView'
], function(_, Backbone, TableRowView) {
  "use strict";

  var TableView = Backbone.View.extend({
    tagName: 'table',
    template: _.template(
      '<thead>' +
        '<tr>' +
          '<th colspan="2">Title</th>' +
          '<th>Last Modified</th>' +
          '<th>Published on</th>' +
          '<th>State</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
      '</tbody>'),
    initialize: function(){
      this.collection = this.options.collection;
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'all', this.render);
      this.collection.pager();
    },
    render: function() {
      this.$el.html(this.template({}));
      this.$el.addClass('table').addClass('table-striped').
        addClass('table-bordered');
      if(this.collection.length){
        var container = this.$('tbody');
        this.collection.each(function(result){
          var view = (new TableRowView({model: result})).render();
          container.append(view.el);
        });
      }
      return this;
    },
  });

  return TableView;
});
