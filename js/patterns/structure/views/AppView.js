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
  'structure/views/SelectionButtonView',
  'structure/views/PagingView',
  'structure/views/TextFilterView',
  'structure/collections/ResultCollection',
  'structure/collections/SelectedCollection',
  'mockup-patterns-dropzone'
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, TableView, SelectionWellView, SelectionButtonView,
            PagingView, TextFilterView, ResultCollection, SelectedCollection, DropZone) {
  "use strict";

  var AppView = Backbone.View.extend({
    tagName: 'div',
    buttonEvents: {
      'primary cut': 'cutClickEvent',
      '*': 'buttonClickEvent', // make sure this is bound last so overrides can
                               // prevent bubbling events if necessary
    },
    initialize: function(){
      var self = this;
      this.collection = new ResultCollection([], {
        url: this.options.collection_url
      });
      self.queryHelper = self.options.queryHelper;
      this.selected_collection = new SelectedCollection();
      this.collection.queryHelper = this.queryHelper;

      this.table_view = new TableView({app: this});
      this.well_view = new SelectionWellView({app: this});
      this.paging_view = new PagingView({app: this});

      /* initialize buttons */
<<<<<<< HEAD
      self.setupButtons();
=======
      var items = [];

      items.push(new SelectionButtonView({
        title: 'Selected',
        collection: this.selected_collection
      }));

      for (var key in this.options.buttonGroups) {
        var group = this.options.buttonGroups[key];
        group.id = key;
        var buttons = [];
        _.each(group, function(button){
          buttons.push(new ButtonView(button));
        });
        items.push(new ButtonGroup(_.extend(group, {
          items: buttons,
        })));
      }
      items.push(new TextFilterView({id: 'filter'}));
      this.toolbar = new Toolbar({
        items: items
      });

      this.toolbar.on('button:click', function(button) {
        if(button.url !== undefined){
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
>>>>>>> new selected widget, well, styling, templates

      this.toolbar.on('filter:change', function(value, view) {
        // do something when the filter happens
        var foo = 'two';
      });

<<<<<<< HEAD
      this.buttonGroups.primary.disable();
      this.buttonGroups.secondary.disable();

      this.selected_collection.on('add remove', function(modal, collection) {
        if (collection.length) {
          this.buttonGroups.primary.enable();
          this.buttonGroups.secondary.enable();
        } else {
          this.buttonGroups.primary.disable();
          this.buttonGroups.secondary.disable();
=======
      this.toolbar.on('button.selected:click', function(view) {
        view.$el.toggleClass('active');
        this.well_view.$el.toggleClass('active');
      }, this);

      this.toolbar.get('selected').disable();
      this.toolbar.get('primary').disable();
      this.toolbar.get('secondary').disable();

      this.selected_collection.on('add remove', function(modal, collection) {
        if (collection.length) {
          this.toolbar.get('selected').enable();
          this.toolbar.get('primary').enable();
          this.toolbar.get('secondary').enable();
        } else {
          this.toolbar.get('selected').disable();
          this.toolbar.get('primary').disable();
          this.toolbar.get('secondary').disable();
>>>>>>> new selected widget, well, styling, templates
        }
      }, this);

      /* detect shift clicks */
      this.shift_clicked = false;
      $(document).bind('keyup keydown', function(e){
        self.shift_clicked = e.shiftKey;
      });
    },
    buttonClickEvent: function(button){
      var self = this;
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
    },
    cutClickEvent: function(button){
      var self = this;
    },
    setupButtons: function(){
      var self = this;
      self.buttonGroups = {};
      var items = [];
      _.each(_.pairs(this.options.buttonGroups), function(group){
        var buttons = [];
        _.each(group[1], function(button){
          buttons.push(new Button(button));
        });
        self.buttonGroups[group[0]] = new ButtonGroup({
          items: buttons,
          id: group[0],
          app: self
        });
        items.push(self.buttonGroups[group[0]]);
      });
      items.push(new TextFilterView({id: 'filter'}));
      this.toolbar = new Toolbar({
        items: items
      });

      this.cut = this.buttonGroups.primary.get('cut');

      _.each(_.pairs(this.buttonEvents), function(binding){
        if(binding[0] === '*'){
          _.each(self.buttonGroups, function(group){
            _.each(group.items, function(button){
              button.on('button:click', function(button){
                self[binding[1]].call(self, button);
              });
            });
          });
        }else{
          var parts = binding[0].split(' ');
          var group = parts[0];
          var btnName = parts[1];
          var button = self.buttonGroups[group].get(btnName);
          button.on('button:click', function(button){
            self[binding[1]].call(self, button);
          });
        }
      });
    },
    render: function(){

      this.$el.append(this.toolbar.render().el);
      this.$el.append(this.well_view.render().el);
      this.$el.append(this.table_view.render().el);
      this.$el.append(this.paging_view.render().el);

      /* dropzone support */
      var self = this;
      var uploadUrl = self.options.uploadUrl;
      if(uploadUrl){
        self.dropzone = new DropZone(self.$el, {
          klass: 'structure-dropzone',
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
