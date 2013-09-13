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
  'jquery',
  'underscore',
  'backbone',
  'structure/views/TableRowView',
  'text!structure/templates/table.html'
], function($, _, Backbone, TableRowView, TableTemplate) {
  "use strict";

  var TableView = Backbone.View.extend({
    tagName: 'div',
    template: _.template(TableTemplate),
    initialize: function(){
      this.app = this.options.app;
      this.collection = this.app.collection;
      this.selected_collection = this.app.selected_collection;
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.selected_collection, 'remove', this.render);
      this.collection.pager();
    },
    render: function() {
      var self = this;
      self.$el.html(self.template({}));
      if(self.collection.length){
        var container = self.$('tbody');
        self.collection.each(function(result){
          var view = (new TableRowView({
            model: result,
            app: self.app
          })).render();
          container.append(view.el);
        });
      }
      return this;
    },
  });

  return TableView;
});
