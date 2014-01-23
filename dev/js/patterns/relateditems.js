/* Related items pattern.
 *
 * Options:
 *    vocabularyUrl(string): This is a URL to a JSON-formatted file used to populate the list (null)
 *    attributes(array): This list is passed to the server during an AJAX request to specify the attributes which should be included on each item. (['UID', 'Title', 'Type', 'path'])
 *    basePath(string): If this is set the widget will start in "Browse" mode and will pass the path to the server to filter the results. ('/')
 *    breadCrumbTemplate(string): Template to use for a single item in the breadcrumbs. ('/<a href="<%= path %>"><%= text %></a>')
 *    breadCrumbTemplateSelector(string): Select an element from the DOM from which to grab the breadCrumbTemplate. (null)
 *    breadCrumbsTemplate(string): Template for element to which breadCrumbs will be appended. ('<span><span class="pattern-relateditems-path-label"><%= searchText %></span><a class="icon-home" href="/"></a><%= items %></span>')
 *    breadCrumbsTemplateSelector(string): Select an element from the DOM from which to grab the breadCrumbsTemplate. (null)
 *    cache(boolean): Whether or not results from the server should be
 *    cached. (true)
 *    closeOnSelect(boolean): Select2 option. Whether or not the drop down should be closed when an item is selected. (false)
 *    dropdownCssClass(string): Select2 option. CSS class to add to the drop down element. ('pattern-relateditems-dropdown')
 *    folderTypes(array): Types which should be considered browsable. (["Folder"])
 *    homeText(string): Text to display in the initial breadcrumb item. (home)
 *    maximumSelectionSize(integer): Do not change this option. (-1)
 *    multiple(boolean): Do not change this option. (true)
 *    orderable(boolean): Whether or not items should be drag-and-drop sortable. (true)
 *    resultTemplate(string): Template for an item in the in the list of results. Refer to source for default. (Refer to source)
 *    resultTemplateSelector(string): Select an element from the DOM from which to grab the resultTemplate. (null)
 *    searchText(string): Text which will be inserted to the left of the
 *    path. (Search)
 *    searchAllText(string): Displays next to the path when the path is set to the root. (All)
 *    selectableTypes(array): If the value is null all types are selectable. Otherwise, provide a list of strings to match item types that are selectable. (null)
 *    selectionTemplate(string): Template for element that will be used to construct a selected item. (Refer to source)
 *    selectionTemplateSelector(string): Select an element from the DOM from which to grab the selectionTemplate. (null)
 *    separator(string): Select2 option. String which separates multiple items. (',')
 *    tokenSeparators(array): Select2 option, refer to select2 documentation.
 *    ([",", " "])
 *    width(string): Specify a width for the widget. ('300px')
 *
 * Documentation:
 *    The Related Items pattern is based on Select2 so many of the same options will work here as well.
 *
 *    # Default
 *
 *    {{ example-1 }}
 *
 *    # Existing values, some bad
 *
 *    {{ example-2 }}
 *
 *    # Selectable Types
 *
 *    {{ example-3 }}
 *
 * Example: example-1
 *    <input type="text" class="pat-relateditems"
 *           data-pat-relateditems="width:30em;
 *                                  vocabularyUrl:/relateditems-test.json" />
 *
 * Example: example-2
 *    <input type="text" class="pat-relateditems"
 *           value="asdf1234gsad,sdfbsfdh345,asdlfkjasdlfkjasdf,kokpoius98"
 *           data-pat-relateditems="width:30em; vocabularyUrl:/relateditems-test.json" />
 *
 * Example: example-3
 *    <input type="text" class="pat-relateditems"
             data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "/relateditems-test.json"}' />
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


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
