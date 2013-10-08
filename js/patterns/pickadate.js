// plone integration for pickadate.
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
      classWrapperName: 'pattern-pickadate-wrapper',
      classSeparatorName: 'pattern-pickadate-separator',
      classDateName: 'pattern-pickadate-date',
      classDateWrapperName: 'pattern-pickadate-date-wrapper',
      classTimeName: 'pattern-pickadate-time',
      classTimeWrapperName: 'pattern-pickadate-time-wrapper',
      classClearName: 'pattern-pickadate-clear',
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
            .addClass(self.options.classWrapperName)
            .insertAfter(self.$el);

      self.options.date = self.ensureBool(self.options.date);
      self.options.time = self.ensureBool(self.options.time);

      var date_name = self.$el.attr('name') + '_date';
      var time_name = self.$el.attr('name') + '_time';

      if (self.options.date !== false) {
        self.$date = $('<input type="text" placeholder="' + self.options.placeholderDate + '"/>')
              .attr('data-value', self.options.date.value)
              .addClass(self.options.classDateName)
              .appendTo($('<div/>')
                  .addClass(self.options.classDateWrapperName)
                  .appendTo(self.$wrapper))
              .pickadate($.extend(true, self.options.date, {
                hiddenSuffix: date_name
              }));
      }

      if (self.options.date !== false && self.options.time !== false) {
        self.$separator = $('<span/>')
              .addClass(self.options.classSeparatorName)
              .html(self.options.separator === ' ' ? '&nbsp;'
                                                   : self.options.separator)
              .appendTo(self.$wrapper);
      }

      if (self.options.time !== false) {
        self.$time = $('<input type="text" placeholder="' + self.options.placeholderTime + '"/>')
              .attr('data-value', self.options.time.value)
              .addClass(self.options.classTimeName)
              .appendTo($('<div/>')
                  .addClass(self.options.classTimeWrapperName)
                  .appendTo(self.$wrapper))
              .pickatime($.extend(true, self.options.time, {
                hiddenSuffix: time_name
              }));
        // XXX: bug in pickatime
        // work around pickadate bug loading 00:xx as value
        if (typeof(self.options.time.value) === 'string' &&
           self.options.time.value.substring(0,2) === '00') {
          var timeval = '12' + self.options.time.value.substring(2) + ' a.m.';
          self.$time.pickatime('picker').set('select', timeval, {format: 'hh:i a'});
        }
      }

      self.$clear = $('<div/>')
            .addClass(self.options.classClearName)
            .appendTo(self.$wrapper);

    }
  });

  return PickADate;

});
