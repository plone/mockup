// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//


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
