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
  'js/ui/views/container',
  'text!js/ui/templates/popover.tmpl'
], function($, _, Backbone, ContainerView, PopoverTemplate) {
  "use strict";

  var PopoverView = ContainerView.extend({
    tagName: 'div',
    className: 'popoverview',
    template: PopoverTemplate,
    content: null,
    title: null,
    triggerView: null,
    triggerEvents: {
      'button:click': 'toggle'
    },
    placement: "bottom",
    events: {
    },
    opened: false,
    appendInContainer: true,
    afterRender: function () {
      var self = this;
      this.bindTriggerEvents();

      this.$('.popover-title').append(this.title(this.options));
      this.$('.popover-content').append(this.content(this.options));
    },
    bindTriggerEvents: function() {
      if (this.triggerView) {
        _.each(this.triggerEvents, function(func, event) {
          var method = this[func];
          if (!method) {
            $.error('Function not found.');
          }
          this.listenTo(this.triggerView, event, method);
        }, this);
      }
    },
    getPosition: function(){
      var $el = this.triggerView.$el;
      return $.extend({}, {
        width: $el[0].offsetWidth,
        height: $el[0].offsetHeight
      }, $el.offset());
    },
    show: function(){
      var pos = this.getPosition();
      var $tip = this.$('.popover');
      var $el = this.$el, tp, placement, actualWidth, actualHeight;

      placement = this.placement;

      $tip.css({ top: 0, left: 0, display: 'block' });

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      switch (placement) {
        case 'bottom':
          tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
          break;
        case 'top':
          tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
          break;
        case 'left':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
          break;
        case 'right':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
          break;
      }
      
      this.applyPlacement(tp, placement);
      this.opened = true;
    },
    applyPlacement: function(offset, placement){
      var $el = this.$el,
        $tip = this.$('.popover'),
        width = $tip[0].offsetWidth,
        height = $tip[0].offsetHeight,
        actualWidth,
        actualHeight,
        delta,
        replace;

      $el.offset(offset)
        .addClass(placement)
        .addClass('in').show();

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      if (placement === 'top' && actualHeight !== height) {
        offset.top = offset.top + height - actualHeight;
        replace = true;
      }

      if (placement === 'bottom' || placement === 'top') {
        delta = 0;

        if (offset.left < 0){
          delta = offset.left * -2;
          offset.left = 0;
          $el.offset(offset);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
        }

        this.positionArrow(delta - width + actualWidth, actualWidth, 'left');

      } else {
        this.positionArrow(actualHeight - height, actualHeight, 'top');
      }

      if (replace) {
        $el.offset(offset);
      }
    },
    positionArrow: function(delta, dimension, position) {
      var $arrow = this.$('.arrow');
      $arrow.css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
    },
    hide: function(){
      this.opened = false;
      this.$('.popover').hide();
      if(this.button){
        this.button.$el.removeClass('active');
      }
    },
    toggle: function(button, e){
      if(this.opened){
        this.hide();
      } else {
        this.show();
      }
    }
  });

  return PopoverView;
});

