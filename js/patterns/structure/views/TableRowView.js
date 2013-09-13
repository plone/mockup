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
  'text!structure/templates/tablerow.html'
], function($, _, Backbone, TableRowTemplate) {
  "use strict";

  var TableRowView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template(TableRowTemplate),
    events: {
      'change input': 'itemSelected'
    },
    initialize: function(){
      this.app = this.options.app;
      this.selected_collection = this.app.selected_collection;
    },
    render: function() {
      var data = this.model.toJSON();
      data.selected = false;
      if(this.selected_collection.findWhere({UID: data.UID})){
        data.selected = true;
      }
      this.$el.html(this.template(data));
      var attrs = this.model.attributes;
      this.$el.addClass('state-' + attrs.review_state).
        addClass('type-' + attrs.Type);
      if(attrs.is_folderish){
        this.$el.addClass('folder');
      }
      this.el.model = this.model;
      return this;
    },
    itemSelected: function(){
      var remove = false;
      var checkbox = this.$('input')[0];
      if(checkbox.checked){
        this.app.selected_collection.add(this.model);
      }else{
        this.app.selected_collection.removeResult(this.model);
        remove = true;
      }

      var app = this.app;
      var selected_collection = this.selected_collection;

      /* check for shift click now */
      if(this.app.shift_clicked && this.app.last_selected &&
            this.app.last_selected.parentNode !== null){
        var $el = $(this.app.last_selected);
        var last_checked_index = $el.index();
        var this_index = this.$el.index();
        this.app.table_view.$('input[type="checkbox"]').each(function(){
          var $el = $(this);
          var index = $el.parents('tr').index();
          if((index > last_checked_index && index < this_index) ||
              (index < last_checked_index && index > this_index)){
            this.checked = checkbox.checked;
            var model = $(this).closest('tr')[0].model;
            var existing = selected_collection.getByUID(model.attributes.UID);
            if(this.checked){
              if(!existing){
                selected_collection.add(model);
              }
            } else if(existing){
              selected_collection.remove(existing);
            }
          }
        });

      }
      this.app.last_selected = this.el;
    }
  });

  return TableRowView;
});
