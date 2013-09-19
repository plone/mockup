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
  'ui/views/PopoverView'
], function($, _, Backbone, PopoverView) {
  "use strict";

  var OrderView = PopoverView.extend({
    title: _.template('Set folder ordering'),
    content: _.template(
      '<select>' +
        '<% _.each(folderOrderModes, function(mode){ %>' +
          '<option value="<%= mode.id %>"' +
              '<% if(mode.id == folderOrder) { %>selected="selected"<% } %> >' +
              '<%= mode.title %></option>' +
        '<% }) %>' +
      '</select>'),
    events: {
      'change select': 'orderModeChanged'
    },
    initialize: function(){
      this.app = this.options.app;
      this.options.folderOrderModes = this.app.options.folderOrderModes;
      this.options.folderOrder = this.app.options.folderOrder;
      PopoverView.prototype.initialize.call(this);
    },
    render: function () {
      PopoverView.prototype.render.call(this);
      return this;
    },
    orderModeChanged: function(){
      var self = this;

      self.app.buttonClickEvent(self.options.button, {
        orderMode: self.$('select').val()
      }, function(data){
        self.hide();
        self.app.collection.reset();
      });
    }
  });

  return OrderView;
});

