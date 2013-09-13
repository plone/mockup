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
  'structure/views/TableRowView'
], function(_, Backbone, TableRowView) {
  "use strict";

  var TableView = Backbone.View.extend({
    tagName: 'table',
    className: 'table table-striped table-bordered',
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
