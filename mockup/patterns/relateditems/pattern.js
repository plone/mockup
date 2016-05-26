/* Related items pattern.
 *
 * Options:
 *    vocabularyUrl(string): This is a URL to a JSON-formatted file used to populate the list (null)
 *    attributes(array): This list is passed to the server during an AJAX request to specify the attributes which should be included on each item. (['UID', 'Title', 'portal_type', 'path'])
 *    basePath(string): Start browse/search in this path. Default: set to rootPath.
 *    closeOnSelect(boolean): Select2 option. Whether or not the drop down should be closed when an item is selected. (false)
 *    dropdownCssClass(string): Select2 option. CSS class to add to the drop down element. ('pattern-relateditems-dropdown')
 *    mode(string): Initial widget mode. Possible values: 'search', 'browse'. If set to 'search', the catalog is searched for a searchterm. If set to 'browse', browsing starts at basePath. Default: 'browse'.
 *    maximumSelectionSize(integer): The maximum number of items that can be selected in a multi-select control. If this number is less than 1 selection is not limited. (-1)
 *    minimumInputLength: Select2 option. Number of characters necessary to start a search. Default: 0.
 *    orderable(boolean): Whether or not items should be drag-and-drop sortable. (true)
 *    rootPath(string): Only display breadcrumb path elements deeper than this path. Default: "/"
 *    selectableTypes(array): If the value is null all types are selectable. Otherwise, provide a list of strings to match item types that are selectable. (null)
 *    separator(string): Select2 option. String which separates multiple items. (',')
 *    tokenSeparators(array): Select2 option, refer to select2 documentation. ([",", " "])
 *    width(string): Specify a width for the widget. ('100%')
 *    breadCrumbTemplate(string): Template to use for a single item in the breadcrumbs. ('/<a href="<%- path %>"><%- text %></a>')
 *    breadCrumbTemplateSelector(string): Select an element from the DOM from which to grab the breadCrumbTemplate. (null)
 *    breadCrumbsTemplate(string): Template for element to which breadCrumbs will be appended. ('<span><span class="pattern-relateditems-path-label"><%- searchText %></span><a class="icon-home" href="/"></a><%- items %></span>')
 *    breadCrumbsTemplateSelector(string): Select an element from the DOM from which to grab the breadCrumbsTemplate. (null)
 *    resultTemplate(string): Template for an item in the in the list of results. Refer to source for default. (Refer to source)
 *    resultTemplateSelector(string): Select an element from the DOM from which to grab the resultTemplate. (null)
 *    selectionTemplate(string): Template for element that will be used to construct a selected item. (Refer to source)
 *    selectionTemplateSelector(string): Select an element from the DOM from which to grab the selectionTemplate. (null)
 *
 * Documentation:
 *    The Related Items pattern is based on Select2 so many of the same options will work here as well.
 *
 *    # Default, mode "search"
 *
 *    {{ example-1 }}
 *
 *    # Default, mode "browse"
 *
 *    {{ example-2 }}
 *
 *    # Existing values, some bad
 *
 *    {{ example-3 }}
 *
 *    # Selectable Types
 *
 *    {{ example-4 }}
 *
 *    # Select a single item
 *
 *    {{ example-5 }}
 *
 * Example: example-1
 *    <input type="text" class="pat-relateditems"
 *           data-pat-relateditems="width:30em;
 *                                  mode:search;
 *                                  vocabularyUrl:/relateditems-test.json" />
 *
 * Example: example-2
 *    <input type="text" class="pat-relateditems"
 *           data-pat-relateditems="width:30em;
 *                                  mode:browse;
 *                                  vocabularyUrl:/relateditems-test.json" />
 *
 * Example: example-3
 *    <input type="text" class="pat-relateditems"
 *           value="asdf1234gsad,sdfbsfdh345,asdlfkjasdlfkjasdf,kokpoius98"
 *           data-pat-relateditems="width:30em; vocabularyUrl:/relateditems-test.json" />
 *
 * Example: example-4
 *    <input type="text" class="pat-relateditems"
 *           data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "/relateditems-test.json"}' />
 *
 * Example: example-5
 *    <input type="text" class="pat-relateditems"
 *           data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "/relateditems-test.json", "maximumSelectionSize": 1}' />
 *
 */


define([
  'jquery',
  'underscore',
  'pat-base',
  'mockup-patterns-select2',
  'mockup-utils',
  'translate'
], function($, _, Base, Select2, utils, _t) {
  'use strict';

  var RelatedItems = Base.extend({
    name: 'relateditems',
    trigger: '.pat-relateditems',
    parser: 'mockup',
    currentPath: undefined,
    browsing: undefined,
    defaults: {
      // main option
      vocabularyUrl: null,  // must be set to work

      // more options
      attributes: ['UID', 'Title', 'portal_type', 'path', 'getURL', 'getIcon', 'is_folderish', 'review_state'],  // used by utils.QueryHelper
      basePath: undefined,
      closeOnSelect: false,
      dropdownCssClass: 'pattern-relateditems-dropdown',
      maximumSelectionSize: -1,
      minimumInputLength: 0,
      mode: 'browse', // possible values are search and browse
      orderable: true,  // mockup-patterns-select2
      rootPath: '/',
      selectableTypes: null, // null means everything is selectable, otherwise a list of strings to match types that are selectable
      separator: ',',
      tokenSeparators: [',', ' '],
      width: '100%',

      // templates
      breadCrumbTemplate: '' +
        '/<a href="<%- path %>" class="crumb"><%- text %></a>',
      breadCrumbTemplateSelector: null,
      breadCrumbsTemplate: '' +
        '<span>' +
        '  <button class="mode browse <% if (mode=="browse") { %>active<% } %>"><%- browseModeText %></button>' +
        '  <button class="mode search <% if (mode=="search") { %>active<% } %>"><%- searchModeText %></button>' +
        '  <span class="pattern-relateditems-path-label"><%- searchText %></span>' +
        '  <a class="crumb" href="<%- rootPath %>"><span class="glyphicon glyphicon-home"/></a>' +
        '  <%= items %>' +
        '</span>',
      breadCrumbsTemplateSelector: null,
      resultTemplate: '' +
        '<div class="pattern-relateditems-result <% if (selected) { %>pattern-relateditems-active<% } %>">' +
        '  <a href="#" class=" pattern-relateditems-result-select <% if (selectable) { %>selectable<% } %>">' +
        '    <% if (typeof getIcon !== "undefined" && getIcon) { %><img src="<%- getURL %>/@@images/image/icon "> <% } %>' +
        '    <span class="pattern-relateditems-result-title <% if (typeof review_state !== "undefined") { %> state-<%- review_state %> <% } %>  " /span>' +
        '    <span class="pattern-relateditems contenttype-<%- portal_type.toLowerCase() %>"><%- Title %></span>' +
        '    <span class="pattern-relateditems-result-path"><%- path %></span>' +
        '  </a>' +
        '  <span class="pattern-relateditems-buttons">' +
        '  <% if (is_folderish) { %>' +
        '     <a class="pattern-relateditems-result-browse" href="#" data-path="<%- path %>"></a>' +
        '   <% } %>' +
        ' </span>' +
        '</div>',
      resultTemplateSelector: null,
      selectionTemplate: '' +
        '<span class="pattern-relateditems-item">' +
        '  <% if (typeof getIcon !== "undefined" && getIcon) { %> <img src="<%- getURL %>/@@images/image/icon"> <% } %>' +
        '  <span class="pattern-relateditems-item-title contenttype-<%- portal_type.toLowerCase() %> <% if (typeof review_state !== "undefined") { %> state-<%- review_state  %> <% } %>" ><%- Title %></span>' +
        '  <span class="pattern-relateditems-item-path"><%- path %></span>' +
        '</span>',
      selectionTemplateSelector: null,

      // needed
      multiple: true,

    },

    applyTemplate: function(tpl, item) {
      var self = this;
      var template;
      if (self.options[tpl + 'TemplateSelector']) {
        template = $(self.options[tpl + 'TemplateSelector']).html();
        if (!template) {
          template = self.options[tpl + 'Template'];
        }
      } else {
        template = self.options[tpl + 'Template'];
      }
      // let's give all the options possible to the template generation
      var options = $.extend(true, {}, self.options, item);
      options._item = item;
      return _.template(template)(options);
    },

    browseTo: function (path) {
      var self = this;
      self.emit('before-browse');
      self.currentPath = path;
      self.$el.select2('close');
      self.$el.select2('open');
      self.emit('after-browse');
      self.setBreadCrumbs();
    },

    setQuery: function () {

      var baseCriteria = [];

      if (!this.browsing) {
        // MODE SEARCH

        // restrict to given types
        if (this.options.selectableTypes) {
          baseCriteria.push({
            i: 'portal_type',
            o: 'plone.app.querystring.operation.selection.any',
            v: this.options.selectableTypes
          });
        }

        // search recursively in current path
        baseCriteria.push({
          i: 'path',
          o: 'plone.app.querystring.operation.string.path',
          v: this.currentPath
        });

      }

      // set query object
      this.query = new utils.QueryHelper(
        $.extend(true, {}, this.options, {
          pattern: this,
          baseCriteria: baseCriteria
        })
      );

      var ajax = {};
      if (this.query.valid) {
        ajax = this.query.selectAjax();
      }
      this.options.ajax = ajax;
      this.$el.select2(this.options);
    },

    setBreadCrumbs: function () {
      var self = this;
      var path = self.currentPath;
      var root = self.options.rootPath.replace(/\/$/, '');
      var html;

      // strip site root from path
      path = path.indexOf(root) === 0 ? path.slice(root.length) : path;

      var paths = path.split('/');
      var itemPath = root;
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
      html = self.applyTemplate('breadCrumbs', {
        items: itemsHtml,
        searchText: _t('Search in path:'),
        searchModeText: _t('Search'),
        browseModeText: _t('Browse'),
        rootPath: self.options.rootPath
      });

      var $crumbs = $(html);

      $('button.mode.search', $crumbs).on('click', function(e) {
        e.preventDefault();
        $('button.mode.search', $crumbs).addClass('active');
        $('button.mode.browse', $crumbs).removeClass('active');
        self.browsing = false;
        self.setQuery();
      });

      $('button.mode.browse', $crumbs).on('click', function(e) {
        e.preventDefault();
        $('button.mode.browse', $crumbs).addClass('active');
        $('button.mode.search', $crumbs).removeClass('active');
        self.browsing = true;
        self.setQuery();
      });

      $('a.crumb', $crumbs).on('click', function(e) {
        e.preventDefault();
        self.browseTo($(this).attr('href'));
      });

      self.$browsePath.html($crumbs);
    },

    selectItem: function(item) {
      var self = this;
      self.emit('selecting');
      var data = self.$el.select2('data');
      data.push(item);
      self.$el.select2('data', data, true);
      item.selected = true;
      self.emit('selected');
    },

    deselectItem: function(item) {
      var self = this;
      self.emit('deselecting');
      var data = self.$el.select2('data');
      _.each(data, function(obj, i) {
        if (obj.UID === item.UID) {
          data.splice(i, 1);
        }
      });
      self.$el.select2('data', data, true);
      item.selected = false;
      self.emit('deselected');
    },

    isSelectable: function(item) {
      var self = this;
      if (self.options.selectableTypes === null) {
        return true;
      } else {
        return _.indexOf(self.options.selectableTypes, item.portal_type) > -1;
      }
    },

    init: function() {
      var self = this;

      self.browsing = self.options.mode === 'browse';
      self.currentPath = self.options.basePath || self.options.rootPath;

      self.setQuery();

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
        item.selectable = self.isSelectable(item);
        if (item.selected === undefined) {
          var data = self.$el.select2('data');
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
              if (self.options.maximumSelectionSize > 0) {
                var items = self.$select2.select2('data');
                if (items.length >= self.options.maximumSelectionSize) {
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
          var query = new utils.QueryHelper(
            $.extend(true, {}, self.options, {
              pattern: self
            })
          );
          query.search(
            'UID', 'plone.app.querystring.operation.list.contains', ids,
            function(data) {
              var results = data.results.reduce(function(prev, item) {
                prev[item.UID] = item;
                return prev;
              }, {});
              callback(
                ids
                .map(function(uid) {
                  return results[uid];
                })
                .filter(function(item) {
                  return item !== undefined;
                })
              );
            },
            false
          );
        }
      };

      self.options.id = function(item) {
        return item.UID;
      };

      Select2.prototype.initializeSelect2.call(self);

      self.$browsePath = $('<span class="pattern-relateditems-path" />');
      self.$container.prepend(self.$browsePath);

      self.$el.on('select2-selecting', function(event) {
        event.preventDefault();
      });

      self.setBreadCrumbs();

    }
  });

  return RelatedItems;

});
