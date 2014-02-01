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
  'js/ui/views/base',
  'js/patterns/structure/views/table',
  'js/patterns/structure/views/selectionwell',
  'js/patterns/structure/views/tags',
  'js/patterns/structure/views/properties',
  'js/patterns/structure/views/workflow',
  'js/patterns/structure/views/delete',
  'js/patterns/structure/views/rename',
  'js/patterns/structure/views/rearrange',
  'js/patterns/structure/views/selectionbutton',
  'js/patterns/structure/views/paging',
  'js/patterns/structure/views/addmenu',
  'js/patterns/structure/views/columns',
  'js/patterns/structure/views/textfilter',
  'js/patterns/structure/collections/result',
  'js/patterns/structure/collections/selected',
  'mockup-patterns-dropzone',
  'mockup-utils',
  'jquery.cookie'
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, BaseView,
            TableView, SelectionWellView, TagsView, PropertiesView,
            WorkflowView, DeleteView, RenameView, RearrangeView, SelectionButtonView,
            PagingView, AddMenu, ColumnsView, TextFilterView, ResultCollection,
            SelectedCollection, DropZone, utils) {
  "use strict";

  var DISABLE_EVENT = 'DISABLE';

  var AppView = BaseView.extend({
    tagName: 'div',
    /* we setup binding here and specifically for every button so there is a
     * way to override default click event behavior.
     * Otherwise, if we bound all buttons to the same event, there is no way
     * to override the event or stop bubbling it. */
    buttonClickEvents: {
      'cut': 'cutCopyClickEvent',
      'copy': 'cutCopyClickEvent',
      'paste': 'pasteEvent',
      'tags': DISABLE_EVENT, //disable
      'properties': DISABLE_EVENT,
      'workflow': DISABLE_EVENT,
      'delete': DISABLE_EVENT,
      'rename': DISABLE_EVENT,
      'rearrange': DISABLE_EVENT
    },
    buttonViewMapping: {
      'secondary.tags': TagsView,
      'secondary.properties': PropertiesView,
      'secondary.workflow': WorkflowView,
      'primary.delete': DeleteView,
      'secondary.rename': RenameView
    },
    status: '',
    statusType: 'warning',
    pasteOperation: null,
    sort_on: 'getObjPositionInParent',
    sort_order: 'ascending',
    additionalCriterias: [],
    pasteSelection: null,
    cookieSettingPrefix: '_fc_',
    initialize: function(options){
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.setAllCookieSettings();
      self.loading = new utils.ProgressIndicator({
        container: self.$el
      });
      self.loading.show();

      self.collection = new ResultCollection([], {
        url: self.options.collectionUrl,
        queryParser: function(){
          var term = null;
          if(self.toolbar){
            term = self.toolbar.get('filter').term;
          }
          var sort_on = self.sort_on;
          if(!sort_on){
            sort_on = 'getObjPositionInParent';
          }
          return JSON.stringify({
            criteria: self.queryHelper.getCriterias(term, {
              additionalCriterias: self.additionalCriterias
            }),
            sort_on: sort_on,
            sort_order: self.sort_order
          });
        },
        queryHelper: self.options.queryHelper
      });
      self.queryHelper = self.options.queryHelper;
      self.selectedCollection = new SelectedCollection();
      self.tableView = new TableView({app: self});
      self.pagingView = new PagingView({app: self});
      self.pasteAllowed = self.options.pasteAllowed;

      /* initialize buttons */
      self.setupButtons();

      self.wellView = new SelectionWellView({
        collection: self.selectedCollection,
        triggerView: self.toolbar.get('selected'),
        app: self
      });

      self.buttonViews = {};
      _.map(self.buttonViewMapping, function(ViewClass, key, list){
        var name = key.split('.');
        var group = name[0];
        var buttonName = name[1];
        self.buttonViews[key] = new ViewClass({
          triggerView: self.buttons[group].get(buttonName),
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
        if(self.selectedCollection.models.length > 0){
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
        }

        if(self.contextInfoUrl){
          $.ajax({
            url: self.getAjaxUrl(self.contextInfoUrl),
            dataType: 'json',
            success: function(data){
              self.trigger('context-info-loaded', data);
            },
            error: function(response){
              // XXX handle error?
              if(response.status === 404){
                console.log('context info url not found');
              }
            }
          });
        }
        self.loading.hide();
      });

      self.collection.on('pager', function(){
        self.loading.show();
      });

      /* detect key events */
      $(document).bind('keyup keydown', function(e){
        self.keyEvent = e;
      });

    },
    inQueryMode: function(){
      if(this.additionalCriterias.length > 0){
        return true;
      }
      if(this.sort_on && this.sort_on !== 'getObjPositionInParent'){
        return true;
      }
      if(this.sort_order !== 'ascending'){
        return true;
      }
      return false;
    },
    getSelectedUids: function(collection){
      var self = this;
      if(collection === undefined){
        collection = self.selectedCollection;
      }
      var uids = [];
      collection.each(function(item){
        uids.push(item.uid());
      });
      return uids;
    },
    getAjaxUrl: function(url){
      return url.replace('{path}', this.options.queryHelper.getCurrentPath());
    },
    defaultButtonClickEvent: function(button){
      var self = this;
      var data = null, callback = null;

      if(button.url){
        self.loading.show();
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
        if(data.selection === undefined){
          // if selection is overridden by another mechanism
          data.selection = JSON.stringify(self.getSelectedUids());
        }
        data._authenticator = $('input[name="_authenticator"]').val();
        if(data.folder === undefined){
          data.folder = self.options.queryHelper.getCurrentPath();
        }

        var url = self.getAjaxUrl(button.url);
        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          success: function(data){
            self.ajaxSuccessResponse.apply(self, [data, callback]);
            self.loading.hide();
          },
          error: function(response){
            self.ajaxErrorResponse.apply(self, [response, url]);
            self.loading.hide();
          }
        }, self);
      }
    },
    ajaxSuccessResponse: function(data, callback){
      var self = this;
      if(data.status === 'success'){
        self.collection.reset();
      }
      if(data.msg){
        // give status message somewhere...
        self.setStatus(data.msg);
      }
      if(callback !== null && callback !== undefined){
        callback(data);
      }
      self.collection.pager();
    },
    ajaxErrorResponse: function(response, url){
      var self = this;
      if(response.status === 404){
        window.alert('operation url "' + url + '" is not valid');
      }else{
        window.alert('there was an error performing action');
      }
    },
    pasteEvent: function(button, e, data){
      var self = this;
      if(data === undefined){
        data = {};
      }
      data = $.extend(true, {}, {
        selection: JSON.stringify(self.getSelectedUids(self.pasteSelection)),
        pasteOperation: self.pasteOperation
      }, data);
      self.defaultButtonClickEvent(button, data);
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

      // clone selected items
      self.pasteSelection = new Backbone.Collection();
      self.selectedCollection.each(function(item){
        self.pasteSelection.add(item);
      });
      txt += 'selection';
      self.setStatus(txt);
      self.pasteAllowed = true;
      self.buttons.primary.get('paste').enable();
    },
    setupButtons: function(){
      var self = this;
      self.buttons = {};
      var items = [];

      var columnsBtn = new ButtonView({
        id: 'columns',
        tooltip: 'Configure displayed columns',
        icon: 'align-justify'
      });

      self.columnsView = new ColumnsView({
        app: self,
        triggerView: columnsBtn
      });
      items.push(columnsBtn);

      items.push(new SelectionButtonView({
        title: 'Selected',
        id: 'selected',
        collection: this.selectedCollection
      }));

      if(self.options.contextInfoUrl){
        // only add menu if set
        items.push(new AddMenu({
          contextInfoUrl: self.options.contextInfoUrl,
          app: self
        }));
      }
      if(self.options.rearrange){
        var rearrangeButton = new ButtonView({
          id: 'rearrange',
          title: 'Rearrange',
          tooltip: 'Rearrange folder contents',
          url: self.options.rearrange.url
        });
        self.rearrangeView = new RearrangeView({
          triggerView: rearrangeButton,
          app: self
        });
        items.push(rearrangeButton);
      }

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
      if(self.options.uploadUrl){
        var uploadBtn = new ButtonView({
          title: 'Upload',
          context: 'success',
          icon: 'upload'
        });
        items.push(uploadBtn);
        uploadBtn.on('button:click', function(){
          // update because the url can change depending on the folder we're in.
          self.dropzone.options.url = self.getAjaxUrl(self.options.uploadUrl);
          self.dropzone.hiddenFileInput.click();
        });
      }
      items.push(new TextFilterView({
        id: 'filter',
        app: this
      }));
      this.toolbar = new Toolbar({
        items: items
      });
    },
    moveItem: function(id, delta, subset_ids){
      var self = this;
      $.ajax({
        url: this.getAjaxUrl(this.options.moveUrl),
        type: 'POST',
        data: {
          delta: delta,
          id: id,
          _authenticator: $('[name="_authenticator"]').val(),
          subset_ids: JSON.stringify(subset_ids)
        },
        dataType: 'json',
        success: function(data){
          if(data.msg){
            self.setStatus(data.msg);
          }else if(data.status !== "success"){
            // XXX handle error here with something?
            self.setStatus('error moving item');
          }
          self.collection.pager(); // reload it all
        },
        error: function(data){
          self.setStatus('error moving item');
        }
      });
    },
    setStatus: function(txt, type){
      this.status = txt;
      if(type === undefined){
        type = 'warning';
      }
      this.statusType = type;
      this.$('.status').addClass(type).html(txt);
    },
    render: function(){
      var self = this;

      self.$el.append(self.toolbar.render().el);
      self.$el.append(self.wellView.render().el);
      self.$el.append(self.columnsView.render().el);
      if(self.rearrangeView){
        self.$el.append(self.rearrangeView.render().el);
      }

      _.each(self.buttonViews, function(view){
        self.$el.append(view.render().el);
      });

      self.$el.append(self.tableView.render().el);
      self.$el.append(self.pagingView.render().el);

      /* dropzone support */
      if(self.options.uploadUrl){
        self.dropzone = new DropZone(self.$el, {
          className: 'structure-dropzone',
          //clickable: false,
          clickable: $('<div/>')[0],
          url: self.getAjaxUrl(self.options.uploadUrl),
          autoCleanResults: true,
          useTus: self.options.useTus,
          success: function(){
            self.collection.pager();
          }
        }).dropzone;
        self.dropzone.on('drop', function(){
          // because this can change depending on the folder we're in
          self.dropzone.options.url = self.getAjaxUrl(self.options.uploadUrl);
        });
        /* allow multiple to upload at once */
        $(self.dropzone.hiddenFileInput).attr('multiple', 'true');
      }

      // Backdrop class
      if (self.options.backdropSelector !== null) {
        $(self.options.backdropSelector).addClass('ui-backdrop-element');
      } else {
        self.$el.addClass('ui-backdrop-element');
      }

      return self;
    },
    getCookieSetting: function(name, _default){
      if(_default === undefined){
        _default = null;
      }
      var val;
      try{
        val = $.cookie(this.cookieSettingPrefix + name);
        val = $.parseJSON(val).value;
      }catch(e){
        /* error parsing json, load default here now */
        return _default;
      }
      if(val === undefined || val === null){
        return _default;
      }
      return val;
    },
    setCookieSetting: function(name, val){
      $.cookie(this.cookieSettingPrefix + name,
               JSON.stringify({'value': val})
      );
    },
    setAllCookieSettings: function(){
      this.activeColumns = this.getCookieSetting('activeColumns', this.activeColumns);
    }
  });

  return AppView;
});
