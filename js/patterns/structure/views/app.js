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
  'ui/views/toolbar',
  'ui/views/buttongroup',
  'ui/views/button',
  'structure/views/table',
  'structure/views/selectionwell',
  'structure/views/order',
  'structure/views/tags',
  'structure/views/properties',
  'structure/views/workflow',
  'structure/views/delete',
  'structure/views/selectionbutton',
  'structure/views/paging',
  'structure/views/textfilter',
  'structure/collections/result',
  'structure/collections/selected',
  'mockup-patterns-dropzone',
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, TableView, SelectionWellView,
            OrderView, TagsView, PropertiesView, WorkflowView, DeleteView, SelectionButtonView, PagingView, TextFilterView, ResultCollection,
            SelectedCollection, DropZone) {
  "use strict";

  var DISABLE_EVENT = 'DISABLE';

  var AppView = Backbone.View.extend({
    tagName: 'div',
    /* we setup binding here and specifically for every button so there is a
     * way to override default click event behavior.
     * Otherwise, if we bound all buttons to the same event, there is no way
     * to override the event or stop bubbling it. */
    buttonClickEvents: {
      'cut': 'cutCopyClickEvent',
      'copy': 'cutCopyClickEvent',
      'order': DISABLE_EVENT, //disable default
      'tags': DISABLE_EVENT, //disable
      'properties': DISABLE_EVENT,
      'workflow': DISABLE_EVENT,
      'delete': DISABLE_EVENT
    },
    initialize: function(){
      var self = this;
      self.options.additionalCriterias = [];
      self.collection = new ResultCollection([], {
        url: self.options.collectionUrl
      });
      self.collection.queryParser = function(){
        var term = null;
        if(self.toolbar){
          term = self.toolbar.get('filter').term;
        }
        return JSON.stringify({
          criteria: self.queryHelper.getCriterias(term, {
            additionalCriterias: self.options.additionalCriterias
          })
        });
      };

      self.queryHelper = self.options.queryHelper;
      self.selectedCollection = new SelectedCollection();
      self.collection.queryHelper = self.queryHelper;
      self.tableView = new TableView({app: self});
      self.pagingView = new PagingView({app: self});
      self.pasteAllowed = self.options.pasteAllowed;

      /* initialize buttons */
      self.setupButtons();

      self.wellView = new SelectionWellView({
        collection: self.selectedCollection,
        button: self.toolbar.get('selected'),
        app: self
      });
      self.orderView = new OrderView({
        button: self.buttons.folder.get('order'),
        app: self
      });
      self.tagsView = new TagsView({
        button: self.buttons.secondary.get('tags'),
        app: self
      });
      self.propertiesView = new PropertiesView({
        button: self.buttons.secondary.get('properties'),
        app: self
      });
      self.workflowView = new WorkflowView({
        button: self.buttons.secondary.get('workflow'),
        app: self
      });
      self.deleteView = new DeleteView({
        button: self.buttons.primary.get('delete'),
        app: self
      });

      self.toolbar.get('selected').disable();
      self.buttons.primary.disable();
      self.buttons.secondary.disable();

      self.selectedCollection.on('add remove reset', function(modal, collection) {
        if (collection.length) {
          self.toolbar.get('selected').enable();
          self.buttons.primary.enable();
          self.buttons.secondary.enable();
          if(!self.pasteAllowed){
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
    getSelectedUids: function(){
      var self = this;
      var uids = [];
      self.selectedCollection.each(function(item){
        uids.push(item.uid());
      });
      return uids;
    },
    defaultButtonClickEvent: function(button){
      var self = this;
      var data = null, callback = null;

      if(button.url){
        // handle ajax now

        if(arguments.length > 1){
          var arg1 = arguments[1];
          if(!arg1.preventDefault){
            data = arg1;
          }
        }
        if(arguments.length > 2){
          var arg2 = arguments[2];
          if(typeof(arg2) === 'function'){
            callback = arg2;
          }
        }
        if(data === null){
          data = {};
        }
        data.selection = JSON.stringify(self.getSelectedUids());
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
            self.collection.pager();
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
      self.pasteAllowed = true;
      self.buttons.primary.get('paste').enable();
    },
    setupButtons: function(){
      var self = this;
      self.buttons = {};
      var items = [];
      items.push(new SelectionButtonView({
        title: 'Selected',
        collection: this.selectedCollection
      }));
      _.each(_.pairs(this.options.buttonGroups), function(group){
        var buttons = [];
        _.each(group[1], function(button){
          button = new ButtonView(button);
          buttons.push(button);
          // bind click events now...
          var ev = self.buttonClickEvents[button.id];
          if(ev !== DISABLE_EVENT){
            if(ev === undefined){
              ev = 'defaultButtonClickEvent'; // default click event
            }
            button.on('button:click', self[ev], self);
          }
        });
        self.buttons[group[0]] = new ButtonGroup({
          items: buttons,
          id: group[0],
          app: self
        });
        items.push(self.buttons[group[0]]);
      });
      items.push(new TextFilterView({
        id: 'filter',
        app: this
      }));
      this.toolbar = new Toolbar({
        items: items
      });
    },
    render: function(){

      this.$el.append(this.toolbar.render().el);
      this.$el.append(this.wellView.render().el);
      this.$el.append(this.orderView.render().el);
      this.$el.append(this.tagsView.render().el);
      this.$el.append(this.propertiesView.render().el);
      this.$el.append(this.workflowView.render().el);
      this.$el.append(this.deleteView.render().el);

      this.$el.append(this.tableView.render().el);
      this.$el.append(this.pagingView.render().el);

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
