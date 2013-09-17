// Author: Ryan Foster
// Contact: ryan@rynamic.com
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
  'ui/views/base'
], function($, _, Backbone, BaseView) {
  "use strict";

  var Container = BaseView.extend({
    id: '',
    items: [],
    itemContainer: null,
    render: function() {
      var self = this;

      if (self.template !== null) {
        self.$el.html(_.template(this.template, this.serializedModel()));
      }

      this.renderItems();
      this.bindEvents();

      this.trigger('render', this);

      this.afterRender();

      return this;
    },
    renderItems: function() {
      var $container;

      if (this.itemContainer !== null) {
        $container = $(this.itemContainer, this.$el);
        if ($container.length === 0) {
          throw "Item Container element not found.";
        }
      } else {
        $container = this.$el;
      }
      _.each(this.items, function(view){
        $container.append(view.render().$el);
      }, this);
    },
    bindEvents: function() {
      var self = this;
      _.each(this.items, function(view) {
        view.on('all', function() {
          var eventName = arguments[0];
          var newName = self.id !== '' ? self.id + '.' + eventName : eventName;
          arguments[0] = newName;
          self.trigger.apply(self, arguments);
        });
      });
    },
    get: function(id){
      // Remove the recursive part because it was confusing if two children had the
      // same id
      return _.findWhere(this.items, {'id': id});
    },
    add: function(item) {
      if (item.id !== undefined && this.get(item.id)) {
        throw "Another item with the same `id` already exists.";
      }
      this.items.push(item);
    }
  });

  return Container;
});
