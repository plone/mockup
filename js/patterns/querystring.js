// querystring pattern.
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
  'mockup-patterns-base',
  'mockup-patterns-select2',
  'mockup-patterns-pickadate'
], function($, Base, Select2, PickADate, undefined) {
  "use strict";

  var Criteria = function() { this.init.apply(this, arguments); };
  Criteria.prototype = {
    defaults: {
      indexWidth: '20em',
      placeholder: 'Select criteria',
      remove: 'Remove line',
      results: ' items matching your search.',
      days: 'days',
      klassWrapper: 'querystring-criteria-wrapper',
      klassIndex: 'querystring-criteria-index',
      klassOperator: 'querystring-criteria-operator',
      klassValue: 'querystring-criteria-value',
      klassRemove: 'querystring-criteria-remove',
      klassResults: 'querystring-criteria-results',
      klassClear: 'querystring-criteria-clear'
    },
    init: function($el, options, indexes, index, operator, value) {
      var self = this;

      self.options = $.extend(true, {}, self.defaults, options);
      self.indexes = indexes;
      self.indexGroups = {};

      // create wrapper criteria and append it to DOM
      self.$wrapper = $('<div/>')
              .addClass(self.options.klassWrapper)
              .addClass("row")
              .appendTo($el);

      // Remove button
      self.$remove = $('<div>'+self.options.remove+'</div>')
              .addClass(self.options.klassRemove)
              .addClass('span1')
              .appendTo(self.$wrapper)
              .on('click', function(e) {
                self.trigger('remove');
                self.remove();
              });

      // Index selection
      self.$index = $('<select><option></option></select>').attr('placeholder', self.options.placeholder);

      // list of indexes
      $.each(self.indexes, function(value, options) {
        if (options.enabled) {
          if (!self.indexGroups[options.group]) {
            self.indexGroups[options.group] = $('<optgroup/>')
                .attr('label', options.group)
                .appendTo(self.$index);
          }
          self.indexGroups[options.group].append(
            $('<option/>')
                .attr('value', value)
                .html(options.title));
        }
      });

      // attach index select to DOM
      self.$wrapper.append(
          $('<div/>')
              .addClass(self.options.klassIndex)
              .addClass("span4")
              .append(self.$index));

      // add blink (select2)
      self.$index
        .patternSelect2({
            width: self.options.indexWidth,
            placeholder: self.options.placeholder
        })
        .on("change", function(e) {
          self.removeValue();
          self.createOperator(e.val);
          self.createClear();
          self.trigger('index-changed');
        });

      if (index !== undefined) {
        self.$index.select2('val', index);
        self.createOperator(index, operator, value);
        self.createClear();
      }
    },
    createOperator: function(index, operator, value) {
      var self = this;

      self.removeOperator();
      self.$operator = $('<select/>');

      if (self.indexes[index]) {
        $.each(self.indexes[index].operators, function(value, options) {
          $('<option/>')
              .attr('value', value)
              .html(options.title)
              .appendTo(self.$operator);
        });
      }

      // attach operators select to DOM
      self.$wrapper.append(
          $('<div/>')
              .addClass(self.options.klassOperator)
              .addClass("span2")
              .append(self.$operator));

      // add blink (select2)
      self.$operator
        .patternSelect2({ width: '10em' })
        .on("change", function(e) {
          self.createValue(index);
          self.createClear();
          self.trigger('operator-changed');
        });

      if (operator === undefined) {
        operator = self.$operator.select2('val');
      }

      self.$operator.select2('val', operator);
      self.createValue(index, value);
    },
    createValue: function(index, value) {
      var self = this,
          widget = self.indexes[index].operators[self.$operator.val()].widget,
          $wrapper = $('<div/>')
            .addClass(self.options.klassValue)
            .addClass("span6")
            .appendTo(self.$wrapper);

      self.removeValue();

      if (widget === 'StringWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper);

      } else if (widget === 'DateWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper)
                .patternPickadate({
                  time: false,
                  date: { format: "dd/mm/yyyy" }
                });

      } else if (widget === 'DateRangeWidget') {
        //self.$value = $('<input type="text"/>').appendTo($wrapper);
        var startdt = $('<input type="text"/>')
                        .addClass(self.options.klassValue + '-' + widget)
                        .addClass(self.options.klassValue + '-' + widget + '-start')
                        .appendTo($wrapper)
                        .patternPickadate({
                          time: false,
                          date: { format: "dd/mm/yyyy" }
                        });
        $wrapper.append(' to ');
        var enddt = $('<input type="text"/>')
                        .addClass(self.options.klassValue + '-' + widget)
                        .addClass(self.options.klassValue + '-' + widget + '-end')
                        .appendTo($wrapper)
                        .patternPickadate({
                          time: false,
                          date: { format: "dd/mm/yyyy" }
                        });
        self.$value = [startdt, enddt];

      } else if (widget === 'RelativeDateWidget') {
        self.$value = $('<input type="text"/>')
                .after($('<span/>').html(self.options.days))
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper);

      } else if (widget === 'ReferenceWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper);

      } else if (widget === 'RelativePathWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper);

      } else if (widget === 'MultipleSelectionWidget') {
        self.$value = $('<select/>').attr('multiple', true)
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper);
        if (self.indexes[index]) {
          $.each(self.indexes[index].values, function(value, options) {
            $('<option/>')
                .attr('value', value)
                .html(options.title)
                .appendTo(self.$value);
          });
        }
        self.$value.patternSelect2({ width: '250px' });
      }

      if (value !== undefined) {
        self.$value.select2('val', value);
      }

    },
    createClear: function() {
      var self = this;
      self.removeClear();
      self.$clear = $('<div/>')
        .addClass(self.options.klassClear)
        .appendTo(self.$wrapper);
    },
    remove: function() {
      var self = this;
      self.$remove.remove();
      self.$index.parent().remove();
      self.removeOperator();
      self.removeValue();
      self.removeClear();
      self.$wrapper.remove();
    },
    removeClear: function() {
      var self = this;
      if (self.$clear) {
        self.$clear.remove();
      }
    },
    removeOperator: function() {
      var self = this;
      if (self.$operator) {
        self.$operator.parent().remove();
      }
    },
    removeValue: function() {
      var self = this;
      if (self.$value) {
        if($.isArray(self.$value)) { // date ranges have 2 values
          self.$value[0].parent().remove();
        }
        else {
          self.$value.parent().remove();
        }
      }
    },
    trigger: function(name) {
      this.$wrapper.trigger(name + '-criteria.querystring.patterns', [ this ]);
    },
    on: function(name, callback) {
      this.$wrapper.on(name + '-criteria.querystring.patterns', callback);
    }
  };

  var QueryString = Base.extend({
    name: 'querystring',
    defaults: {
      indexes: [],
      klassWrapper: 'querystring-wrapper',
      criteria: {},
    },
    init: function() {
      var self = this;

      // hide input element
      self.$el.hide();

      // create wrapper for out criteria
      self.$wrapper = $('<div/>')
        .addClass(self.options.klassWrapper);
      self.$el.after(self.$wrapper);

      self.criterias = [];

      // create populated criterias
      if (self.$el.val()) {
        $.each(JSON.parse(self.$el.val()), function(i, item) {
          self.createCriteria(item.i, item.o, item.v);
        });
      }

      // add empty criteria which enables users to create new cr
      self.createCriteria();
    },
    createCriteria: function(index, operator, value) {
      var self = this,
          criteria = new Criteria(self.$wrapper, self.options.criteria,
            self.options.indexes, index, operator, value);

      criteria.on('remove', function(e) {
        if (self.criterias[self.criterias.length-1] === criteria) {
          self.createCriteria();
        }
      });

      criteria.on('index-changed', function(e) {
        if (self.criterias[self.criterias.length-1] === criteria) {
          self.createCriteria();
        }
      });
      self.criterias.push(criteria);
    }
  });

  return QueryString;

});
