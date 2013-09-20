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
  'structure/views/SelectionWellView',
  'structure/views/OrderView',
  'structure/views/TagsView',
  'structure/views/SelectionButtonView',
  'structure/views/PagingView',
  'structure/views/TextFilterView',
  'structure/collections/ResultCollection',
  'structure/collections/SelectedCollection',
  'mockup-patterns-dropzone',
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, TableView, SelectionWellView,
            OrderView, TagsView, SelectionButtonView, PagingView, TextFilterView, ResultCollection,
            SelectedCollection, DropZone) {
  "use strict";

  var AppView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      var self = this;
      self.collection = new ResultCollection([], {
        url: self.options.collection_url
      });
      self.queryHelper = self.options.queryHelper;
      self.selected_collection = new SelectedCollection();
      self.collection.queryHelper = self.queryHelper;
      self.table_view = new TableView({app: self});
      self.paging_view = new PagingView({app: self});
      self.paste_allowed = self.options.paste_allowed;

      /* initialize buttons */
      self.setupButtons();

      self.well_view = new SelectionWellView({
        collection: self.selected_collection,
        button: self.toolbar.get('selected'),
        app: self
      });
      self.order_view = new OrderView({
        button: self.buttons.folder.get('order'),
        app: self
      });
      self.tags_view = new TagsView({
        button: self.buttons.secondary.get('tags'),
        app: self
      });

      self.toolbar.on('button.cut:click primary.button.copy:click', self.cutCopyClickEvent, self);
      self.toolbar.on('button:click', self.buttonClickEvent, self);

      self.toolbar.get('selected').disable();
      self.buttons.primary.disable();
      self.buttons.secondary.disable();

      self.selected_collection.on('add remove reset', function(modal, collection) {
        if (collection.length) {
          self.toolbar.get('selected').enable();
          self.buttons.primary.enable();
          self.buttons.secondary.enable();
          if(!self.paste_allowed){
            self.buttons.primary.get('paste').disable();
          }
        } else {
          this.toolbar.get('selected').disable();
          self.buttons.primary.disable();
          self.buttons.secondary.disable();
        }
      }, self);

      /* detect shift clicks */
      self.shift_clicked = false;
      $(document).bind('keyup keydown', function(e){
        self.shift_clicked = e.shiftKey;
      });
    },
    buttonClickEvent: function(button){
      var self = this;
      var data = null, callback = null;

      if(button.url){
        // handle ajax now
        var uids = [];
        self.selected_collection.each(function(item){
          uids.push(item.uid());
        });

        if(arguments.length > 1){
          var arg1 = arguments[1];
          if(!arg1.preventDefault){
            data = arg1;
          }
        }
        if(arguments.length > 2){
          var arg2 = arguments[2];
          if(arg2 === 'function'){
            callback = arg2;
          }
        }
        if(data === null){
          data = {
            'selection': JSON.stringify(uids)
          };
        }
        data._authenticator = $('input[name="_authenticator"]').val();

        var url = button.url.replace('{path}', self.options.queryHelper.getCurrentPath());
        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          success: function(data){
            if(data.status === 'success'){
              self.collection.reset();
            }
            if(data.msg){
              // give status message somewhere...
              alert(data.msg);
            }
            if(callback !== null){
              callback(data);
            }
          },
          error: function(data){
            if(data.status === 404){
              alert('operation url "' + url + '" is not valid');
            }
          }
        });
      }
    },
    cutCopyClickEvent: function(button){
      var self = this;
      self.paste_allowed = true;
      self.buttons.primary.get('paste').enable();
    },
    setupButtons: function(){
      var self = this;
      self.buttons = {};
      var items = [];
      items.push(new SelectionButtonView({
        title: 'Selected',
        collection: this.selected_collection
      }));
      _.each(_.pairs(this.options.buttonGroups), function(group){
        var buttons = [];
        _.each(group[1], function(button){
          buttons.push(new ButtonView(button));
        });
        self.buttons[group[0]] = new ButtonGroup({
          items: buttons,
          id: group[0],
          app: self
        });
        items.push(self.buttons[group[0]]);
      });
      items.push(new TextFilterView({id: 'filter'}));
      this.toolbar = new Toolbar({
        items: items
      });
    },
    render: function(){

      this.$el.append(this.toolbar.render().el);
      this.$el.append(this.well_view.render().el);
      this.$el.append(this.order_view.render().el);
      this.$el.append(this.tags_view.render().el);

      this.$el.append(this.table_view.render().el);
      this.$el.append(this.paging_view.render().el);

      /* dropzone support */
      var self = this;
      var uploadUrl = self.options.uploadUrl;
      if(uploadUrl){
        self.dropzone = new DropZone(self.$el, {
          className: 'structure-dropzone',
          clickable: false,
          url: uploadUrl,
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
