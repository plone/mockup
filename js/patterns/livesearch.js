// Pattern which Plone livesearch functionality on an input
//
// Author: Ryan Foster
// Contact: ryan@rynamic.com
// Version: 1.0
//
// Adapted from livesearch.js in Plone.
//
// License:
//
// Copyright (C) 2013 Plone Foundation
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
  'js/patterns/toggle',
  'underscore',
  'js/patterns/select2'
], function($, Base, Toggle, _, Select2) {
  "use strict";

  var Livesearch = Base.extend({
    name: "livesearch",
    defaults: {
      multiple: true,
      batchSize: 10, // number of results to retrive
      closeOnSelect: false,
      minimumInputLength: 3,
      tokenSeparators: [",", " "],
      param: 'SearchableText', // query string param to pass to search url
      attributes: ['UID','Title', 'Description', 'getURL', 'Type'],
      dropdownCssClass: 'pat-livesearch-dropdown',
      linkAttribute: 'pat-livesearch-result-title',
      resultTemplate: '' +
        '<div class="pat-livesearch-result pat-livesearch-type-<%= Type %>">' +
          '<a class="pat-livesearch-result-title" href="<%= getURL %>">' +
            '<%= Title %>' +
          '</a>' +
          '<p class="pat-livesearch-result-desc"><%= Description %></p>' +
        '</div>',
      id: function(object) {
        return object.UID;
      }
    },

    init: function() {
      var self = this;

      if (!self.options.url) {
        $.error('No url provided for livesearch results ' + self.$el);
      }

      Select2.prototype.initializeValueMap.call(self);
      Select2.prototype.initializeTags.call(self);
      Select2.prototype.initializeOrdering.call(self);

      if(self.options.url !== undefined  && self.options.url !== null){
        var query_term = '';
        self.options.ajax = {
          url: self.options.url,
          dataType: 'JSON',
          quietMillis: 100,
          data: function(term, page) { // page is the one-based page number tracked by Select2
            var opts = {
              query: JSON.stringify({
                criteria: [{
                  i: self.options.param,
                  o: 'plone.app.querystring.operation.string.contains',
                  v: term + '*'
                }]
              }),
              batch: JSON.stringify({
                page: page,
                size: self.options.batchSize
              }),
              attributes: JSON.stringify(self.options.attributes)
            };
            return opts;
          },
          results: function (data, page) {
            var more = (page * 10) < data.total; // whether or not there are more results available
            // notice we return the value of more so Select2 knows if more results can be loaded
            return {results: data.results, more: more};
          }
        };
      }
      else {
        self.options.tags = [];
      }

      self.options.formatResult = function(item) {
        var result = $(self.applyTemplate('result', item));
        return $(result);
      };

      Select2.prototype.initializeSelect2.call(self);

      self.$el.on("keyup", function(event) {

      });

      self.$el.on("select2-selecting", function(event, data) {
        event.preventDefault();
      });
    },

    applyTemplate: function(tpl, item) {
      var self = this;
      var template;
      if (self.options[tpl+'TemplateSelector'] !== null && self.options[tpl+'Selector'] !== undefined) {
        template = $(self.options[tpl+'Selector']).html();
      } else {
        template = self.options[tpl+'Template'];
      }
      return _.template(template, item);
    },

    _keyEnter: function() {
      var self = this;
      var hl = self.options.highlight;
      var target = self.$results.find('.'+hl)
        .find('a').attr('href');
      window.location = target;
    }

  });

  return Livesearch;

});
