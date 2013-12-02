// plone integration for related items
//
// Author: Ryan Foster
// Contact: ryan@rynamic.com
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
      vocabularyUrl: null, // must be set to work
      width: '300px',
      multiple: true,
      tokenSeparators: [",", " "],
      separator: ",",
      orderable: true,
      cache: true,
      mode: 'search', // possible values are search and browse
      closeOnSelect: false,
      basePath: '/',
      searchText: 'Search:',
      searchAllText: 'entire site',
      homeText: 'home',
      folderTypes: ['Folder'],
      selectableTypes: null, // null means everything is selectable, otherwise a list of strings to match types that are selectable
      attributes: ['UID', 'Title', 'Type', 'path'],
      dropdownCssClass: 'pattern-relateditems-dropdown',
      maximumSelectionSize: -1,
      resultTemplate: '' +
        '<div class="pattern-relateditems-result pattern-relateditems-type-<%= Type %> <% if (selected) { %>pattern-relateditems-active<% } %>">' +
        '  <a href="#" class="pattern-relateditems-result-select <% if (selectable) { %>selectable<% } %>">' +
        '    <span class="pattern-relateditems-result-title"><%= Title %></span>' +
        '    <span class="pattern-relateditems-result-path"><%= path %></span>' +
        '  </a>' +
        '  <span class="pattern-relateditems-buttons">' +
        '  <% if (folderish) { %>' +
        '     <a class="pattern-relateditems-result-browse" href="#" data-path="<%= path %>"></a>' +
        '   <% } %>' +
        ' </span>' +
        '</div>',
      resultTemplateSelector: null,
      selectionTemplate: '' +
        '<span class="pattern-relateditems-item pattern-relateditems-type-<%= Type %>">' +
        ' <span class="pattern-relateditems-item-title"><%= Title %></span>' +
        ' <span class="pattern-relateditems-item-path"><%= path %></span>' +
        '</span>',
      selectionTemplateSelector: null,
      breadCrumbsTemplate: '' +
        '<span><span class="pattern-relateditems-path-label"><%= searchText %></span><a class="pattern-relateditems-iconhome" href="/"></a><%= items %></span>',
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
      // let's give all the options possible to the template generation
      var options = $.extend(true, {}, self.options, item);
      options._item = item;
      return _.template(template, options);
    },
    activateBrowsing: function(){
      var self = this;
      self.browsing = true;
      self.setBreadCrumbs();
    },
    deactivateBrowsing: function(){
      var self = this;
      self.browsing = false;
      self.setBreadCrumbs();
    },
    browseTo: function(path) {
      var self = this;
      self.trigger('before-browse');
      self.currentPath = path;
      if (path === '/' && self.options.mode === 'search') {
        self.deactivateBrowsing();
      } else {
        self.activateBrowsing();
      }
      self.$el.select2('close');
      self.$el.select2('open');
      self.trigger('after-browse');
    },
    setBreadCrumbs: function() {
      var self = this;
      var path = self.currentPath ? self.currentPath : self.options.basePath;
      var html;
      if (path === '/') {
        html = self.applyTemplate('breadCrumbs', {items:'<em>'+self.options.searchAllText+'</em>', searchText: self.options.searchText});
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
        html = self.applyTemplate('breadCrumbs', {items:itemsHtml, searchText: self.options.searchText});
      }
      var $crumbs = $(html);
      $('a', $crumbs).on('click', function(event) {
        self.browseTo($(this).attr('href'));
        return false;
      });
      self.$browsePath.html($crumbs);
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
    isSelectable: function(item) {
      var self = this;
      if (self.options.selectableTypes === null) {
        return true;
      } else {
        return _.indexOf(self.options.selectableTypes, item.Type) > -1;
      }
    },
    init: function() {
      var self = this;

      self.options.ajax = self.options.setupAjax.apply(self);

      self.$el.wrap('<div class="pattern-relateditems-container" />');
      self.$container = self.$el.parents('.pattern-relateditems-container');
      self.$container.width(self.options.width);

      Select2.prototype.initializeValues.call(self);
      Select2.prototype.initializeTags.call(self);

      self.options.formatSelection = function(item, $container) {
        return self.applyTemplate('selection', item);
      };

      Select2.prototype.initializeOrdering.call(self);

      self.options.formatResult = function(item) {
        if (!item.Type || _.indexOf(self.options.folderTypes, item.Type) === -1){
          item.folderish = false;
        }else{
          item.folderish = true;
        }

        item.selectable = self.isSelectable(item);

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

        $('.pattern-relateditems-result-select', result).on('click', function(event) {
          event.preventDefault();
          if ($(this).is('.selectable')) {
            var $parent = $(this).parents('.pattern-relateditems-result');
            if ($parent.is('.pattern-relateditems-active')) {
              $parent.removeClass('pattern-relateditems-active');
              self.deselectItem(item);
            } else {
              self.selectItem(item);
              $parent.addClass('pattern-relateditems-active');
              if(self.options.maximumSelectionSize > 0){
                var items = self.$select2.select2('data');
                if(items.length >= self.options.maximumSelectionSize){
                  self.$select2.select2('close');
                }
              }
            }
          }
        });

        $('.pattern-relateditems-result-browse', result).on('click', function(event) {
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

      self.$browsePath = $('<span class="pattern-relateditems-path" />');
      self.$container.prepend(self.$browsePath);

      if(self.options.mode === 'search'){
        self.deactivateBrowsing();
        self.browsing = false;
      }else{
        self.activateBrowsing();
        self.browsing = true;
      }

      self.$el.on("select2-selecting", function(event) {
        event.preventDefault();
      });

    }
  });

  return RelatedItems;

});
