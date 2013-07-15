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


define([
  'jquery',
  'underscore',
  './base.js',
  './select2.js',
  './queryhelper.js'
], function($, _, Base, Select2, QueryHelper) {
  "use strict";

  var RelatedItems = Base.extend({
    name: "relateditems",
    browsing: false,
    currentPath: null,
    defaults: {
      ajaxvocabulary: null, // must be set to work
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
      folderTypes: ['Folder'],
      attributes: ['UID','Title', 'Type', 'path'],
      dropdownCssClass: 'pat-relateditems-dropdown',
      maximumSelectionSize: -1,
      resultTemplate: '' +
        '<div class="pat-relateditems-result pat-relateditems-type-<%= Type %>">' +
        ' <span class="pat-relateditems-buttons">' +
        '  <% if (folderish) { %>' +
        '     <a class="pat-relateditems-result-browse" href="#" data-path="<%= path %>">' +
        '       <i class="icon-folder-open"></i>' +
        '    </a>' +
        '   <% } %>' +
        '  <% if (!selected) { %>' +
        '     <a class="pat-relateditems-result-select" href="#">' +
        '         <i class="icon-plus-sign"></i>' +
        '     </a>' +
        '  <% } %>' +
        ' </span>' +
        ' <span class="pat-relateditems-result-title"><%= Title %></span>' +
        ' <span class="pat-relateditems-result-path"><%= path %></span>' +
        '</div>',
      resultTemplateSelector: null,
      selectionTemplate: '' +
        '<span class="pat-relateditems-item pat-relateditems-type-<%= Type %>">' +
        ' <span class="pat-relateditems-item-title"><%= Title %></span>' +
        ' <span class="pat-relateditems-item-path"><%= path %></span>' +
        '</span>',
      selectionTemplateSelector: null,
      tabsTemplate: '' +
        '<div class="pat-relateditems-tabs tabs">' +
        ' <a href="#" class="pat-relateditems-tabs-search tab active"><%= searchText %></a>' +
        ' <a href="#" class="pat-relateditems-tabs-browse tab"><%= browseText %></a>' +
        '</div>',
      tabsTemplateSelector: null,
      breadCrumbsTemplate: '' +
        '<span><a href="/"><i class="icon-home"></i></a><%= items %></span>',
      breadCrumbsTemplateSelector: null,
      breadCrumbTemplate: '' +
        '/<a href="<%= path %>"><%= text %></a>',
      breadCrumbTemplateSelector: null,
      escapeMarkup: function(text) {
        return text;
      }
    },
    applyTemplate: function(tpl, item) {
      var self = this;
      var template;
      if (self.options[tpl+'TemplateSelector']) {
        template = $(self.options[tpl+'TemplateSelector']).html();
        if (!template) {
          template = self.options[tpl+'Template'];
        }
      } else {
        template = self.options[tpl+'Template'];
      }
      return _.template(template, item);
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
      self.trigger('before-browse');
      self.currentPath = path;
      self.activateBrowsing();
      self.$el.select2('close');
      self.$el.select2('open');
      self.trigger('after-browse');
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
          html = self.applyTemplate('breadCrumbs', {items:''});
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
              itemsHtml = itemsHtml + self.applyTemplate('breadCrumb', item);
            }
          });
          html = self.applyTemplate('breadCrumbs', {items:itemsHtml});
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
      var self = this;
      self.trigger('selecting');
      var data = self.$el.select2("data");
      data.push(item);
      self.$el.select2("data", data);
      item.selected = true;
      self.trigger('selected');
    },
    init: function() {
      debugger;
      var self = this;

      self.query = new QueryHelper(self.$el,
          $.extend(true, {}, self.options, {basePattern: self}));

      self.$el.wrap('<div class="pat-relateditems-container" />');
      self.$container = self.$el.parents('.pat-relateditems-container');
      self.$container.width(self.options.width);

      Select2.prototype.initializeValueMap.call(self);
      Select2.prototype.initializeTags.call(self);
      Select2.prototype.initializeOrdering.call(self);

      if(self.query.valid){
        self.options.ajax = self.query.selectAjax();
      } else {
        self.options.tags = [];
      }

      self.options.formatSelection = function(item) {
        return self.applyTemplate('selection', item);
      };

      self.options.formatResult = function(item) {
        if(!item.Type || _.indexOf(self.options.folderTypes, item.Type) === -1){
          item.folderish = false;
        }else{
          item.folderish = true;
        }

        if (item.selected === undefined) {
          var data = self.$el.select2("data");
          item.selected = false;
          _.each(data, function(obj) {
            if (obj.UID === item.UID) {
              item.selected = true;
            }
          });
        }

        var result = $(self.applyTemplate('result', item));

        $('.pat-relateditems-result-select', result).on('click', function(event) {
          self.selectItem(item);
          $(this).remove();
          if(self.options.maximumSelectionSize > 0){
            var items = self.$select2.select2('data');
            if(items.length >= self.options.maximumSelectionSize){
              self.$select2.select2('close');
            }
          }
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
          self.query.search(
            'UID', 'plone.app.querystring.operation.list.contains', ids,
            function(data){
              callback(data.results);
          });
        }
      };

      self.options.id = function(item) {
        var folderish = item.folderish;
        /* Trick select2 into not removing a folder from the list if it has been added.
           Allows user to browse folders that have been selected. */
        if (item.Title === 'About Us') {
          var foo = 0;
        }
        if (folderish) {
          var data = self.$el.select2("data");
          var selected = false;
          if (item.Title === 'About Us') {
            selected = false;
          }
          _.each(data, function(selItem) {
            if (item.UID === selItem.UID) {
              selected = true;
            }
          }, self);
          if (selected) {
            return item.UID + Math.random() + '' + Math.random();
          }
        }
        return item.UID;
      };

      Select2.prototype.initializeSelect2.call(self);

      // Browsing functionality
      var browseOpts = {
        browseText: self.options.browseText,
        searchText: self.options.searchText
      };
      self.$browse = $(self.applyTemplate('tabs', browseOpts));
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

