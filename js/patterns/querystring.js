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
  'js/patterns/base',
  'jam/plone-select2/select2'
], function($, Base, undefined) {
  "use strict";

  var QueryString = Base.extend({
    name: 'querystring',
    defaults: {
      indexes: [],
      klassWrapper: 'querystring-wrapper',
      klassCriteriaWrapper: 'querystring-criteria-wrapper',
      klassCriteriaIndex: 'querystring-criteria-index',
      klassCriteriaOperator: 'querystring-critaria-operator',
      klassCriteriaValue: 'querystring-criteria-value',
      klassCriteriaRemove: 'querystring-criteria-remove',
      klassCriteriaResults: 'querystring-criteria-results',
      i18n: {
        remove: 'Remove line',
        results: ' items matching your search.'
      }
    },
    init: function() {
      var self = this;

      // hide input element
      self.$el.hide();

      // create wrapper for out criteria
      self.$wrapper = $('<div/>').addClass(self.options.klassWrapper);
      self.$el.after(self.$wrapper);

      // create initial criteria ui
      $.each(JSON.parse(self.$el.val()), function(i, item) {
        self.addCriteria(item);
      });
    },
    addCriteria: function(item) {
      var self = this,
          $wrapper = $('<div/>').addClass(self.options.klassCriteriaWrapper);

      self.addIndex($wrapper, item);
      self.addOperator($wrapper, item);
      self.addValue($wrapper, item);

      // Remove button
      $wrapper.append(
          $('<div/>')
            .addClass(self.options.klassCriteriaRemove)
            .html(self.options.i18n.remove)
          );

      // Results
      $wrapper.append(
          $('<div/>')
            .addClass(self.options.klassCriteriaRemove)
            .html(self.options.i18n.results)
          );

      self.$wrapper.append($wrapper);
    },
    addIndex: function($wrapper, item) {
      var self = this,
          groups = {},
          $el = $('<select/>')
                    .addClass(self.options.klassCriteriaIndex);

      $.each(self.options.indexes, function(index, options) {
        if (options.enabled) {
          if (!groups[options.group]) {
            groups[options.group] = $('<optgroup/>')
                .attr('label', options.group)
                .appendTo($el);
          }
          groups[options.group].append(
            $('<option/>')
                .attr('value', index)
                .attr('selected', index === item.i)
                .html(options.title));
        }
      });

      $wrapper.append($el);
      return $el;
    },
    addOperator: function($wrapper, item) {
      var self = this,
          $el = $('<select/>').addClass(self.options.klassCriteriaOperator);

      if (item.o && self.options.indexes[item.i]) {
        $.each(self.options.indexes[item.i].operators, function(operator, options) {
          $('<option/>')
              .attr('value', operator)
              .attr('selected', operator === item.o)
              .html(options.title)
              .appendTo($el);
        });
      }

      $wrapper.append($el);
    },
    addValue: function($wrapper, item) {
      var self = this, $el;
      if (item.v && self.options.indexes[item.i]) {
        $el = $('<select/>')
            .attr('multiple', true)
            .addClass(self.options.klassCriteriaValue);
        $.each(self.options.indexes[item.i].values, function(value, options) {
          $('<option/>')
              .attr('value', value)
              .attr('selected', item.v.indexOf(value) !== -1)
              .html(options.title)
              .appendTo($el);
        });
      }
      $wrapper.append($el);
    }
  });

  return QueryString;

});
