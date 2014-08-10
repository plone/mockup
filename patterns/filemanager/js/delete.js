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
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var DeleteView = PopoverView.extend({
    className: 'popover delete',
    title: _.template('<%= translations.delete %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<p><%= translations.delete_question %></p>' +
      '<button class="btn btn-block btn-danger"><%= translations.yes_delete %></button>'
    ),
    events: {
      'click button': 'deleteButtonClicked'
    },
    getPath: function() {
      return this.app.getNodePath();
    },
    deleteButtonClicked: function(e) {
      var self = this;
      self.app.doAction('delete', {
        type: 'POST',
        data: {
          path: self.app.getNodePath()
        },
        success: function(data) {
          self.hide();
          self.app.$tree.tree('reload');
        }
      });
      // XXX show loading
    }
  });

  return DeleteView;
});