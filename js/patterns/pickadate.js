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
        selectYears: true,
        selectMonths: true
      },
      time: {
      },
      classWrapperName: 'pattern-pickadate-wrapper',
      classSeparatorName: 'pattern-pickadate-separator',
      classDateName: 'pattern-pickadate-date',
      classDateWrapperName: 'pattern-pickadate-date-wrapper',
      classTimeName: 'pattern-pickadate-time',
      classTimeWrapperName: 'pattern-pickadate-time-wrapper',
      classClearName: 'pattern-pickadate-clear',
      placeholderDate: 'Enter date...',
      placeholderTime: 'Enter time...'
    },
    isFalse: function(value) {
      if (typeof(value) === 'string' && value === 'false') {
        return false;
      }
      return value;
    },
    init: function() {
      var self = this,
          value = self.$el.val().split(' '),
          dateValue = value[0] || '',
          timeValue = value[1] || '';

      self.options.date = self.isFalse(self.options.date);
      self.options.time = self.isFalse(self.options.time);

      if (self.options.date === false) {
        timeValue = value[0];
      }

      self.$el.hide();

      self.$wrapper = $('<div/>')
            .addClass(self.options.classWrapperName)
            .insertAfter(self.$el);

      if (self.options.date !== false) {
        self.options.date.formatSubmit = 'yyyy-mm-dd';
        self.$date = $('<input type="text"/>')
              .attr('placeholder', self.options.placeholderDate)
              .attr('data-value', dateValue)
              .addClass(self.options.classDateName)
              .appendTo($('<div/>')
                  .addClass(self.options.classDateWrapperName)
                  .appendTo(self.$wrapper))
              .pickadate($.extend(true, {}, self.options.date, {
                onSet: function(e) {
                  if (e.select !== undefined) {
                    self.$date.attr('data-value', e.select);
                    if (self.options.time === false ||
                        self.$time.attr('data-value') !== '') {
                      self.updateValue.call(self);
                    }
                  }
                  if (e.hasOwnProperty('clear')) {
                    self.$el.removeAttr('value');
                    self.$date.attr('data-value', '');
                  }
                }
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
        self.options.time.formatSubmit = 'HH:i';
        self.$time = $('<input type="text"/>')
              .attr('placeholder', self.options.placeholderTime)
              .attr('data-value', timeValue)
              .addClass(self.options.classTimeName)
              .appendTo($('<div/>')
                  .addClass(self.options.classTimeWrapperName)
                  .appendTo(self.$wrapper))
              .pickatime($.extend(true, {}, self.options.time, {
                onSet: function(e) {
                  if (e.select !== undefined) {
                    self.$time.attr('data-value', e.select);
                    if (self.options.date === false ||
                        self.$date.attr('data-value') !== '') {
                      self.updateValue.call(self);
                    }
                  }
                  if (e.hasOwnProperty('clear')) {
                    self.$el.removeAttr('value');
                    self.$time.attr('data-value', '');
                  }
                }
              }));

        // XXX: bug in pickatime
        // work around pickadate bug loading 00:xx as value
        if (typeof(timeValue) === 'string' && timeValue.substring(0,2) === '00') {
          self.$time.pickatime('picker').set('select', timeValue.split(':'));
          self.$time.attr('data-value', timeValue);
        }
      }

      self.$clear = $('<div/>')
            .addClass(self.options.classClearName)
            .appendTo(self.$wrapper);

    },
    updateValue: function() {
      var self = this,
          value = '';

      if (self.options.date !== false) {
        var date = self.$date.data('pickadate').component,
            dateValue = self.$date.data('pickadate').get('select'),
            formatDate = date.formats.toString;
        value += formatDate.apply(date, ['yyyy-mm-dd', dateValue]);
      }

      if (self.options.date !== false && self.options.time !== false) {
        value += ' ';
      }

      if (self.options.time !== false) {
        var time = self.$time.data('pickatime').component,
            timeValue = self.$time.data('pickatime').get('select'),
            formatTime = time.formats.toString;
        value += formatTime.apply(time, ['HH:i', timeValue]);
      }

      self.$el.attr('value', value);

      self.trigger('updated');
    }
  });

  return PickADate;

});
