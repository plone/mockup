// tabs pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base'
], function($, Base, undefined) {
  "use strict";

  var Toggle = Base.extend({
    name: 'toggle',
    defaults: {
      attribute: 'class',
      event: 'click'
    },
    init: function() {
      var self = this;

      if (!self.options.target) {
        if (self.options.globaltarget) {
          self.$target = $(self.options.globaltarget);
        }
        else{
          self.$target = self.$el;
        }
      }
      else {
        self.$target = self.$el.closest(self.options.target);
        if (self.$target.size() === 0) {
          self.$target = self.closest(self.$el, self.options.target);
        }
      }

      if (!self.$target) {
        $.error('No target found for "' + self.options.target + '".');
      }
      
      self.on(self.options.event, function(e) {
        self.toggle();

        e.stopPropagation();

        return false;
      });
      $('html').on(self.options.event, function () {
        self.remove();
      });
    },
    closest: function($el, selector) {
      var self = this,
          $target = $(selector, $el);
      if ($target.size() === 0) {
        if ($el.size() === 0 || $.nodeName($el[0], 'body')) {
          return;
        }
        $target = self.closest($el.parent(), selector);
      }
      return $target;
    },
    isMarked: function() {
      var self = this;
      if (self.options.attribute === 'class') {
        return this.$target.hasClass(this.options.value);
      } else {
        return this.$target.attr(this.options.attribute) === this.options.value;
      }
    },
    toggle: function() {
      var self = this;
      if (self.isMarked()) {
        self.remove();
      } else {
        self.add();
      }
    },
    remove: function() {
      var self = this;
      self.trigger('remove-attr');
      if (self.options.attribute === 'class') {
        self.$target.removeClass(self.options.value);
      } else {
        self.$target.removeAttr(self.options.attribute);
      }
      self.trigger('attr-removed');
    },
    add: function() {
      var self = this;
      self.trigger('add-attr');
      if (self.options.attribute === 'class') {
        self.$target.addClass(self.options.value);
      } else {
        self.$target.attr(self.options.attribute, self.options.value);
      }
      self.trigger('added-attr');
    }
  });

  return Toggle;

});
