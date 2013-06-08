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
  'underscore',
  'js/patterns/base',
  'js/patterns/select2'
], function($, _, Base, Select2) {
  "use strict";

  var RelatedItems = Base.extend({
    name: "relateditems",
    browsing: false,
    currentPath: null,
    defaults: {
      multiple: true,
      tokenSeparators: [",", " "],
      separator: ",",
      orderable: true,
      cache: true,
      closeOnSelect: false,
      basePath: '/',
      browseText: 'Browse',
      resultTemplate: '' +
        '<div class="pat-relateditems-result pat-relateditems-type-<%= type %>">' +
        ' <% if (type === "folder") { %>' +
        '   <a class="pat-relateditems-result-browse">' +
        '     <i class="icon-folder-open"></i>' +
        '   </a>' +
        ' <% } %>' +
        ' <a class="pat-relateditems-result-select" href="#">' +
        '   <span class="pat-relateditems-result-title"><%= title %></span>' +
        '   <span class="pat-relateditems-result-path"><%= path %></span>' +
        ' </a>' +
        '</div>',
      formatResult: function(item) {
        return item.resultMarkup;
      },
      selectionTemplate: '' +
        '<span class="pat-relateditems-item pat-relateditems-type-<%= type %>">' +
        ' <span class="pat-relateditems-item-title"><%= title %></span>' +
        ' <span class="pat-relateditems-item-path"><%= path %></span>' +
        '</span>',
      formatSelection: function(item) {
        return item.selectionMarkup;
      },
      escapeMarkup: function(text) {
        return text;
      }
    },
    applyTemplate: function(tpl, item) {
      return _.template(tpl, item);
    },
    activateBrowsing: function(){
      var self = this;
      self.$browsePath.html(self.options.basePath);
      self.$browseBtn.html('');
      self.$browseBtn.addClass('select2-search-choice-close');
      self.browsing = true;
    },
    deactivateBrowsing: function(){
      var self = this;
      self.$browseBtn.removeClass('select2-search-choice-close').html(self.options.browseText);
      self.$browsePath.html('');
      self.browsing = false;
    },
    browseTo: function(data) {
      console.log(data);
    },
    init: function() {
      var self = this;

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
              q: term,
              page: page,
              page_limit: 10 // page size
            };
            if(self.browsing){
              opts.browse = self.currentPath ? self.currentPath : self.options.basePath;
            }
            return opts;
          },
          results: function (data, page) {
            var more = (page * 10) < data.total; // whether or not there are more results available
            // notice we return the value of more so Select2 knows if more results can be loaded
            var results = [];
            _.each(data.results, function(item) {
              item.selectionMarkup = self.applyTemplate(self.options.selectionTemplate, item);
              item.resultMarkup = self.applyTemplate(self.options.resultTemplate, item);
              results.push(item);
            });
            return {results: results, more: more};
          }
        };
      }
      else {
        self.options.tags = [];
      }

      Select2.prototype.initializeSelect2.call(self);

      // Browsing functionality
      self.$browse = $('<div class="select2-browse"></div>');
      self.$browseBtn = $('<a href="#"></a>');
      self.$browsePath = $('<span />');
      self.$browse.append(self.$browseBtn);
      self.$browse.append(self.$browsePath);
      self.$select2.before(self.$browse);
      self.deactivateBrowsing();
      self.$el.on('loaded', function(data){
        debugger;
      });

      self.$browse.click(function(e){
        e.preventDefault();
        if(self.browsing){
          self.deactivateBrowsing();
          self.$el.select2('close');
        }else{
          self.activateBrowsing();
          self.$el.select2('open');
        }
      });

      self.$el.on("select", function(event) {
        debugger;
      });
    }
  });

  return RelatedItems;

});

