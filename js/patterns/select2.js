// plone integration for select2
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
  'select2',
  'jquery.event.drag',
  'jquery.event.drop'
], function($, Base) {
  "use strict";

  function parseBool(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 0 ? false : true;
    if (typeof value !== "string") return undefined;

    return value.toLowerCase() === 'true' ? true : false;
  }

  var Select2 = Base.extend({
    name: "select2",
    defaults: {
      separator: ","
    },
    initializeValues: function(){
      var self = this;
      // Init Selection ---------------------------------------------
      if (self.options.initialValues) {
        self.options.id = function(term) {
          return term.id;
        };
        self.options.initSelection = function ($el, callback) {
          var data = [],
              value = $el.val(),
              seldefaults = self.options.initialValues;

          // Create the initSelection value that contains the default selection,
          // but in a javascript object
          if (typeof(self.options.initialValues) === 'string' && self.options.initialValues !== '') {
            // if default selection value starts with a '{', then treat the value as
            // a JSON object that needs to be parsed
            if(self.options.initialValues[0] === '{') {
              seldefaults = JSON.parse(self.options.initialValues);
            }
            // otherwise, treat the value as a list, separated by the defaults.separator value of
            // strings in the format "id:text", and convert it to an object
            else {
              seldefaults = {};
              $(self.options.initialValues.split(self.options.separator)).each(function() {
                var selection = this.split(':');
                var id = $.trim(selection[0]);
                var text = $.trim(selection[1]);
                seldefaults[id] = text;
              });
            }
          }

          $(value.split(self.options.separator)).each(function() {
            var text = this;
            if (seldefaults[this]) {
              text = seldefaults[this];
            }
            data.push({id: this, text: text});
          });
          callback(data);
        };
      }
    },
    initializeTags: function(){
      var self = this;
      if (self.options.tags && typeof(self.options.tags) === 'string') {
        if (self.options.tags.substr(0, 1) === '[') {
          self.options.tags = JSON.parse(self.options.tags);
        } else {
          self.options.tags = self.options.tags.split(self.options.separator);
        }
      }

      if (self.options.tags && !self.options.allowNewItems) {
         self.options.data = $.map (self.options.tags, function (value, i) {
             return { id: value, text: value };
         });
         self.options.multiple = true;
         delete self.options.tags;
      }
    },
    initializeOrdering: function(){
      var self = this;
      if (self.options.orderable) {
        var formatSelection = function(data, $container){
          return data ? data.text : undefined;
        };
        if(self.options.formatSelection){
          formatSelection = self.options.formatSelection;
        }

        self.options.formatSelection = function(data, $container) {
          $container.parents('li')
            .drag("start", function(e, dd) {
              $(this).addClass('select2-choice-dragging');
              self.$el.select2("onSortStart");
              $.drop({
                tolerance: function(event, proxy, target) {
                  var test = event.pageY > (target.top + target.height / 2);
                  $.data(target.elem, "drop+reorder",
                         test ? "insertAfter" : "insertBefore" );
                  return this.contains(target, [event.pageX, event.pageY]);
                }
              });
              return $( this ).clone().
                addClass('dragging').
                css({opacity: 0.75, position: 'absolute'}).
                appendTo(document.body);
            })
            .drag(function(e, dd) {
              /*jshint eqeqeq:false */
              $( dd.proxy ).css({
                top: dd.offsetY,
                left: dd.offsetX
              });
              var drop = dd.drop[0],
                  method = $.data(drop || {}, "drop+reorder");

              /* XXX Cannot use triple equals here */
              if (drop && (drop != dd.current || method != dd.method)){
                $(this)[method](drop);
                dd.current = drop;
                dd.method = method;
                dd.update();
              }
            })
            .drag("end", function(e, dd) {
              $(this).removeClass('select2-choice-dragging');
              self.$el.select2("onSortEnd");
              $( dd.proxy ).remove();
            })
            .drop("init", function(e, dd ) {
              /*jshint eqeqeq:false */
              /* XXX Cannot use triple equals here */
              return (this == dd.drag) ? false: true;
            });
          return formatSelection(data, $container);
        };
      }
    },
    initializeSelect2: function(){
      var self = this;
      self.$el.select2(self.options);
      self.$select2 = self.$el.parent().find('.select2-container');
      self.$el.parent().off('close.modal.patterns');
      if(self.options.orderable){
        self.$select2.addClass('select2-orderable');
      }
    },
    init: function() {
      var self = this;

      if (self.options.hasOwnProperty ('allowNewItems'))
      {
          self.options.allowNewItems = parseBool(self.options.allowNewItems);
      }
      else
      {
          self.options.allowNewItems = true;
      }

      if (self.options.ajax || self.options.vocabularyUrl) {
        if(self.options.vocabularyUrl) {
          self.options.multiple = true;
          self.options.ajax = self.options.ajax || {};
          self.options.ajax.url = self.options.vocabularyUrl;
          // XXX removing the following function does'nt break tests. dead code?
          self.options.initSelection = function ($el, callback) {
            var data = [], value = $el.val();
            $(value.split(self.options.separator)).each(function () {
              data.push({id: this, text: this});
            });
            callback(data);
          };
        }

        var query_term = '';
        self.options.ajax = $.extend({
          quietMillis: 300,
          data: function (term, page) {
            query_term = term;
            return {
              query: term,
              page_limit: 10,
              page: page
            };
          },
          results: function (data, page) {
            var results = data.results;
            if (self.options.vocabularyUrl) {
              var data_ids = [];
              $.each(data.results, function(i, item) {
                data_ids.push(item.id);
              });
              results = [];

              var have_result = query_term === '' || $.inArray(query_term, data_ids) >= 0;
              if (self.options.allowNewItems && !have_result) {
                  results.push({id:query_term, text:query_term});
              }

              if (have_result || self.options.allowNewItems) {
                $.each(data.results, function(i, item) {
                    results.push(item);
                });
              }
            }
            return { results: results };
          }
        }, self.options.ajax);
      }

      self.initializeValues();
      self.initializeTags();
      self.initializeOrdering();
      self.initializeSelect2();
    }
  });

  return Select2;

});
