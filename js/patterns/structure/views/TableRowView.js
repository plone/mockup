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
