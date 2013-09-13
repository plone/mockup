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
  'text!structure/templates/well.html',
], function($, _, Backbone, WellTemplate) {
  "use strict";

  var WellView = Backbone.View.extend({
    tagName: 'div',
    className: 'well',
    template: _.template(WellTemplate),
    events: {
      'click a.remove': 'itemRemoved'
    },
    initialize: function(){
      this.app = this.options.app;
      this.collection = this.app.selected_collection;
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'all', this.render);
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
    },
    render: function () {
      var html = this.template({
        collection: this.collection
      });
      this.$el.html(html);
      return this;
    },
    itemRemoved: function(e){
      e.preventDefault();
      var uid = $(e.target).closest('li').data('uid');
      this.app.selected_collection.removeByUID(uid);
    }
  });

  return WellView;
});
