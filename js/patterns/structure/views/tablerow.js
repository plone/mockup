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
  'js/patterns/structure/views/actionmenu',
  'text!js/patterns/structure/templates/tablerow.xml'
], function($, _, Backbone, ActionMenu, TableRowTemplate) {
  'use strict';

  var TableRowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'itemRow',
    template: _.template(TableRowTemplate),
    events: {
      'change input': 'itemSelected',
      'click td.title a': 'itemClicked'
    },
    initialize: function(options) {
      this.options = options;
      this.app = options.app;
      this.selectedCollection = this.app.selectedCollection;
      this.table = this.options.table;
    },
    render: function() {
      var self = this;
      var data = this.model.toJSON();
      data.selected = false;
      if (this.selectedCollection.findWhere({UID: data.UID})) {
        data.selected = true;
      }
      data.attributes = self.model.attributes;
      data.activeColumns = self.app.activeColumns;
      data.availableColumns = self.app.availableColumns;
      self.$el.html(self.template(data));
      var attrs = self.model.attributes;
      self.$el.addClass('state-' + attrs['review_state']).addClass('type-' + attrs.Type); // jshint ignore:line
      if (attrs['is_folderish']) { // jshint ignore:line
        self.$el.addClass('folder');
      }
      self.$el.attr('data-path', data.path);
      self.$el.attr('data-UID', data.UID);
      self.$el.attr('data-id', data.id);
      self.$el.attr('data-type', data.Type);
      self.$el.attr('data-folderish', data['is_folderish']); // jshint ignore:line

      self.el.model = this.model;

      self.menu = new ActionMenu({
        app: self.app,
        model: self.model
      });

      $('.actionmenu-container', self.$el).append(self.menu.render().el);
      return this;
    },
    itemClicked: function(e) {
      e.preventDefault();
      /* check if this should just be opened in new window */
      var keyEvent = this.app.keyEvent;
      if (keyEvent && keyEvent.ctrlKey) {
        this.openClicked(e);
      } else if (this.model.attributes['is_folderish']) { // jshint ignore:line
        // it's a folder, go down path and show in contents window.
        this.app.queryHelper.currentPath = this.model.attributes.path;
        // also switch to fix page in batch
        var collection = this.app.collection;
        collection.goTo(collection.information.firstPage);
      } else {
        this.openClicked(e);
      }
    },
    itemSelected: function() {
      var checkbox = this.$('input')[0];
      if (checkbox.checked) {
        this.app.selectedCollection.add(this.model);
      } else {
        this.app.selectedCollection.removeResult(this.model);
      }

      var selectedCollection = this.selectedCollection;

      /* check for shift click now */
      var keyEvent = this.app.keyEvent;
      if (keyEvent && keyEvent.shiftKey && this.app['last_selected'] && // jshint ignore:line
            this.app['last_selected'].parentNode !== null) { // jshint ignore:line
        var $el = $(this.app['last_selected']); // jshint ignore:line
        var lastCheckedIndex = $el.index();
        var thisIndex = this.$el.index();
        this.app.tableView.$('input[type="checkbox"]').each(function() {
          $el = $(this);
          var index = $el.parents('tr').index();
          if ((index > lastCheckedIndex && index < thisIndex) ||
              (index < lastCheckedIndex && index > thisIndex)) {
            this.checked = checkbox.checked;
            var model = $(this).closest('tr')[0].model;
            var existing = selectedCollection.getByUID(model.attributes.UID);
            if (this.checked) {
              if (!existing) {
                selectedCollection.add(model);
              }
            } else if (existing) {
              selectedCollection.remove(existing);
            }
          }
        });

      }
      this.app['last_selected'] = this.el; // jshint ignore:line
    }
  });

  return TableRowView;
});
