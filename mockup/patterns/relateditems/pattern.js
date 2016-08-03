/* Related items pattern.
 *
 * Options:
 *    vocabularyUrl(string): This is a URL to a JSON-formatted file used to populate the list (null)
 *    attributes(array): This list is passed to the server during an AJAX request to specify the attributes which should be included on each item. (['UID', 'Title', 'portal_type', 'path'])
 *    basePath(string): Start browse/search in this path. Default: set to rootPath.
 *    closeOnSelect(boolean): Select2 option. Whether or not the drop down should be closed when an item is selected. (true)
 *    dropdownCssClass(string): Select2 option. CSS class to add to the drop down element. ('pattern-relateditems-dropdown')
 *    favorites(array): Array of objects. These are favorites, which can be used to quickly jump to different locations. Objects have the attributes "title" and "path". Default: []
 *    mode(string): Initial widget mode. Possible values: 'search', 'browse'. If set to 'search', the catalog is searched for a searchterm. If set to 'browse', browsing starts at basePath. Default: 'search'.
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
 *    upload(boolen): Allow file and image uploads from within the related items widget.
 *    uploadAllowView(string): View, which returns a JSON response in the form of {allowUpload: true}, if upload is allowed in the current context.
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
 *    # Mode "browse", Upload
 *
 *    {{ example-6 }}
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
 * Example: example-6
 *    <input type="text" class="pat-relateditems"
 *           data-pat-relateditems='{"selectableTypes": ["Image", "File"], "vocabularyUrl": "/relateditems-test.json", "upload": true}' />
 *
 */


define([
  'jquery',
  'underscore',
  'pat-base',
  'mockup-patterns-select2',
  'mockup-patterns-relateditems-upload',
  'mockup-ui-url/views/button',
  'mockup-utils',
  'translate',
  'bootstrap-dropdown'
], function($, _, Base, Select2, UploadView, ButtonView, utils, _t) {
  'use strict';

  var RelatedItems = Base.extend({
    name: 'relateditems',
    trigger: '.pat-relateditems',
    parser: 'mockup',
    currentPath: undefined,
    openAfterInit: undefined,
    defaults: {
      // main option
      vocabularyUrl: null,  // must be set to work

      // more options
      upload: false,
      attributes: ['UID', 'Title', 'portal_type', 'path', 'getURL', 'getIcon', 'is_folderish', 'review_state'],  // used by utils.QueryHelper
      basePath: undefined,
      closeOnSelect: true,
      dropdownCssClass: 'pattern-relateditems-dropdown',
      favorites: [],
      maximumSelectionSize: -1,
      minimumInputLength: 0,
      mode: 'search', // possible values are search and browse
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
        '<div class="btn-group mode-selector" role="group">' +
        '  <button type="button" class="mode search btn <% if (mode=="search") { %>btn-primary<% } else {%>btn-default<% } %>"><%- searchModeText %></button>' +
        '  <button type="button" class="mode browse btn <% if (mode=="browse") { %>btn-primary<% } else {%>btn-default<% } %>"><%- browseModeText %></button>' +
        '</div>' +
        '<div class="path-wrapper">' +
        '  <span class="pattern-relateditems-path-label"><%- searchText %></span>' +
        '  <a class="crumb" href="<%- rootPath %>"><span class="glyphicon glyphicon-home"/></a>' +
        '  <%= items %>' +
        '</div>' +
        '<div class="controls pull-right">' +
        '  <% if (favorites.length > 0) { %>' +
        '  <div class="favorites dropdown pull-right">' +
        '    <button class="favorites dropdown-toggle btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '      <span class="glyphicon glyphicon-star"/>' +
        '      <%- favText %>' +
        '      <span class="caret"/>' +
        '    </button>' +
        '    <ul class="dropdown-menu">' +
        '      <%= favItems %>' +
        '    </ul>' +
        '  </div>' +
        '  <% } %>' +
        '</div>',
      breadCrumbsTemplateSelector: null,
      favoriteTemplate: '' +
        '<li><a href="<%- path %>" class="fav" aria-labelledby="blip"><%- title %></a></li>',
      favoriteTemplateSelector: null,
      resultTemplate: '' +
        '<div class="pattern-relateditems-result">' +
        '  <a href="#" class=" pattern-relateditems-result-select <% if (selectable) { %>selectable<% } %>">' +
        '    <% if (typeof getIcon !== "undefined" && getIcon) { %><img src="<%- getURL %>/@@images/image/icon "> <% } %>' +
        '    <span class="pattern-relateditems-result-title <% if (typeof review_state !== "undefined") { %> state-<%- review_state %> <% } %>  " /span>' +
        '    <span class="pattern-relateditems contenttype-<%- portal_type.toLowerCase() %>"><%- Title %></span>' +
        '    <span class="pattern-relateditems-result-path"><%- path %></span>' +
        '  </a>' +
        '  <span class="pattern-relateditems-buttons">' +
        '  <% if (mode !== "search" && is_folderish) { %>' +
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

    setQuery: function () {

      var baseCriteria = [];

      if (this.options.mode == 'search') {
        // MODE SEARCH

        // restrict to given types
        if (this.options.selectableTypes) {
          baseCriteria.push({
            i: 'portal_type',
            o: 'plone.app.querystring.operation.selection.any',
            v: this.options.selectableTypes
          });
        }

        // TODO: Remove, if search-everywhere turns out useful.
        // search recursively in current path
        // baseCriteria.push({
        //   i: 'path',
        //   o: 'plone.app.querystring.operation.string.path',
        //   v: this.currentPath
        // });

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

      // favorites
      var favoritesHtml = '';
      _.each(self.options.favorites, function (item) {
        favoritesHtml = favoritesHtml + self.applyTemplate('favorite', item);
      });

      html = self.applyTemplate('breadCrumbs', {
        items: itemsHtml,
        favItems: favoritesHtml,
        favText: _t('Favorites'),
        searchText: _t('Search in path:'),
        searchModeText: _t('Search'),
        browseModeText: _t('Browse'),
        rootPath: self.options.rootPath
      });

      self.$toolbar.html(html);

      $('.dropdown-toggle', self.$toolbar).dropdown();

      $('button.mode.search', self.$toolbar).on('click', function(e) {
        e.preventDefault();
        if (self.options.mode === 'browse') {
          $('button.mode.search', self.$toolbar).toggleClass('btn-primary btn-default');
          $('button.mode.browse', self.$toolbar).toggleClass('btn-primary btn-default');
          self.options.mode = 'search';
          if (self.$el.select2('data').length > 0) {
            // Have to call after initialization
            self.openAfterInit = true;
          }
          self.setQuery();
          if (!self.openAfterInit) {
            self.$el.select2('close');
            self.$el.select2('open');
          }
        } else {
          // just open result list
          self.$el.select2('close');
          self.$el.select2('open');
        }
      });

      $('button.mode.browse', self.$toolbar).on('click', function(e) {
        e.preventDefault();
        if (self.options.mode == 'search') {
          $('button.mode.search', self.$toolbar).toggleClass('btn-primary btn-default');
          $('button.mode.browse', self.$toolbar).toggleClass('btn-primary btn-default');
          self.options.mode = 'browse';
          if (self.$el.select2('data').length > 0) {
            // Have to call after initialization
            self.openAfterInit = true;
          }
          self.setQuery();
          if (!self.openAfterInit) {
            self.$el.select2('close');
            self.$el.select2('open');
          }
        } else {
          // just open result list
          self.$el.select2('close');
          self.$el.select2('open');
        }
      });

      $('a.crumb', self.$toolbar).on('click', function(e) {
        e.preventDefault();
        self.browseTo($(this).attr('href'));
      });

      $('a.fav', self.$toolbar).on('click', function(e) {
        e.preventDefault();
        self.browseTo($(this).attr('href'));
      });

      // upload
      if (self.options.upload && utils.featureSupport.dragAndDrop() && utils.featureSupport.fileApi()) {

        function initUploadView(disabled) {
          var uploadButtonId = 'upload-' + utils.generateId();
          var uploadButton = new ButtonView({
            id:  uploadButtonId,
            title: _t('Upload'),
            tooltip: _t('Upload files'),
            icon: 'upload',
          });
          if (disabled) {
            uploadButton.disable();
          }
          $('.controls', self.$toolbar).prepend(uploadButton.render().el);
          self.uploadView = new UploadView({
            triggerView: uploadButton,
            app: self
          });
          $('#btn-' +  uploadButtonId, self.$toolbar).append(self.uploadView.render().el);
        }

        if (self.options.uploadAllowView) {
          // Check, if uploads are allowed in current context
          $.ajax({
            url: self.options.uploadAllowView,
            // url: self.currentUrl() + self.options.uploadAllowView,  // not working yet
            dataType: 'JSON',
            data: {
              path: self.currentPath
            },
            type: 'GET',
            success: function (result) {
              initUploadView(!result.allowUpload);
            }
          });
        } else {
          // just initialize upload view without checking, if uploads are allowed.
          initUploadView();
        }

      }

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

    selectItem: function(item) {
      var self = this;
      self.emit('selecting');
      var data = self.$el.select2('data');
      data.push(item);
      self.$el.select2('data', data, true);
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

      self.options.mode === 'browse';
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
        var data = self.$el.select2('data');

        for (var i = 0; i < data.length; i = i + 1) {
          if (data[i].UID === item.UID) {
            // Exclude already selected items in result list.
            return;
          }
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
                var items = self.$el.select2('data');
                if (items.length >= self.options.maximumSelectionSize) {
                  self.$el.select2('close');
                }
              }
              if (self.options.closeOnSelect) {
                self.$el.select2('close');
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

              if (self.openAfterInit) {
                // open after initialization
                self.$el.select2('open');
                self.openAfterInit = undefined;
              }

            },
            false
          );
        }

      };

      self.options.id = function(item) {
        return item.UID;
      };

      Select2.prototype.initializeSelect2.call(self);

      self.$toolbar = $('<div class="toolbar ui-offset-parent" />');
      self.$container.prepend(self.$toolbar);

      self.$el.on('select2-selecting', function(event) {
        event.preventDefault();
      });

      self.setBreadCrumbs();

    }
  });

  return RelatedItems;

});
