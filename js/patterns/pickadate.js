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


define([
  'jquery',
  'mockup-patterns-base',
  'picker',
  'picker.date',
  'picker.time'
], function($, Base) {
  "use strict";

  var PickADate = Base.extend({
    name: 'pickadate',
    defaults: {
      separator: ' ',
      date: {
        value: '',
        formatSubmit: 'yyyy-mm-dd',
        selectYears: true,
        selectMonths: true
      },
      time: {
        value: '',
        formatSubmit: 'HH:i'
      },
      klassWrapper: 'pat-pickadate-wrapper',
      klassSeparator: 'pat-pickadate-separator',
      klassDate: 'pat-pickadate-date',
      klassDateWrapper: 'pat-pickadate-date-wrapper',
      klassTime: 'pat-pickadate-time',
      klassTimeWrapper: 'pat-pickadate-time-wrapper',
      klassClear: 'pat-pickadate-clear',
      placeholderDate: 'enter date...',
      placeholderTime: 'enter time...'
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
      var self = this;

      self.$el.hide();

      self.$wrapper = $('<div/>')
            .addClass(self.options.klassWrapper)
            .insertAfter(self.$el);

      self.options.date = self.ensureBool(self.options.date);
      self.options.time = self.ensureBool(self.options.time);

      var date_name = self.$el.attr('name') + '_date';
      var time_name = self.$el.attr('name') + '_time';

      if (self.options.date !== false) {
        self.$date = $('<input type="text"/>')
              .attr('data-value', self.options.date.value)
              .addClass(self.options.klassDate)
              .appendTo($('<div/>')
                  .addClass(self.options.klassDateWrapper)
                  .appendTo(self.$wrapper))
              .pickadate($.extend(true, self.options.date, {
                hiddenSuffix: date_name,
                onStart: function(){
                  this.$node.attr('placeholder', self.options.placeholderDate);
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
              .attr('data-value', self.options.time.value)
              .addClass(self.options.klassTime)
              .appendTo($('<div/>')
                  .addClass(self.options.klassTimeWrapper)
                  .appendTo(self.$wrapper))
              .pickatime($.extend(true, self.options.time, {
                hiddenSuffix: time_name,
                onStart: function(){
                  this.$node.attr('placeholder', self.options.placeholderTime);
                }
              }));
        // work around pickadate bug loading 00:xx as value
        if (self.options.time.value.substring(0,2) == '00') {
          var timeval = '12' + self.options.time.value.substring(2) + ' a.m.';
          self.$time.pickatime('picker').set('select', timeval, {format: 'hh:i a'});
        }
      }

      self.$clear = $('<div/>')
            .addClass(self.options.klassClear)
            .appendTo(self.$wrapper);

    }
  });

  return PickADate;

});
