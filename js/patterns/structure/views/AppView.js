
define([
  'underscore',
  'backbone',
  'structure/views/ModifyButtonsView',
  'structure/models/Button',
  'structure/views/TableView',
  'structure/views/WellView',
  'structure/views/PagingView',
  'structure/collections/ResultCollection'
], function(_, Backbone, ModifyButtonsView, Button, TableView, WellView,
            PagingView, ResultCollection) {
  "use strict";

  var AppView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      this.buttons_view = new ModifyButtonsView({
        buttons: [
          new Button({title: 'Cut'}),
          new Button({title: 'Copy'}),
          new Button({title: 'Delete'}),
          new Button({title: 'Workflow'}),
          new Button({title: 'Tags'}),
          new Button({title: 'Dates'})
        ]
      });
      this.collection = new ResultCollection([], {
        url: this.options.collection_url
      });
      this.collection.queryHelper = this.options.queryHelper;
      this.table_view = new TableView({collection: this.collection});
      this.well_view = new WellView({table_view: this.table_view});
      this.paging_view = new PagingView({collection: this.collection});
    },
    render: function(){
      this.$el.append(this.buttons_view.render().el);
      this.$el.append(this.table_view.render().el);
      this.$el.append(this.paging_view.render().el);
      this.$el.append(this.well_view.render().el);
      return this;
    }
  });

  return AppView;
});
