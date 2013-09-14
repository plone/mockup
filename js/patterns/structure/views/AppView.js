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
  'structure/collections/ResultCollection',
  'structure/collections/SelectedCollection',
  'mockup-patterns-dropzone'
], function($, _, Backbone, Toolbar, ButtonGroup, Button, TableView, WellView,
            PagingView, ResultCollection, SelectedCollection, DropZone) {
  "use strict";

  var AppView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      this.toolbar = new Toolbar({
        items: [
          new ButtonGroup({
            items: [
              new Button({title: 'Cut'}),
              new Button({title: 'Copy'}),
              new Button({title: 'Delete', context: 'danger'}),
            ]
          }),
          new ButtonGroup({
            items: [
              new Button({title: 'Workflow'}),
              new Button({title: 'Tags'}),
              new Button({title: 'Dates'})
            ]
          })
        ]
      });
      this.collection = new ResultCollection([], {
        url: this.options.collection_url
      });
      this.selected_collection = new SelectedCollection();
      this.collection.queryHelper = this.options.queryHelper;
      this.table_view = new TableView({app: this});
      this.well_view = new WellView({app: this});
      this.paging_view = new PagingView({app: this});

      this.$el.on('ui.button.click:cut', function(event, button) {
        // example of binding event to button
        var foo = 'one';
      });

      /* detect shift clicks */
      this.shift_clicked = false;
      var self = this;
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
