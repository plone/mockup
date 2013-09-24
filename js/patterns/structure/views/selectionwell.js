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
  'js/patterns/ui/views/popover',
  'text!js/patterns/structure/templates/selection_item.html'
], function($, _, Backbone, PopoverView, ItemTemplate) {
  "use strict";

  var WellView = PopoverView.extend({
    className: 'popoverview selected',
    title: _.template('<input type="text" class="filter" placeholder="Filter" />' +
                      '<a href="#" class="icon-remove-sign remove-all">remove all</a>'),
    content: _.template(
      '<% collection.each(function(item){ %>' +
        '<%= item_template(item.toJSON()) %>' +
      '<% }); %>'),
    events: {
      'click a.remove': 'itemRemoved',
      'keyup input.filter': 'filterSelected',
      'click .remove-all': 'removeAll'
    },
    initialize: function(){
      PopoverView.prototype.initialize.call(this);
      this.listenTo(this.collection, 'reset all add remove', this.render);
      this.options.item_template = _.template(ItemTemplate);
    },
    render: function () {
      PopoverView.prototype.render.call(this);
      if (this.collection.length === 0) {
        this.$el.removeClass('active');
      }
      return this;
    },
    itemRemoved: function(e){
      e.preventDefault();
      var uid = $(e.target).data('uid');
      this.collection.removeByUID(uid);
      if(this.collection.length !== 0){
        // re-rendering causes it to close, reopen
        this.show();
      }
    },
    filterSelected: function(e) {
      var val = $(e.target).val().toLowerCase();
      $('.selected-item', this.$el).each(function() {
        var $el = $(this);
        if ($el.text().toLowerCase().indexOf(val) === -1) {
          $el.hide();
        } else {
          $el.show();
        }
      });
    },
    removeAll: function(e) {
      e.preventDefault();
      this.collection.reset();
      this.hide();
    }
  });

  return WellView;
});
