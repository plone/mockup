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
  'text!js/patterns/structure/templates/tablerow.xml'
], function($, _, Backbone, TableRowTemplate) {
  "use strict";

  var TableRowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'itemRow',
    template: _.template(TableRowTemplate),
    events: {
      'change input': 'itemSelected',
      'click a': 'itemClicked'
    },
    initialize: function(){
      this.app = this.options.app;
      this.selectedCollection = this.app.selectedCollection;
    },
    render: function() {
      var data = this.model.toJSON();
      data.selected = false;
      if(this.selectedCollection.findWhere({UID: data.UID})){
        data.selected = true;
      }
      data.attributes = this.model.attributes;
      data.activeColumns = this.app.activeColumns;
      this.$el.html(this.template(data));
      var attrs = this.model.attributes;
      this.$el.addClass('state-' + attrs.review_state).
        addClass('type-' + attrs.Type);
      if(attrs.is_folderish){
        this.$el.addClass('folder');
      }
      this.$el.attr('data-path', data.path);
      this.$el.attr('data-UID', data.UID);
      this.$el.attr('data-id', data.id);
      this.$el.attr('data-type', data.Type);
      this.$el.attr('data-folderish', data.is_folderish);
      this.el.model = this.model;
      return this;
    },
    itemClicked: function(e){
      /* check if this should just be opened in new window */
      var keyEvent = this.app.keyEvent;
      if(keyEvent && keyEvent.ctrlKey){
        /* control held down, let's open in new window */
        var win = window;
        if (win.parent !== window) {
          win = win.parent;
        }
        var url = this.model.attributes.getURL + '/view';
        win.open(url);
      }else if(this.model.attributes.is_folderish){
        // it's a folder, folder down path and show in contents window.
        e.preventDefault();
        this.app.queryHelper.currentPath = this.model.attributes.path;
        this.app.collection.pager();
      }
    },
    itemSelected: function(){
      var checkbox = this.$('input')[0];
      if(checkbox.checked){
        this.app.selectedCollection.add(this.model);
      }else{
        this.app.selectedCollection.removeResult(this.model);
      }

      var selectedCollection = this.selectedCollection;

      /* check for shift click now */
      var keyEvent = this.app.keyEvent;
      if(keyEvent && keyEvent.shiftKey && this.app.last_selected &&
            this.app.last_selected.parentNode !== null){
        var $el = $(this.app.last_selected);
        var last_checked_index = $el.index();
        var this_index = this.$el.index();
        this.app.tableView.$('input[type="checkbox"]').each(function(){
          $el = $(this);
          var index = $el.parents('tr').index();
          if((index > last_checked_index && index < this_index) ||
              (index < last_checked_index && index > this_index)){
            this.checked = checkbox.checked;
            var model = $(this).closest('tr')[0].model;
            var existing = selectedCollection.getByUID(model.attributes.UID);
            if(this.checked){
              if(!existing){
                selectedCollection.add(model);
              }
            } else if(existing){
              selectedCollection.remove(existing);
            }
          }
        });

      }
      this.app.last_selected = this.el;
    }
  });

  return TableRowView;
});
