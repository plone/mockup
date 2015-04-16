define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/toolbar',
  'mockup-ui-url/views/buttongroup',
  'mockup-ui-url/views/button',
  'mockup-ui-url/views/base',
  'mockup-patterns-structure-url/js/views/table',
  'mockup-patterns-structure-url/js/views/selectionwell',
  'mockup-patterns-structure-url/js/views/tags',
  'mockup-patterns-structure-url/js/views/properties',
  'mockup-patterns-structure-url/js/views/workflow',
  'mockup-patterns-structure-url/js/views/delete',
  'mockup-patterns-structure-url/js/views/rename',
  'mockup-patterns-structure-url/js/views/rearrange',
  'mockup-patterns-structure-url/js/views/selectionbutton',
  'mockup-patterns-structure-url/js/views/paging',
  'mockup-patterns-structure-url/js/views/addmenu',
  'mockup-patterns-structure-url/js/views/columns',
  'mockup-patterns-structure-url/js/views/textfilter',
  'mockup-patterns-structure-url/js/views/upload',
  'mockup-patterns-structure-url/js/collections/result',
  'mockup-patterns-structure-url/js/collections/selected',
  'mockup-utils',
  'translate',
  'jquery.cookie'
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, BaseView,
            TableView, SelectionWellView, TagsView, PropertiesView,
            WorkflowView, DeleteView, RenameView, RearrangeView, SelectionButtonView,
            PagingView, AddMenu, ColumnsView, TextFilterView, UploadView,
            ResultCollection, SelectedCollection, utils, _t) {
  'use strict';

  var DISABLE_EVENT = 'DISABLE';

  var AppView = BaseView.extend({
    tagName: 'div',
    /* we setup binding here and specifically for every button so there is a
     * way to override default click event behavior.
     * Otherwise, if we bound all buttons to the same event, there is no way
     * to override the event or stop bubbling it. */
    buttonClickEvents: {
      'cut': 'cutCopyClickEvent',
      'copy': 'cutCopyClickEvent',
      'paste': 'pasteEvent',
      'tags': DISABLE_EVENT, //disable
      'properties': DISABLE_EVENT,
      'workflow': DISABLE_EVENT,
      'delete': DISABLE_EVENT,
      'rename': DISABLE_EVENT,
      'rearrange': DISABLE_EVENT
    },
    buttonViewMapping: {
      'secondary.tags': TagsView,
      'secondary.properties': PropertiesView,
      'secondary.workflow': WorkflowView,
      'primary.delete': DeleteView,
      'secondary.rename': RenameView
    },
    status: '',
    statusType: 'warning',
    pasteOperation: null,
    'sort_on': 'getObjPositionInParent',
    'sort_order': 'ascending',
    additionalCriterias: [],
    pasteSelection: null,
    cookieSettingPrefix: '_fc_',
    pasteAllowed: false,
    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.setAllCookieSettings();
      self.loading = new utils.Loading();
      self.loading.show();

      self.collection = new ResultCollection([], {
        url: self.options.collectionUrl,
        queryParser: function() {
          var term = null;
          if (self.toolbar) {
            term = self.toolbar.get('filter').term;
          }
          var sortOn = self['sort_on']; // jshint ignore:line
          if (!sortOn) {
            sortOn = 'getObjPositionInParent';
          }
          return JSON.stringify({
            criteria: self.queryHelper.getCriterias(term, {
              additionalCriterias: self.additionalCriterias
            }),
            'sort_on': sortOn,
            'sort_order': self['sort_order'] // jshint ignore:line
          });
        },
        queryHelper: self.options.queryHelper
      });
      self.queryHelper = self.options.queryHelper;
      self.selectedCollection = new SelectedCollection();
      self.tableView = new TableView({app: self});

      self.pagingView = new PagingView({app: self});

      /* initialize buttons */
      self.setupButtons();

      self.wellView = new SelectionWellView({
        collection: self.selectedCollection,
        triggerView: self.toolbar.get('selected'),
        app: self
      });

      self.buttonViews = {};
      _.map(self.buttonViewMapping, function(ViewClass, key) {
        var name = key.split('.');
        var group = name[0];
        var buttonName = name[1];
        self.buttonViews[key] = new ViewClass({
          triggerView: self.buttons[group].get(buttonName),
          app: self
        });
      });

      self.toolbar.get('selected').disable();
      self.buttons.primary.disable();
      self.buttons.secondary.disable();

      self.selectedCollection.on('add remove reset', function(modal, collection) {
        if (collection.length) {
          self.toolbar.get('selected').enable();
          self.buttons.primary.enable();
          self.buttons.secondary.enable();
          if (!self.pasteAllowed) {
            self.buttons.primary.get('paste').disable();
          }
        } else {
          this.toolbar.get('selected').disable();
          self.buttons.primary.disable();
          self.buttons.secondary.disable();
        }
      }, self);

      self.collection.on('sync', function() {
        // need to reload models inside selectedCollection so they get any
        // updated metadata
        if (self.selectedCollection.models.length > 0) {
          var uids = [];
          self.selectedCollection.each(function(item) {
            uids.push(item.attributes.UID);
          });
          self.queryHelper.search(
            'UID', 'plone.app.querystring.operation.list.contains',
            uids,
            function(data) {
              _.each(data.results, function(attributes) {
                var item = self.selectedCollection.getByUID(attributes.UID);
                item.attributes = attributes;
              });
            },
            false
          );
        }

        if (self.contextInfoUrl) {
          $.ajax({
            url: self.getAjaxUrl(self.contextInfoUrl),
            dataType: 'json',
            success: function(data) {
              self.trigger('context-info-loaded', data);
            },
            error: function(response) {
              // XXX handle error?
              if (response.status === 404) {
                console.log('context info url not found');
              }
            }
          });
        }
        self.loading.hide();
      });

      self.collection.on('pager', function() {
        self.loading.show();

        /* maintain history here */
        if(self.options.urlStructure && window.history && window.history.pushState){
          if (!self.doNotPushState){
            var path = self.queryHelper.getCurrentPath();
            if(path === '/'){
              path = '';
            }
            var url = self.options.urlStructure.base + path + self.options.urlStructure.appended;
            window.history.pushState(null, null, url);
            $('body').trigger('structure-url-changed', path);
          }else{
            self.doNotPushState = false;
          }
        }
      });

      if (self.options.urlStructure && window.history && window.history.pushState){
        $(window).bind('popstate', function () {
          /* normalize this url first... */
          var url = window.location.href;
          if(url.indexOf('?') !== -1){
            url = url.split('?')[0];
          }
          if(url.indexOf('#') !== -1){
            url = url.split('#')[0];
          }
          // take off the base url
          var path = url.substring(self.options.urlStructure.base.length);
          if(path.substring(path.length - self.options.urlStructure.appended.length) ===
              self.options.urlStructure.appended){
            /* check that it ends with appended value */
            path = path.substring(0, path.length - self.options.urlStructure.appended.length);
          }
          if(!path){
            path = '/';
          }
          self.queryHelper.currentPath = path;
          $('body').trigger('structure-url-changed', path);
          // since this next call causes state to be pushed...
          self.doNotPushState = true;
          self.collection.goTo(self.collection.information.firstPage);
        });
        /* detect key events */
        $(document).bind('keyup keydown', function(e) {
          self.keyEvent = e;
        });
      }
    },
    inQueryMode: function() {
      if (this.additionalCriterias.length > 0) {
        return true;
      }
      if (this['sort_on'] && this['sort_on'] !== 'getObjPositionInParent') { // jshint ignore:line
        return true;
      }
      if (this['sort_order'] !== 'ascending') { // jshint ignore:line
        return true;
      }
      return false;
    },
    getSelectedUids: function(collection) {
      var self = this;
      if (collection === undefined) {
        collection = self.selectedCollection;
      }
      var uids = [];
      collection.each(function(item) {
        uids.push(item.uid());
      });
      return uids;
    },
    getAjaxUrl: function(url) {
      return url.replace('{path}', this.options.queryHelper.getCurrentPath());
    },
    defaultButtonClickEvent: function(button) {
      var self = this;
      var data = null, callback = null;

      if (button.url) {
        self.loading.show();
        // handle ajax now

        if (arguments.length > 1) {
          var arg1 = arguments[1];
          if (!arg1.preventDefault) {
            data = arg1;
          }
        }
        if (arguments.length > 2) {
          var arg2 = arguments[2];
          if (typeof(arg2) === 'function') {
            callback = arg2;
          }
        }
        if (data === null) {
          data = {};
        }
        if (data.selection === undefined) {
          // if selection is overridden by another mechanism
          data.selection = JSON.stringify(self.getSelectedUids());
        }
        data._authenticator = utils.getAuthenticator();
        if (data.folder === undefined) {
          data.folder = self.options.queryHelper.getCurrentPath();
        }

        var url = self.getAjaxUrl(button.url);
        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          success: function(data) {
            self.ajaxSuccessResponse.apply(self, [data, callback]);
            self.loading.hide();
          },
          error: function(response) {
            self.ajaxErrorResponse.apply(self, [response, url]);
            self.loading.hide();
          }
        }, self);
      }
    },
    ajaxSuccessResponse: function(data, callback) {
      var self = this;
      if (data.status === 'success') {
        self.collection.reset();
      }
      if (data.msg) {
        // give status message somewhere...
        self.setStatus(data.msg);
      }
      if (callback !== null && callback !== undefined) {
        callback(data);
      }
      self.collection.pager();
    },
    ajaxErrorResponse: function(response, url) {
      if (response.status === 404) {
        window.alert(_t('operation url ${url} is not valid', {url: url}));
      } else {
        window.alert(_t('there was an error performing action'));
      }
    },
    pasteEvent: function(button, e, data) {
      var self = this;
      if (data === undefined) {
        data = {};
      }
      data = $.extend(true, {}, {
        selection: JSON.stringify(self.getSelectedUids(self.pasteSelection)),
        pasteOperation: self.pasteOperation
      }, data);
      self.defaultButtonClickEvent(button, data);
    },
    cutCopyClickEvent: function(button) {
      var self = this;
      var txt;
      if (button.id === 'cut') {
        txt = _t('cut ');
        self.pasteOperation = 'cut';
      } else {
        txt = _t('copied ');
        self.pasteOperation = 'copy';
      }

      // clone selected items
      self.pasteSelection = new Backbone.Collection();
      self.selectedCollection.each(function(item) {
        self.pasteSelection.add(item);
      });
      txt += 'selection';
      self.setStatus(txt);
      self.pasteAllowed = true;
      self.buttons.primary.get('paste').enable();
    },
    setupButtons: function() {
      var self = this;
      self.buttons = {};
      var items = [];

      var columnsBtn = new ButtonView({
        id: 'columns',
        tooltip: 'Configure displayed columns',
        icon: 'th'
      });

      self.columnsView = new ColumnsView({
        app: self,
        triggerView: columnsBtn
      });
      items.push(columnsBtn);

      items.push(new SelectionButtonView({
        title: 'Selected',
        id: 'selected',
        collection: this.selectedCollection
      }));

      if (self.options.contextInfoUrl) {
        // only add menu if set
        items.push(new AddMenu({
          contextInfoUrl: self.options.contextInfoUrl,
          app: self
        }));
      }
      if (self.options.rearrange) {
        var rearrangeButton = new ButtonView({
          id: 'rearrange',
          title: 'Rearrange',
          tooltip: 'Rearrange folder contents',
          url: self.options.rearrange.url
        });
        self.rearrangeView = new RearrangeView({
          triggerView: rearrangeButton,
          app: self
        });
        items.push(rearrangeButton);
      }

      _.each(_.pairs(this.options.buttonGroups), function(group) {
        var buttons = [];
        _.each(group[1], function(button) {
          button = new ButtonView(button);
          buttons.push(button);
          // bind click events now...
          var ev = self.buttonClickEvents[button.id];
          if (ev !== DISABLE_EVENT) {
            if (ev === undefined) {
              ev = 'defaultButtonClickEvent'; // default click event
            }
            button.on('button:click', self[ev], self);
          }
        });
        self.buttons[group[0]] = new ButtonGroup({
          items: buttons,
          id: group[0],
          app: self
        });
        items.push(self.buttons[group[0]]);
      });
      if (self.options.upload) {
        var uploadButton = new ButtonView({
          id: 'upload',
          title: 'Upload',
          tooltip: 'Upload files',
          icon: 'upload',
          context: 'success'
        });
        self.uploadView = new UploadView({
          triggerView: uploadButton,
          app: self
        });
        items.push(uploadButton);
      }
      items.push(new TextFilterView({
        id: 'filter',
        app: this
      }));
      this.toolbar = new Toolbar({
        items: items
      });
    },
    moveItem: function(id, delta, subsetIds) {
      var self = this;
      $.ajax({
        url: this.getAjaxUrl(this.options.moveUrl),
        type: 'POST',
        data: {
          delta: delta,
          id: id,
          _authenticator: utils.getAuthenticator(),
          subsetIds: JSON.stringify(subsetIds)
        },
        dataType: 'json',
        success: function(data) {
          if (data.msg) {
            self.setStatus(data.msg);
          }else if (data.status !== 'success') {
            // XXX handle error here with something?
            self.setStatus('error moving item');
          }
          self.collection.pager(); // reload it all
        },
        error: function(data) {
          self.setStatus('error moving item');
        }
      });
    },
    setStatus: function(txt, type) {
      this.status = txt;
      if (type === undefined) {
        type = 'warning';
      }
      this.statusType = type;
      this.$('.status').addClass(type).html(txt);
    },
    render: function() {
      var self = this;

      self.$el.append(self.toolbar.render().el);
      self.$el.append(self.wellView.render().el);
      self.$el.append(self.columnsView.render().el);
      if (self.rearrangeView) {
        self.$el.append(self.rearrangeView.render().el);
      }
      if (self.uploadView) {
        self.$el.append(self.uploadView.render().el);
      }

      _.each(self.buttonViews, function(view) {
        self.$el.append(view.render().el);
      });

      self.$el.append(self.tableView.render().el);
      self.$el.append(self.pagingView.render().el);

      // Backdrop class
      if (self.options.backdropSelector !== null) {
        $(self.options.backdropSelector).addClass('ui-backdrop-element');
      } else {
        self.$el.addClass('ui-backdrop-element');
      }

      return self;
    },
    getCookieSetting: function(name, _default) {
      if (_default === undefined) {
        _default = null;
      }
      var val;
      try {
        val = $.cookie(this.cookieSettingPrefix + name);
        val = $.parseJSON(val).value;
      } catch (e) {
        /* error parsing json, load default here now */
        return _default;
      }
      if (val === undefined || val === null) {
        return _default;
      }
      return val;
    },
    setCookieSetting: function(name, val) {
      $.cookie(this.cookieSettingPrefix + name,
               JSON.stringify({'value': val})
      );
    },
    setAllCookieSettings: function() {
      this.activeColumns = this.getCookieSetting('activeColumns', this.activeColumns);
    }
  });

  return AppView;
});
