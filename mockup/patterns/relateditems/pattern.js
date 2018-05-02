/* Related items pattern.
 *
 * Options:
 *    vocabularyUrl(string): This is a URL to a JSON-formatted file used to populate the list (null)
 *    attributes(array): This list is passed to the server during an AJAX request to specify the attributes which should be included on each item. (['UID', 'Title', 'portal_type', 'path'])
 *    basePath(string): Start browse/search in this path. Default: set to rootPath.
 *    contextPath(string): Path of the object, which is currently edited. If this path is given, this object will not be selectable.
 *    closeOnSelect(boolean): Select2 option. Whether or not the drop down should be closed when an item is selected. (true)
 *    dropdownCssClass(string): Select2 option. CSS class to add to the drop down element. ('pattern-relateditems-dropdown')
 *    favorites(array): Array of objects. These are favorites, which can be used to quickly jump to different locations. Objects have the attributes "title" and "path". Default: []
 *    maximumSelectionSize(integer): The maximum number of items that can be selected in a multi-select control. If this number is less than 1 selection is not limited. (-1)
 *    minimumInputLength: Select2 option. Number of characters necessary to start a search. Default: 0.
 *    mode(string): Initial widget mode. Possible values: 'search', 'browse'. If set to 'search', the catalog is searched for a searchterm. If set to 'browse', browsing starts at basePath. Default: 'search'.
 *    orderable(boolean): Whether or not items should be drag-and-drop sortable. (true)
 *    pageSize(int): Batch size to break down big result sets into multiple pages. (10).
 *    recentlyUsed(boolen): Show the recently used items dropdown (false).
 *    recentlyUsedMaxItems(integer): Maximum items to keep in recently used list. 0: no restriction. (20).
 *    rootPath(string): Only display breadcrumb path elements deeper than this path. Default: "/"
 *    rootUrl(string): Visible URL up to the rootPath. This is prepended to the currentPath to generate submission URLs.
 *    scanSelection(boolean): Scan the list of selected elements for other patterns.
 *    selectableTypes(array): If the value is null all types are selectable. Otherwise, provide a list of strings to match item types that are selectable. (null)
 *    separator(string): Select2 option. String which separates multiple items. (',')
 *    sortOn(string): Index on which to sort on. If null, will default to term relevance (no sort) when searching and folder order (getObjPositionInParent) when browsing. (null)
 *    sortOrder(string): Sort ordering. ('ascending')
 *    tokenSeparators(array): Select2 option, refer to select2 documentation. ([",", " "])
 *    upload(boolen): Allow file and image uploads from within the related items widget.
 *    uploadAllowView(string): View, which returns a JSON response in the form of {allowUpload: true}, if upload is allowed in the current context.
 *    width(string): Specify a width for the widget. ('100%')
 *    breadcrumbTemplate(string): Template to use for a single item in the breadcrumbs.
 *    breadcrumbTemplateSelector(string): Select an element from the DOM from which to grab the breadcrumbTemplate. (null)
 *    toolbarTemplate(string): Template for element to which toolbar items will be appended.
 *    toolbarTemplateSelector(string): Select an element from the DOM from which to grab the toolbarTemplate. (null)
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
  'mockup-ui-url/views/button',
  'mockup-utils',
  'pat-registry',
  'translate',
  'text!mockup-patterns-relateditems-url/templates/breadcrumb.xml',
  'text!mockup-patterns-relateditems-url/templates/favorite.xml',
  'text!mockup-patterns-relateditems-url/templates/recentlyused.xml',
  'text!mockup-patterns-relateditems-url/templates/result.xml',
  'text!mockup-patterns-relateditems-url/templates/selection.xml',
  'text!mockup-patterns-relateditems-url/templates/toolbar.xml',
  'bootstrap-dropdown'
], function($, _, Base, Select2, ButtonView, utils, registry, _t,
            BreadcrumbTemplate,
            FavoriteTemplate,
            RecentlyUsedTemplate,
            ResultTemplate,
            SelectionTemplate,
            ToolbarTemplate
) {
  'use strict';

  var RelatedItems = Base.extend({
    name: 'relateditems',
    trigger: '.pat-relateditems',
    parser: 'mockup',
    currentPath: undefined,
    selectedUIDs: [],
    openAfterInit: undefined,
    defaults: {
      // main option
      vocabularyUrl: null,  // must be set to work

      // more options
      attributes: ['UID', 'Title', 'portal_type', 'path', 'getURL', 'getIcon', 'is_folderish', 'review_state'],  // used by utils.QueryHelper
      basePath: '',
      pageSize: 10,
      browsing: undefined,
      closeOnSelect: true,
      contextPath: undefined,
      dropdownCssClass: 'pattern-relateditems-dropdown',
      favorites: [],
      recentlyUsed: false,
      recentlyUsedMaxItems: 20,
      recentlyUsedKey: 'relateditems_recentlyused',
      maximumSelectionSize: -1,
      minimumInputLength: 0,
      mode: 'auto', // possible values are 'auto', 'search' and 'browse'.
      orderable: true,  // mockup-patterns-select2
      pathOperator: 'plone.app.querystring.operation.string.path',
      rootPath: '/',
      rootUrl: '',  // default to be relative.
      scanSelection: false,  // False, to no unnecessarily use CPU time on this.
      selectableTypes: null, // null means everything is selectable, otherwise a list of strings to match types that are selectable
      separator: ',',
      sortOn: null,
      sortOrder: 'ascending',
      tokenSeparators: [',', ' '],
      upload: false,
      uploadAllowView: undefined,
      width: '100%',

      // templates
      breadcrumbTemplate: BreadcrumbTemplate,
      breadcrumbTemplateSelector: null,
      favoriteTemplate: FavoriteTemplate,
      favoriteTemplateSelector: null,
      recentlyusedTemplate: RecentlyUsedTemplate,
      recentlyusedTemplateSelector: null,
      resultTemplate: ResultTemplate,
      resultTemplateSelector: null,
      selectionTemplate: SelectionTemplate,
      selectionTemplateSelector: null,
      toolbarTemplate: ToolbarTemplate,
      toolbarTemplateSelector: null,

      // needed
      multiple: true,

    },

    recentlyUsed: function (filterSelectable) {
      var ret = utils.storage.get(this.options.recentlyUsedKey) || [];
      // hard-limit to 1000 entries
      ret = ret.slice(ret.length-1000, ret.length);
      if (filterSelectable) {
        // Filter out only selectable items.
        // This is used only to create the list of items to be displayed.
        // the list to be stored is unfiltered and can be reused among
        // different instances of this widget with different settings.
        ret.filter(this.isSelectable.bind(this));
      }
      // max is applied AFTER filtering selectable items.
      var max = parseInt(this.options.recentlyUsedMaxItems, 10);
      if (max) {
        // return the slice from the end, as we want to display newest items first.
        ret = ret.slice(ret.length-max, ret.length);
      }
      return ret;
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
      var options = $.extend(true, {}, self.options, item, {
        'browsing': self.browsing,
        'open_folder': _t('Open folder')
      });
      options._item = item;
      return _.template(template)(options);
    },

    setAjax: function () {
      var ajax = {

        url: this.options.vocabularyUrl,
        dataType: 'JSON',
        quietMillis: 500,

        data: function (term, page) {

          var criterias = [];
          if (term) {
            term = '*' + term + '*';
            criterias.push({
              i: 'SearchableText',
              o: 'plone.app.querystring.operation.string.contains',
              v: term
            });
          }

          // We don't restrict for selectable types while browsing...
          if (!this.browsing && this.options.selectableTypes) {
            criterias.push({
              i: 'portal_type',
              o: 'plone.app.querystring.operation.selection.any',
              v: this.options.selectableTypes
            });
          }

          criterias.push({
            i: 'path',
            o: this.options.pathOperator,
            v: this.options.rootPath + this.currentPath + (this.browsing ? '::1' : '')
          });

          var sort_on = this.options.sortOn;
          var sort_order = sort_on ? this.options.sortOrder : null;
          if (this.browsing && sort_on === null) {
            sort_on = 'getObjPositionInParent';
            sort_order = 'ascending';
          }

          var data = {
            query: JSON.stringify({
              criteria: criterias,
              sort_on: sort_on,
              sort_order: sort_order
            }),
            attributes: JSON.stringify(this.options.attributes),
            batch: JSON.stringify({
              page: page ? page : 1,
              size: this.options.pageSize
            })
          };
          return data;
        }.bind(this),

        results: function (data, page) {

          var more = (page * this.options.pageSize) < data.total;
          var results = data.results;

          this.selectedUIDs = (this.$el.select2('data') || []).map(function (el) {
            // populate current selection. Reuse in formatResult
            return el.UID;
          });

          // Filter out items:
          // While browsing: always include folderish items
          // Browsing and searching: Only include selectable items, which are not already selected.
          results = results.filter(
            function (item) {
              if (
                (this.browsing && item.is_folderish) ||
                (this.isSelectable(item) && this.selectedUIDs.indexOf(item.UID) == -1)
              ) {
                return true;
              }
              return false;
            }.bind(this)
          );

          // Extend ``data`` with a ``oneLevelUp`` item when browsing
          var path = this.currentPath.split('/');
          if (page === 1 &&           // Show level up only on top.
            this.browsing  &&         // only level up when browsing
            path.length > 1 &&        // do not try to level up one level under root.
            this.currentPath !== '/'  // do not try to level up beyond root
          ) {
            results = [{
              'oneLevelUp': true,
              'Title': _t('One level up'),
              'path': path.slice(0, path.length - 1).join('/') || '/',
              'is_folderish': true,
              'selectable': false
            }].concat(results);
          }
          return {
            results: results,
            more: more
          };
        }.bind(this)

      };
      this.options.ajax = ajax;
    },

    renderToolbar: function () {
      var self = this;
      var path = self.currentPath;
      var html;

      var paths = path.split('/');
      var itemPath = '';
      var itemsHtml = '';
      _.each(paths, function(node) {
        if (node !== '') {
          var item = {};
          item.path = itemPath = itemPath + '/' + node;
          item.text = node;
          itemsHtml = itemsHtml + self.applyTemplate('breadcrumb', item);
        }
      });

      // favorites
      var favoritesHtml = '';
      _.each(self.options.favorites, function (item) {
        var item_copy = _.clone(item);
        item_copy.path = item_copy.path.substr(self.options.rootPath.length) || '/';
        favoritesHtml = favoritesHtml + self.applyTemplate('favorite', item_copy);
      });

      var recentlyUsedHtml = '';
      if (self.options.recentlyUsed) {
        var recentlyUsed = self.recentlyUsed(true);  // filter out only those items which can actually be selected
        _.each(recentlyUsed.reverse(), function (item) {  // reverse to get newest first.
          recentlyUsedHtml = recentlyUsedHtml + self.applyTemplate('recentlyused', item);
        });
      }

      html = self.applyTemplate('toolbar', {
        items: itemsHtml,
        favItems: favoritesHtml,
        favText: _t('Favorites'),
        searchText: _t('Current path:'),
        searchModeText: _t('Search'),
        browseModeText: _t('Browse'),
        recentlyUsedItems: recentlyUsedHtml,
        recentlyUsedText: _t('Recently Used'),
      });

      self.$toolbar.html(html);

      $('.dropdown-toggle', self.$toolbar).dropdown();

      $('button.mode.search', self.$toolbar).on('click', function(e) {
        e.preventDefault();
        if (self.browsing) {
          $('button.mode.search', self.$toolbar).toggleClass('btn-primary btn-default');
          $('button.mode.browse', self.$toolbar).toggleClass('btn-primary btn-default');
          self.browsing = false;
          if (self.$el.select2('data').length > 0) {
            // Have to call after initialization
            self.openAfterInit = true;
          }
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
        if (!self.browsing) {
          $('button.mode.search', self.$toolbar).toggleClass('btn-primary btn-default');
          $('button.mode.browse', self.$toolbar).toggleClass('btn-primary btn-default');
          self.browsing = true;
          if (self.$el.select2('data').length > 0) {
            // Have to call after initialization
            self.openAfterInit = true;
          }
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

      if (self.options.recentlyUsed) {
        $('.pattern-relateditems-recentlyused-select', self.$toolbar).on('click', function(event) {
          event.preventDefault();
          var uid = $(this).data('uid');
          var item = self.recentlyUsed().filter(function (it) { return it.UID === uid; });
          if (item.length > 0) {
            item = item[0];
          } else {
            return;
          }
          self.selectItem(item);
          if (self.options.maximumSelectionSize > 0) {
            var items = self.$el.select2('data');
            if (items.length >= self.options.maximumSelectionSize) {
              return;
            }
          }
        });
      }

      function initUploadView(UploadView, disabled) {
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

      // upload
      if (self.options.upload && utils.featureSupport.dragAndDrop() && utils.featureSupport.fileApi()) {

        require(['mockup-patterns-relateditems-upload'], function (UploadView) {
          if (self.options.uploadAllowView) {
            // Check, if uploads are allowed in current context
            $.ajax({
              url: self.options.uploadAllowView,
              // url: self.currentUrl() + self.options.uploadAllowView,  // not working yet
              dataType: 'JSON',
              data: {
                path: self.options.rootPath + self.currentPath
              },
              type: 'GET',
              success: function (result) {
                initUploadView(UploadView, !result.allowUpload);
              }
            });
          } else {
            // just initialize upload view without checking, if uploads are allowed.
            initUploadView(UploadView);
          }
        });

      }

    },

    browseTo: function (path) {
      var self = this;
      self.emit('before-browse');
      self.currentPath = path;
      self.$el.select2('close');
      self.renderToolbar();
      self.$el.select2('open');
      self.emit('after-browse');
    },

    selectItem: function(item) {
      var self = this;
      self.emit('selecting');
      var data = self.$el.select2('data');
      data.push(item);
      self.$el.select2('data', data, true);

      if (self.options.recentlyUsed) {
        // add to recently added items
        var recentlyUsed = self.recentlyUsed();  // do not filter for selectable but get all. append to that list the new item.
        var alreadyPresent = recentlyUsed.filter(function (it) { return it.UID === item.UID; });
        if (alreadyPresent.length > 0) {
          recentlyUsed.splice(recentlyUsed.indexOf(alreadyPresent[0]), 1);
        }
        recentlyUsed.push(item);
        utils.storage.set(self.options.recentlyUsedKey, recentlyUsed);
      }

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
      if (item.selectable === false) {
        return false;
      }
      if (self.options.selectableTypes === null) {
        return true;
      } else {
        return _.indexOf(self.options.selectableTypes, item.portal_type) > -1;
      }
    },

    init: function() {
      var self = this;

      self.browsing = self.options.mode !== 'search';

      // Remove trailing slash
      self.options.rootPath = self.options.rootPath.replace(/\/$/, '');
      // Substract rootPath from basePath with is the relative currentPath. Has a leading slash. Or use '/'
      self.currentPath = self.options.basePath.substr(self.options.rootPath.length) || '/';

      self.setAjax();

      self.$el.wrap('<div class="pattern-relateditems-container" />');
      self.$container = self.$el.parents('.pattern-relateditems-container');
      self.$container.width(self.options.width);

      Select2.prototype.initializeValues.call(self);
      Select2.prototype.initializeTags.call(self);

      self.options.formatSelection = function(item) {

        item = $.extend(true, {
            'Title': '',
            'getIcon': '',
            'getURL': '',
            'path': '',
            'portal_type': '',
            'review_state': ''
        }, item);

        // activate petterns on the result set.
        var $selection = $(self.applyTemplate('selection', item));
        if (self.options.scanSelection) {
          registry.scan($selection);
        }
        if (self.options.maximumSelectionSize == 1){
          // If this related field accepts only 1 item, the breadcrumbs should
          // reflect the location for this particular item
          var itemPath = item.path;
          var path_split = itemPath.split('/');
          path_split = path_split.slice(0,-1);  // Remove last part of path, we always want the parent path
          itemPath = path_split.join('/');
          self.currentPath = itemPath;
          self.renderToolbar();
        }
        return $selection;
      };

      Select2.prototype.initializeOrdering.call(self);

      self.options.formatResult = function(item) {
        item.selectable = self.isSelectable(item);

        item = $.extend(true, {
            'Title': '',
            'getIcon': '',
            'getURL': '',
            'is_folderish': false,
            'oneLevelUp': false,
            'path': '',
            'portal_type': '',
            'review_state': '',
            'selectable': false,
        }, item);

        if (self.selectedUIDs.indexOf(item.UID) != -1) {
            // do not allow already selected items to be selected again.
            item.selectable = false;
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
              if (self.options.maximumSelectionSize > 0) {
                var items = self.$el.select2('data');
                if (items.length >= self.options.maximumSelectionSize) {
                  self.$el.select2('close');
                }
              }
              self.selectItem(item);
              $parent.addClass('pattern-relateditems-active');
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

              try {
                callback(
                  ids
                  .map(function(uid) {
                    return results[uid];
                  })
                  .filter(function(item) {
                    return item !== undefined;
                  })
                );
              } catch (e) {
                // Select2 3.5.4 throws an error in some cases in
                // updateSelection, ``this.selection.find(".select2-search-choice").remove();``
                // No idea why, hard to track.
                console.log(data);
              }

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

      self.options.tokenizer = function (input) {
        if (this.options.mode === 'auto') {
          if (input) {
            this.browsing = false;
          } else {
            this.browsing = true;
          }
        }
      }.bind(this);

      self.options.id = function(item) {
        return item.UID;
      };

      Select2.prototype.initializeSelect2.call(self);

      self.$toolbar = $('<div class="toolbar ui-offset-parent" />');
      self.$container.prepend(self.$toolbar);

      self.$el.on('select2-selecting', function(event) {
        event.preventDefault();
      });

      self.renderToolbar();

    }
  });

  return RelatedItems;

});
