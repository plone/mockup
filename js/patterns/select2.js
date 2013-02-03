// plone integration for textext.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.widgets/textext.js
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
  'jam/Patterns/src/core/parser',
  'jam/select2/select2'
], function($, Base, Parser) {
  "use strict";

  var parser = new Parser("select2"),
      options = [
        "width",
        "minimumInputLength",
        "maximumInputLength",
        "minimumResultsForSearch",
        "maximumSelectionSize",
        "placeholder",
        "separator",
        "allowClear",
        "multiple",
        "closeOnSelect",
        "openOnEnter",
        "data",
        "tags",
        "ajaxUrl",

        "initSelection"
      ];
  $.each(options, function(i, option) {
    parser.add_argument(option);
  });

  var Select2 = Base.extend({
    name: "select2",
    parser: parser,
    init: function() {
      var self = this,
          select2options = {};
      $.each(options, function(i, option) {
        if (self.options[option]) {
          if (option === 'ajaxUrl') {
            select2options.ajax = {
              quietMillis: 300,
              data: function (term, page) {
                return {
                  query: term,
                  page_limit: 10,
                  page: page
                };
              },
              results: function (data, page) {
                var more = (page * 10) < data.total; // whether or not there are more results available
                return { results: data.results, more: more };
              }
            };
            select2options.ajax.url = self.options[option];
          } else if (option === 'initSelection') {
            select2options.initSelection = function ($el, callback) {
              var data = [], value = $el.val(),
                  initSelection = JSON.parse(self.options.initSelection);
              $(value.split(",")).each(function () {
                var text = this;
                if (initSelection[this]) {
                  text = initSelection[this];
                }
                data.push({id: this, text: text});
              });
              callback(data);
            };
          } else if (option === 'tags' || option === 'data') {
            if (self.options[option].substr(0, 1) === '[') {
              select2options.tags = JSON.parse(self.options[option]);
            } else {
              select2options.tags = self.options[option].split(',');
            }
          } else {
            select2options[option] = self.options[option];
          }
        }
      });
      self.$el.select2(select2options);
    }
  });

  return Select2;

});
