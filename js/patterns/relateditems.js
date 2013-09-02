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
  'mockup-patterns-base',
  'mockup-patterns-select2',
  'mockup-patterns-queryhelper'
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
      showTabs: true,
      resultTemplate: '' +
        '<div class="pat-relateditems-result pat-relateditems-type-<%= Type %> <% if (selected) { %>pat-active<% } %>">' +
        '  <a href="#" class="pat-relateditems-result-select">' +
        '    <span class="pat-relateditems-result-title"><%= Title %></span>' +
        '    <span class="pat-relateditems-result-path"><%= path %></span>' +
        '  </a>' +
        '  <span class="pat-relateditems-buttons">' +
        '  <% if (folderish) { %>' +
        '     <a class="pat-relateditems-result-browse" href="#" data-path="<%= path %>"></a>' +
        '   <% } %>' +
        ' </span>' +
        '</div>',
      resultTemplateSelector: null,
      selectionTemplate: '' +
        '<span class="pat-relateditems-item pat-relateditems-type-<%= Type %>">' +
        ' <span class="pat-relateditems-item-title"><%= Title %></span>' +
        ' <span class="pat-relateditems-item-path"><%= path %></span>' +
        '</span>',
      selectionTemplateSelector: null,
      tabsTemplate: '' +
        '<div class="pat-relateditems-tabs">' +
        ' <a href="#" class="pat-relateditems-tabs-search pat-relateditems-tab pat-active"><%= searchText %></a>' +
        ' <a href="#" class="pat-relateditems-tabs-browse pat-relateditems-tab"><%= browseText %></a>' +
        '</div>',
      tabsTemplateSelector: null,
      breadCrumbsTemplate: '' +
        '<span><a class="icon-home" href="/"></a><%= items %></span>',
      breadCrumbsTemplateSelector: null,
      breadCrumbTemplate: '' +
        '/<a href="<%= path %>"><%= text %></a>',
      breadCrumbTemplateSelector: null,
      escapeMarkup: function(text) {
        return text;
      },
      setupAjax: function() {
        // Setup the ajax object to use during requests
        var self = this;

        self.query = new QueryHelper(self.$el,
        $.extend(true, {}, self.options, {basePattern: self}));

        if(self.query.valid){
          return self.query.selectAjax();
        }
        return {};
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
        self.$browseBtn.addClass('pat-active');
        self.$searchBtn.removeClass('pat-active');
      } else {
        self.$browseBtn.removeClass('pat-active');
        self.$searchBtn.addClass('pat-active');
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
    deselectItem: function(item) {
      var self = this;
      self.trigger('deselecting');
      var data = self.$el.select2("data");
      _.each(data, function(obj, i) {
        if (obj.UID === item.UID) {
          data.splice(i, 1);
        }
      });
      self.$el.select2("data", data);
      item.selected = false;
      self.trigger('deselected');
    },
    init: function() {
      var self = this;

      self.options.ajax = self.options.setupAjax.apply(self);

      self.$el.wrap('<div class="pat-relateditems-container" />');
      self.$container = self.$el.parents('.pat-relateditems-container');
      self.$container.width(self.options.width);

      Select2.prototype.initializeValueMap.call(self);
      Select2.prototype.initializeTags.call(self);

      self.options.formatSelection = function(item, $container) {
        return self.applyTemplate('selection', item);
      };

      Select2.prototype.initializeOrdering.call(self);

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
          event.preventDefault();
          var $parent = $(this).parents('.pat-relateditems-result');
          if ($parent.is('.pat-active')) {
            $parent.removeClass('pat-active');
            self.deselectItem(item);
          } else {
            self.selectItem(item);
            $parent.addClass('pat-active');
            if(self.options.maximumSelectionSize > 0){
              var items = self.$select2.select2('data');
              if(items.length >= self.options.maximumSelectionSize){
                self.$select2.select2('close');
              }
            }
          }
        });

        $('.pat-relateditems-result-browse', result).on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          var path = $(this).data('path');
          self.browseTo(path);
        });

        return $(result);
      };
      self.options.initSelection = function(element, callback) {
        var data = [];
        var value = $(element).val();
        if (value !== '') {
          var ids = value.split(self.options.separator);
          self.query.search(
            'UID', 'plone.app.querystring.operation.list.contains', ids,
            function(data){
              callback(data.results);
          }, false);
        }
      };

      self.options.id = function(item) {
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
      if (self.options.showTabs === false || self.options.showTabs === 'false') {
        self.$browse.hide();
      }
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

