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
  'mockup-ui-url/views/popover',
  'mockup-patterns-sortable'
], function($, _, Backbone, PopoverView, Sortable) {
  'use strict';

  var ColumnsView = PopoverView.extend({
    className: 'popover columns',
    title: _.template('Columns'),
    content: _.template(
      '<label>Select columns to show, drag and drop to reorder</label>' +
      '<ul>' +
      '</ul>' +
      '<button class="plone-btn plone-btn-block plone-btn-success">Save</button>'
    ),
    itemTemplate: _.template(
      '<li>' +
        '<label>' +
          '<input type="checkbox" value="<%- id %>"/>' +
          '<%- title %>' +
        '</label>' +
      '</li>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    afterRender: function() {
      var self = this;

      self.$container = self.$('ul');
      _.each(self.app.activeColumns, function(id) {
        var $el = $(self.itemTemplate({
          title: self.app.availableColumns[id],
          id: id
        }));
        $el.find('input')[0].checked = true;
        self.$container.append($el);
      });
      _.each(_.omit(self.app.availableColumns, self.app.activeColumns), function(name, id) {
        var $el = $(self.itemTemplate({
          title: name,
          id: id
        }));
        self.$container.append($el);
      });

      var dd = new Sortable(self.$container, {
        selector: 'li'
      });
      return this;
    },
    applyButtonClicked: function() {
      var self = this;
      this.hide();
      self.app.activeColumns = [];
      self.$('input:checked').each(function() {
        self.app.activeColumns.push($(this).val());
      });
      self.app.setCookieSetting('activeColumns', this.app.activeColumns);
      self.app.tableView.render();
    }
  });

  return ColumnsView;
});





