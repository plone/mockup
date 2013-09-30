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
  'js/ui/views/toolbar',
  'js/ui/views/buttongroup',
  'js/ui/views/button',
  'js/patterns/structure/views/table',
  'js/patterns/structure/views/selectionwell',
  'js/patterns/structure/views/order',
  'js/patterns/structure/views/tags',
  'js/patterns/structure/views/properties',
  'js/patterns/structure/views/workflow',
  'js/patterns/structure/views/delete',
  'js/patterns/structure/views/rename',
  'js/patterns/structure/views/selectionbutton',
  'js/patterns/structure/views/paging',
  'js/patterns/structure/views/textfilter',
  'js/patterns/structure/collections/result',
  'js/patterns/structure/collections/selected',
  'mockup-patterns-dropzone'
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, TableView,
            SelectionWellView, OrderView, TagsView, PropertiesView,
            WorkflowView, DeleteView, RenameView, SelectionButtonView,
            PagingView, TextFilterView, ResultCollection, SelectedCollection,
            DropZone) {
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
      'delete': DISABLE_EVENT,
      'rename': DISABLE_EVENT
    },
    buttonViewMapping: {
      'folder.order': OrderView,
      'secondary.tags': TagsView,
      'secondary.properties': PropertiesView,
      'secondary.workflow': WorkflowView,
      'primary.delete': DeleteView,
      'secondary.rename': RenameView
    },
    status: '',
    statusType: 'info',
    pasteOperation: null,
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
          }),
          sort_on: 'getObjPositionInParent'
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

      self.buttonViews = {};
      _.map(self.buttonViewMapping, function(ViewClass, key, list){
        var name = key.split('.');
        var group = name[0];
        var buttonName = name[1];
        self.buttonViews[key] = new ViewClass({
          button: self.buttons[group].get(buttonName),
          app: self
        });
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

      self.collection.on('sync', function(){
        // need to reload models inside selectedCollection so they get any
        // updated metadata
        var uids = [];
        self.selectedCollection.each(function(item){
          uids.push(item.attributes.UID);
        });
        self.queryHelper.search(
          'UID', 'plone.app.querystring.operation.list.contains',
          uids,
          function(data){
            _.each(data.results, function(attributes){
              var item = self.selectedCollection.getByUID(attributes.UID);
              item.attributes = attributes;
            });
          },
          false);
      });

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
        data.folder = self.options.queryHelper.getCurrentPath();
        data.pasteOperation = self.pasteOperation;

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
              self.setStatus(data.msg);
            }
            if(callback !== null){
              callback(data);
            }
            self.collection.pager();
          },
          error: function(data){
            if(data.status === 404){
              window.alert('operation url "' + url + '" is not valid');
            }
          }
        });
      }
    },
    cutCopyClickEvent: function(button){
      var self = this;
      var txt;
      if(button.id === 'cut'){
        txt = 'cut ';
        self.pasteOperation = 'cut';
      }else{
        txt = 'copied ';
        self.pasteOperation = 'copy';
      }
      txt += 'selection';
      self.setStatus(txt);
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
    setStatus: function(txt, type){
      this.status = txt;
      if(type === undefined){
        type = 'info';
      }
      this.statusType = type;
      this.$('td.status').addClass(type).html(txt);
    },
    render: function(){
      var self = this;

      self.$el.append(self.toolbar.render().el);
      self.$el.append(self.wellView.render().el);
      _.each(self.buttonViews, function(view){
        self.$el.append(view.render().el);
      });

      self.$el.append(self.tableView.render().el);
      self.$el.append(self.pagingView.render().el);

      /* dropzone support */
      var uploadUrl = self.options.uploadUrl;
      if(uploadUrl){
        self.dropzone = new DropZone(self.$el, {
          className: 'structure-dropzone',
          clickable: false,
          url: uploadUrl,
          autoCleanResults: true,
          success: function(e, data){
            self.tableView.render();
          }
        }).dropzone;
        self.dropzone.on('sending', function(){
          self.$el.addClass('dropping');
        });
        self.dropzone.on('complete', function(){
          self.$el.removeClass('dropping');
        });
      }
      return self;
    }
  });

  return AppView;
});
