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
    className: 'popover',
    template: _.template(PopoverTemplate),
    content: _.template(''),
    title: _.template(''),
    button: null,
    placement: 'bottom',
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
      var el = $el[0];
      return $.extend({}, (typeof el.getBoundingClientRect === 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth,
        height: el.offsetHeight
      }, $el.offset());
    },

    show: function(){
      var pos = this.getPosition();
      var $tip = this.$('.popover');
      var tp;

      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      switch (this.placement) {
        case 'bottom':
          tp = {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
          };
          break;
        case 'top':
          tp = {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
          };
          break;
        case 'left':
          tp = {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
          };
          break;
        case 'right':
          tp = {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
          };
          break;
      }
      this.applyPlacement(tp);
    },
    replaceArrow: function(delta, dimension, position){
      this.$('.arrow').css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
    },
    applyPlacement: function(offset){
      var $tip = this.$('.popover'),
          width = $tip[0].offsetWidth,
          height = $tip[0].offsetHeight,
          actualWidth,
          actualHeight,
          delta,
          replace;

      $tip.css({left: 0, top: 0}); // reset
      $tip.offset(offset).addClass(this.placement).addClass('in');

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      if (this.placement === 'top' && actualHeight !== height) {
        offset.top = offset.top + height - actualHeight;
        replace = true;
      }

      if (this.placement === 'bottom' || this.placement === 'top') {
        delta = 0;

        if (offset.left < 0){
          delta = offset.left * -2;
          offset.left = 0;
          $tip.offset(offset);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top');
      }

      if(replace){
        $tip.offset(offset);
      }
      $tip.css({position: 'fixed'});
      $tip.show();
    },
    hide: function(){
      this.$('.popover').hide();
    },
    showItemsClicked: function(e){
      if(this.button){
        this.button.$el.toggleClass('active');
      }
      if(this.opened){
        this.hide();
        this.opened = false;
      } else {
        this.show();
        this.opened = true;
      }
    }
  });

  return PopoverView;
});

