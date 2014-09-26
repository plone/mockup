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

  var RenameView = PopoverView.extend({
    className: 'popover addnew',
    title: _.template('<%= translations.rename %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<div class="form-group">' +
        '<label for="filename-field"><%= translations.filename %></label>' +
        '<input type="text" class="form-control" ' +
                'id="filename-field">' +
      '</div>' +
      '<button class="plone-btn plone-btn-block plone-btn-primary"><%= translations.rename %></button>'
    ),
    events: {
      'click button': 'renameButtonClicked'
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      var node = self.app.getSelectedNode();
      self.$('input').val(node.name);
      self.$('.current-path').html(self.app.getNodePath(node));
    },
    renameButtonClicked: function(e) {
      var self = this;
      var $input = self.$('input');
      var filename = $input.val();
      if (filename){
        self.app.doAction('renameFile', {
          type: 'POST',
          data: {
            path: self.app.getNodePath(),
            filename: filename
          },
          success: function(data) {
            self.hide();
            self.app.$tree.tree('reload');
          }
        });
        // XXX show loading
      } else {
        self.$('.form-group').addClass('has-error');
      }
    }
  });

  return RenameView;
});