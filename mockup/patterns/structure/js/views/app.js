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
  'mockup-patterns-structure-url/js/views/generic-popover',
  'mockup-patterns-structure-url/js/views/rearrange',
  'mockup-patterns-structure-url/js/views/selectionbutton',
  'mockup-patterns-structure-url/js/views/paging',
  'mockup-patterns-structure-url/js/views/columns',
  'mockup-patterns-structure-url/js/views/textfilter',
  'mockup-patterns-structure-url/js/views/upload',
  'mockup-patterns-structure-url/js/collections/result',
  'mockup-patterns-structure-url/js/collections/selected',
  'mockup-utils',
  'translate',
  'pat-logger',
  'jquery.cookie'
], function($, _, Backbone, Toolbar, ButtonGroup, ButtonView, BaseView,
            TableView, SelectionWellView,
            GenericPopover, RearrangeView, SelectionButtonView,
            PagingView, ColumnsView, TextFilterView, UploadView,
            _ResultCollection, SelectedCollection, utils, _t, logger) {
  'use strict';

  var log = logger.getLogger('pat-structure');

  var AppView = BaseView.extend({
    tagName: 'div',
    status: '',
    pasteAllowed: !!$.cookie('__cp'),
    statusType: 'warning',
    sort_on: 'getObjPositionInParent',
    sort_order: 'ascending',
    additionalCriterias: [],
    cookieSettingPrefix: '_fc_',
    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.loading = new utils.Loading();
      self.loading.show();
      self.pasteAllowed = $.cookie('__cp');

      /* close popovers when clicking away */
      $(document).click(function(e){
        var $el = $(e.target);
        if(!$el.is(':visible')){
          // ignore this, fake event trigger to element that is not visible
          return;
        }
        if($el.is('a') || $el.parent().is('a')){
          return;
        }
        var $popover = $('.popover:visible');
        if($popover.length > 0 && !$.contains($popover[0], $el[0])){
          var popover = $popover.data('component');
          if(popover){
            popover.hide();
          }
        }
      });

      var ResultCollection = require(options.collectionConstructor);

      self.collection = new ResultCollection([], {
        // Due to default implementation need to poke at things in here,
        // view is passed.
        view: self,
        url: self.options.collectionUrl,
      });

      self.setAllCookieSettings();

      self.selectedCollection = new SelectedCollection();
      self.tableView = new TableView({app: self});

      self.pagingView = new PagingView({app: self});

      /* initialize buttons */
      self.setupButtons();

      self.wellView = new SelectionWellView({
        collection: self.selectedCollection,
        triggerView: self.toolbar.get('selected-items'),
        app: self
      });

      self.toolbar.get('selected-items').disable();
      self.buttons.disable();

      var timeout = 0;
      self.selectedCollection.on('add remove reset', function(/*modal, collection*/) {
        /* delay rendering since this can happen in batching */
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          self.updateButtons();
        }, 100);
      }, self);

      self.collection.on('sync', function() {
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
                log.info('context info url not found');
              }
            }
          });
        }
        self.loading.hide();
      });

      self.collection.on('pager', function() {
        self.loading.show();
        self.updateButtons();

        // the remaining calls are related to window.pushstate.
        // abort if feature unavailable.
        if (!(window.history && window.history.pushState)) {
          return
        }

        // undo the flag set by popState to prevent the push state
        // from being triggered here, and early abort out of the
        // function to not execute the folowing pushState logic.
        if (self.doNotPushState) {
          self.doNotPushState = false;
          return
        }

        var path = self.getCurrentPath();
        if (path === '/'){
          path = '';
        }
        /* maintain history here */
        if (self.options.pushStateUrl) {
          // permit an extra slash in pattern, but strip that if there
          // as path always will be prefixed with a `/`
          var pushStateUrl = self.options.pushStateUrl.replace(
            '/{path}', '{path}');
          var url = pushStateUrl.replace('{path}', path);
          window.history.pushState(null, null, url);
        } else if (self.options.urlStructure) {
          // fallback to urlStructure specification
          var url = self.options.urlStructure.base + path + self.options.urlStructure.appended;
          window.history.pushState(null, null, url);
        }

        if (self.options.traverseView) {
          // flag specifies that the context view implements a traverse
          // view (i.e. IPublishTraverse) and the path is a virtual path
          // of some kind - use the base object instead for that by not
          // specifying a path.
          path = '';
          // TODO figure out whether the following event after this is
          // needed at all.
        }
        $('body').trigger('structure-url-changed', path);

      });

      if ((self.options.pushStateUrl || self.options.urlStructure)
          && utils.featureSupport.history()){
        $(window).bind('popstate', function () {
          /* normalize this url first... */
          var win = utils.getWindow();
          var url = win.location.href;
          var base, appended;
          if(url.indexOf('?') !== -1){
            url = url.split('?')[0];
          }
          if(url.indexOf('#') !== -1){
            url = url.split('#')[0];
          }
          if (self.options.pushStateUrl) {
            var tmp = self.options.pushStateUrl.split('{path}');
            base = tmp[0];
            appended = tmp[1];
          } else {
            base = self.options.urlStructure.base;
            appended = self.options.urlStructure.appended;
          }
          // take off the base url
          var path = url.substring(base.length);
          if(path.substring(path.length - appended.length) === appended){
            /* check that it ends with appended value */
            path = path.substring(0, path.length - appended.length);
          }
          if(!path){
            path = '/';
          }
          self.setCurrentPath(path);
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
    updateButtons: function(){
      var self = this;
      if (self.selectedCollection.length) {
        self.toolbar.get('selected-items').enable();
        self.buttons.enable();
      } else {
        this.toolbar.get('selected-items').disable();
        self.buttons.disable();
      }

      if ('paste' in self.buttons) {
        self.pasteAllowed = !!$.cookie('__cp');
        if (self.pasteAllowed) {
          self.buttons.get('paste').enable();
        }else{
          self.buttons.get('paste').disable();
        }
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
    getCurrentPath: function() {
      return this.collection.getCurrentPath();
    },
    setCurrentPath: function(path) {
      this.collection.setCurrentPath(path);
    },
    getAjaxUrl: function(url) {
      return url.replace('{path}', this.getCurrentPath());
    },
    buttonClickEvent: function(button) {
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
          data.folder = self.getCurrentPath();
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
      self.selectedCollection.reset();
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
    setupButtons: function() {
      var self = this;
      var items = [];

      var columnsBtn = new ButtonView({
        id: 'attribute-columns',
        tooltip: _t('Configure displayed columns'),
        icon: 'th'
      });

      self.columnsView = new ColumnsView({
        app: self,
        triggerView: columnsBtn
      });
      items.push(columnsBtn);

      items.push(new SelectionButtonView({
        title: _t('Selected'),
        id: 'selected-items',
        collection: this.selectedCollection
      }));

      if (self.options.rearrange) {
        var rearrangeButton = new ButtonView({
          id: 'rearrange',
          title: _t('Rearrange'),
          icon: 'sort-by-attributes',
          tooltip: _t('Rearrange folder contents'),
          url: self.options.rearrange.url
        });
        self.rearrangeView = new RearrangeView({
          triggerView: rearrangeButton,
          app: self
        });
        items.push(rearrangeButton);
      }
      if (self.options.upload && utils.featureSupport.dragAndDrop() && utils.featureSupport.fileApi()) {
        var uploadButton = new ButtonView({
          id: 'upload',
          title: _t('Upload'),
          tooltip: _t('Upload files'),
          icon: 'upload'
        });
        self.uploadView = new UploadView({
          triggerView: uploadButton,
          app: self
        });
        items.push(uploadButton);
      }

      var buttons = [];
      _.each(self.options.buttons, function(buttonOptions) {
        try{
          var button = new ButtonView(buttonOptions);
          buttons.push(button);

          if(button.form){
            buttonOptions.triggerView = button;
            buttonOptions.app = self;
            var view = new GenericPopover(buttonOptions);
            self.$el.append(view.el);
          }else{
            button.on('button:click', self.buttonClickEvent, self);
          }
        }catch(err){
          log.error('Error initializing button ' + buttonOptions.title + ' ' + err);
        }
      });
      self.buttons = new ButtonGroup({
        items: buttons,
        id: 'mainbuttons',
        app: self
      });
      items.push(self.buttons);

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
        error: function() {
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
      this.activeColumns = this.getCookieSetting(this['activeColumnsCookie'],
                                                 this.activeColumns);
      var perPage = this.getCookieSetting('perPage', 15);
      if(typeof(perPage) === 'string'){
        perPage = parseInt(perPage);
      }
      this.collection.howManyPer(perPage);
    }
  });

  return AppView;
});
