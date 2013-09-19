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
  'text!templates/popover.html'
], function($, _, Backbone, PopoverTemplate, ItemTemplate) {
  "use strict";

  var PopoverView = Backbone.View.extend({
    tagName: 'div',
    className: 'popoverview',
    template: _.template(PopoverTemplate),
    content: _.template(''),
    title: _.template(''),
    button: null,
    events: {
    },
    opened: false,
    initialize: function(){
      if(this.options.button){
        this.button = this.options.button;
      }
      if(this.options.content){
        this.content = this.options.content;
      }
      if(this.options.title){
        this.title = this.options.title;
      }
    },
    render: function () {
      this.$el.html(this.template(this.options));
      if(this.button){
        this.button.on('button:click', this.showItemsClicked, this);
      }
      this.$('.popover-title').append(this.title(this.options));
      this.$('.popover-content').append(this.content(this.options));
      return this;
    },
    getPosition: function(){
      var $el = this.$el;
      if(this.button){
        $el = this.button.$el;
      }
      return $.extend({}, {
        width: $el.width(),
        height: $el.height()
      }, $el.offset());
    },

    show: function(){
      var pos = this.getPosition();
      var $tip = this.$('.popover');
      var tp = {
        top: (pos.top + pos.height) + 11,
        left: (pos.left + pos.width / 2) - 44
      };
      this.applyPlacement(tp);
      this.opened = true;
      if(this.button){
        this.button.$el.addClass('active');
      }
    },
    applyPlacement: function(offset){
      var $tip = this.$('.popover');

      $tip.css({left: 0, top: 0, position: 'fixed'}).
        offset(offset).addClass(this.placement).addClass('in');
      $tip.show();
    },
    hide: function(){
      this.opened = false;
      this.$('.popover').hide();
      if(this.button){
        this.button.$el.removeClass('active');
      }
    },
    showItemsClicked: function(button, e){
      if(this.opened){
        this.hide();
      } else {
        this.show();
      }
    }
  });

  return PopoverView;
});

