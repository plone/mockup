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
      searchText: 'Search',
      homeText: 'home',
      dropdownCssClass: 'pat-relateditems-dropdown',
      resultTemplate: '' +
        '<div class="pat-relateditems-result pat-relateditems-type-<%= type %>">' +
        ' <span class="pat-relateditems-buttons">' +
        '  <% if (type === "folder") { %>' +
        '     <a class="pat-relateditems-result-browse" href="#" data-path="<%= path %>">' +
        '       <i class="icon-folder-open"></i>' +
        '    </a>' +
        '   <% } %>' +
        '   <a class="pat-relateditems-result-select" href="#">' +
        '       <i class="icon-plus-sign"></i>' +
        '   </a>' +
        ' </span>' +
        ' <span class="pat-relateditems-result-title"><%= title %></span>' +
        ' <span class="pat-relateditems-result-path"><%= path %></span>' +
        '</div>',
      selectionTemplate: '' +
        '<span class="pat-relateditems-item pat-relateditems-type-<%= type %>">' +
        ' <span class="pat-relateditems-item-title"><%= title %></span>' +
        ' <span class="pat-relateditems-item-path"><%= path %></span>' +
        '</span>',
      tabsTemplate: '' +
        '<div class="pat-relateditems-tabs tabs">' +
        ' <a href="#" class="pat-relateditems-tabs-search tab active"><%= searchText %></a>' +
        ' <a href="#" class="pat-relateditems-tabs-browse tab"><%= browseText %></a>' +
        '</div>',
      breadCrumbsTemplate: '' +
        '<span><a href="/"><i class="icon-home"></i></a><%= items %></span>',
      breadCrumbTemplate: '' +
        '/<a href="<%= path %>"><%= text %></a>',
      escapeMarkup: function(text) {
        return text;
      }
    },
    applyTemplate: function(tpl, item) {
      return _.template(tpl, item);
    },
    activateBrowsing: function(){
      var self = this;
      self.browsing = true;
      self.setBreadCrumbs();
      self.setTabs();
    },
    deactivateBrowsing: function(){
      var self = this;
      self.browsing = false;
      self.setBreadCrumbs();
      self.setTabs();
    },
    browseTo: function(path) {
      var self = this;
      self.$el.trigger('before-browse');
      self.currentPath = path;
      self.activateBrowsing();
      self.$el.select2('close');
      self.$el.select2('open');
      self.$el.trigger('after-browse');
    },
    setTabs: function() {
      var self = this;
      if (self.browsing) {
        self.$browseBtn.addClass('active');
        self.$searchBtn.removeClass('active');
      } else {
        self.$browseBtn.removeClass('active');
        self.$searchBtn.addClass('active');
      }
    },
    setBreadCrumbs: function() {
      var self = this;
      var path = self.currentPath ? self.currentPath : self.options.basePath;
      if (self.browsing) {
        var html;
        if (path === '/') {
          html = self.applyTemplate(self.options.breadCrumbsTemplate, {items:''});
        } else {
          var paths = path.split('/');
          var itemPath = '';
          var itemsHtml = '';
          _.each(paths, function(node) {
            if (node !== '') {
              var item = {};
              itemPath = itemPath + '/' + node;
              item.text = node;
              item.path = itemPath;
              itemsHtml = itemsHtml + self.applyTemplate(self.options.breadCrumbTemplate, item);
            }
          });
          html = self.applyTemplate(self.options.breadCrumbsTemplate, {items:itemsHtml});
        }
        var $crumbs = $(html);
        $('a', $crumbs).on('click', function(event) {
          self.browseTo($(this).attr('href'));
          return false;
        });
        self.$browsePath.html($crumbs);
      } else {
        self.$browsePath.html('');
      }
    },
    selectItem: function(item) {
      self.$el.trigger('selecting');
      var data = self.$el.select2("data");
      data.push(item);
      self.$el.select2("data", data);
      self.$el.trigger('selected');
    },
    init: function() {
      var self = this;

      self.$el.wrap('<div class="pat-relateditems-container" />');
      self.$container = self.$el.parents('.pat-relateditems-container');
      self.$container.width(self.options.width);

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
            return {results: data.results, more: more};
          }
        };
      }
      else {
        self.options.tags = [];
      }

      self.options.formatSelection = function(item) {
        var tpl = self.options.selectionTemplate;
        return self.applyTemplate(tpl, item);
      };

      self.options.formatResult = function(item) {
        var tpl = self.options.resultTemplate;
        var result = $(self.applyTemplate(tpl, item));

        $('.pat-relateditems-result-select', result).on('click', function(event) {
          self.selectItem(item);
          return false;
        });

        $('.pat-relateditems-result-browse', result).on('click', function(event) {
          var path = $(this).data('path');
          self.browseTo(path);
          return false;
        });

        return $(result);
      };

      self.options.initSelection = function(element, callback) {
        var data = [];
        var value = $(element).val();
        if (value !== '') {
          var ids = value.split(',');
          _.each(ids, function(id) {
            $.ajax(self.options.url, {
              data: {
                q: id,
                page: 1,
                page_limit: 999
              },
              success: function(results) {
                if (results.results.length === 1) {
                  data.push(results.results[0]);
                  callback(data);
                }
              }
            });
          });
        }

      };

      Select2.prototype.initializeSelect2.call(self);

      // Browsing functionality
      var browseOpts = {
        browseText: self.options.browseText,
        searchText: self.options.searchText
      };
      self.$browse = $(self.applyTemplate(self.options.tabsTemplate, browseOpts));
      self.$container.prepend(self.$browse);
      self.$browseBtn = $('.pat-relateditems-tabs-browse', self.$browse);
      self.$searchBtn = $('.pat-relateditems-tabs-search', self.$browse);
      self.$browsePath = $('<span class="pat-relateditems-path" />');
      self.$browse.after(self.$browsePath);
      self.$browsePath.width(self.$container.width()-2);
      self.deactivateBrowsing();

      self.$browseBtn.click(function(e){
        self.activateBrowsing();
        self.$el.select2('close');
        self.$el.select2('open');
        return false;
      });

      self.$searchBtn.click(function(e){
        self.deactivateBrowsing();
        self.$el.select2('close');
        self.$el.select2('open');
        return false;
      });

      self.$el.on("select2-selecting", function(event) {
        event.preventDefault();
      });

    }
  });

  return RelatedItems;

});

