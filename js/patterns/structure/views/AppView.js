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
  'ui/views/Toolbar',
  'ui/views/ButtonGroup',
  'ui/views/Button',
  'structure/views/TableView',
  'structure/views/WellView',
  'structure/views/PagingView',
  'structure/views/TextFilterView',
  'structure/collections/ResultCollection',
  'structure/collections/SelectedCollection',
  'mockup-patterns-dropzone'
], function($, _, Backbone, Toolbar, ButtonGroup, Button, TableView, WellView,
            PagingView, TextFilterView, ResultCollection, SelectedCollection, DropZone) {
  "use strict";

  var AppView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      var self = this;
      this.collection = new ResultCollection([], {
        url: this.options.collection_url
      });
      self.queryHelper = self.options.queryHelper;
      this.selected_collection = new SelectedCollection();
      this.collection.queryHelper = this.queryHelper;
      this.table_view = new TableView({app: this});
      this.well_view = new WellView({app: this});
      this.paging_view = new PagingView({app: this});

      var items = [];
      _.each(this.options.buttonGroups, function(group){
        var buttons = [];
        _.each(group, function(button){
          buttons.push(new Button(button));
        });
        items.push(new ButtonGroup({
          items: buttons,
          app: self
        }));
      });
      items.push(new TextFilterView({id: 'filter'}));
      this.toolbar = new Toolbar({
        items: items
      });

      this.toolbar.on('button:click', function(button) {
        if(button.url){
          // handle ajax now
          var uids = [];
          self.selected_collection.each(function(item){
            uids.push(item.uid());
          });
          var url = button.url.replace('{path}', self.options.queryHelper.getCurrentPath());
          $.ajax({
            url: url,
            type: 'POST',
            data: {
              '_authenticator': $('input[name="_authenticator"]').val(),
              'selection': JSON.stringify(uids)
            },
            success: function(data){
              if(data.status === 'success'){
                self.collection.reset();
              }
              if(data.msg){
                alert(data.msg);
              }
            },
            error: function(data){
              if(data.status === 404){
                alert('operation url "' + url + '" is not valid');
              }
            }
          });
        }
      });

      this.toolbar.on('filter:change', function(value, view) {
        // do something when the filter happens
        var foo = 'two';
      });

      this.toolbar.items[0].disable();
      this.toolbar.items[1].disable();

      this.selected_collection.on('add remove', function(modal, collection) {
        if (collection.length) {
          this.toolbar.items[0].enable();
          this.toolbar.items[1].enable();
        } else {
          this.toolbar.items[0].disable();
          this.toolbar.items[1].disable();
        }
      }, this);

      /* detect shift clicks */
      this.shift_clicked = false;
      $(document).bind('keyup keydown', function(e){
        self.shift_clicked = e.shiftKey;
      });
    },
    render: function(){

      this.$el.append(this.well_view.render().el);
      this.$el.append(this.toolbar.render().el);
      this.$el.append(this.table_view.render().el);
      this.$el.append(this.paging_view.render().el);

      /* dropzone support */
      var self = this;
      var upload_url = self.options.upload_url;
      if(upload_url){
        self.dropzone = new DropZone(self.$el, {
          klass: 'structure-dropzone',
          clickable: false,
          url: upload_url,
          autoCleanResults: true,
          success: function(e, data){
            self.table_view.render();
          }
        }).dropzone;
        self.dropzone.on('sending', function(){
          self.$el.addClass('dropping');
        });
        self.dropzone.on('complete', function(){
          self.$el.removeClass('dropping');
        });
      }
      return this;
    }
  });

  return AppView;
});
