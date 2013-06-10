// plone integration for pickadate.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js pickadate.js
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
  'js/patterns/base',
  'jam/pickadate/_raw/lib/picker.js',
  'jam/pickadate/_raw/lib/picker.date.js',
  'jam/pickadate/_raw/lib/picker.time.js'
], function($, Base) {
  "use strict";

  var PickADate = Base.extend({
    name: 'pickadate',
    defaults: {
      separator: ' ',
      date: {
        formatSubmit: 'dd-mm-yyyy'
      },
      time: {
        formatSubmit: 'HH:i'
      },
      klassWrapper: 'pat-pickadate-wrapper',
      klassSeparator: 'pat-pickadate-separator',
      klassDate: 'pat-pickadate-date',
      klassDateWrapper: 'pat-pickadate-date-wrapper',
      klassTime: 'pat-pickadate-time',
      klassTimeWrapper: 'pat-pickadate-time-wrapper',
      klassClear: 'pat-pickadate-clear'
    },
    ensureBool: function(value) {
      if (typeof(value) === 'string') {
        if (value === 'true') {
          return true;
        } else if (value === 'false') {
          return false;
        }
      }
      return value;
    },
    init: function() {
      var self = this,
          onSetDate = self.options.date.onSet,
          onSetTime = self.options.time.onSet;

      self.$el.hide();

      self.$wrapper = $('<div/>')
            .addClass(self.options.klassWrapper)
            .insertAfter(self.$el);

      self.options.date = self.ensureBool(self.options.date);
      self.options.time = self.ensureBool(self.options.time);

      if (self.options.date !== false) {
        self.$date = $('<input type="text"/>')
              .addClass(self.options.klassDate)
              .appendTo($('<div/>')
                  .addClass(self.options.klassDateWrapper)
                  .appendTo(self.$wrapper))
              .pickadate($.extend(true, self.options.date, {
                onSet: function() {
                  self.setDateTime();
                  if (onSetDate) {
                    onSetDate.apply(this, arguments);
                  }
                }
              }));

      }

      if (self.options.date !== false && self.options.time !== false) {
        self.$separator = $('<span/>')
              .addClass(self.options.klassSeparator)
              .html(self.options.separator === ' ' ? '&nbsp;'
                                                   : self.options.separator)
              .appendTo(self.$wrapper);
      }

      if (self.options.time !== false) {
        self.$time = $('<input type="text"/>')
              .addClass(self.options.klassTime)
              .appendTo($('<div/>')
                  .addClass(self.options.klassTimeWrapper)
                  .appendTo(self.$wrapper))
              .pickatime($.extend(true, self.options.time, {
                onSet: function() {
                  self.setDateTime();
                  if (onSetTime) {
                    onSetTime.apply(this, arguments);
                  }
                }
              }));
      }

      self.$clear = $('<div/>')
            .addClass(self.options.klassClear)
            .appendTo(self.$wrapper);

    },
    setDateTime: function() {
      var self = this,
          value = '';

      if (self.$date) {
        value += self.$date.val();
      }
      if (self.$date && self.$time) {
        value += self.options.separator;
      }
      if (self.$time) {
        value += self.$time.val();
      }

      self.$el.val(value);
    }
  });

  return PickADate;

});
