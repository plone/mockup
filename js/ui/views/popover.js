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
  'mockup-patterns-backdrop',
  'text!js/ui/templates/popover.tmpl'
], function($, _, Backbone, ContainerView, Backdrop, PopoverTemplate) {
  "use strict";

  var PopoverView = ContainerView.extend({
    tagName: 'div',
    className: 'popover',
    eventPrefix: 'popover',
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
    closeOnOutClick: true,
    appendInContainer: true,
    backdrop: undefined,
    useBackdrop: false,
    backdropOptions: {
      zIndex: "1009",
      opacity: "0.4",
      className: "backdrop backdrop-popover",
      classActiveName: "backdrop-active",
      closeOnEsc: false,
      closeOnClick: true
    },
    afterRender: function () {
      var self = this;
      this.bindTriggerEvents();

      this.$('.popover-title').append(this.title(this.options));
      this.$('.popover-content').append(this.content(this.options));

      if (this.useBackdrop === true && this.backdrop === undefined) {
        this.backdrop = new Backdrop($('body'), this.backdropOptions);
        this.backdrop.on('hidden', function(e) {
          if (self.opened === true) {
            self.hide();
          }
        });
        this.on('popover:hide', function() {
          this.backdrop.hide();
        }, this);
      }
    },
    bindTriggerEvents: function() {
      if (this.triggerView) {
        _.each(this.triggerEvents, function(func, event) {
          var method = this[func];
          if (!method) {
            $.error('Function not found.');
          }
          this.stopListening(this.triggerView, event);
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
      var $tip = this.$el, tp, placement, actualWidth, actualHeight;

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
      if(this.useBackdrop === true){
        this.backdrop.show();
      }
      this.opened = true;

      if(this.triggerView){
        this.triggerView.$el.addClass('active');
      }

      this.uiEventTrigger('show', this);
    },
    applyPlacement: function(offset, placement){
      var $el = this.$el,
        $tip = this.$el,
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
      this.$el.hide();
      if(this.triggerView){
        this.triggerView.$el.removeClass('active');
      }
      this.uiEventTrigger('hide', this);
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

