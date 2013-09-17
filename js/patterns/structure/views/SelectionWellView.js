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
  'text!structure/templates/selection_well.html',
  'text!structure/templates/selection_item.html'
], function($, _, Backbone, WellTemplate, ItemTemplate) {
  "use strict";

  var WellView = Backbone.View.extend({
    tagName: 'div',
    className: 'selected-items',
    template: _.template(WellTemplate),
    events: {
      'click a.remove': 'itemRemoved',
      'click a.status': 'showItemsClicked'
    },
    initialize: function(){
      this.opened = false;
      this.app = this.options.app;
      this.collection = this.app.selected_collection;
      this.listenTo(this.collection, 'reset all add remove', this.render);
    },
    render: function () {
      this.$el.html(this.template({}));
      _.each(this.collection.models, function(model) {
        $('.items', this.$el).append(_.template(ItemTemplate, model.toJSON()));
      }, this);
      if (this.collection.length === 0) {
        this.$el.removeClass('active');
      }
      return this;
    },
    itemRemoved: function(e){
      e.preventDefault();
      var uid = $(e.target).data('uid');
      this.app.selected_collection.removeByUID(uid);
    },
    showItemsClicked: function(e){
      e.preventDefault();
      if(this.opened){
        this.$('ul').css({display: 'none'});
        this.opened = false;
      } else {
        this.showItems();
        this.opened = true;
      }
    }
  });

  return WellView;
});
