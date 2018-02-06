/* Pattern utils
 */


define([
  'jquery'
], function($) {
  'use strict';

  var QueryHelper = function(options) {
    /* if pattern argument provided, it can implement the interface of:
     *    - browsing: boolean if currently browsing
     *    - currentPath: string of current path to apply to search if browsing
     *    - basePath: default path to provide if no subpath used
     */

    var self = this;
    var defaults = {
      pattern: null, // must be passed in
      vocabularyUrl: null,
      searchParam: 'SearchableText', // query string param to pass to search url
      pathOperator: 'plone.app.querystring.operation.string.path',
      attributes: ['UID', 'Title', 'Description', 'getURL', 'portal_type'],
      batchSize: 10, // number of results to retrive
      baseCriteria: [],
      sort_on: 'is_folderish',
      sort_order: 'reverse',
      pathDepth: 1
    };
    self.options = $.extend({}, defaults, options);

    self.pattern = self.options.pattern;
    if (self.pattern === undefined || self.pattern === null) {
      self.pattern = {
        browsing: false,
        basePath: '/'
      };
    }

    if (self.options.url && !self.options.vocabularyUrl) {
      self.options.vocabularyUrl = self.options.url;
    } else if (self.pattern.vocabularyUrl) {
      self.options.vocabularyUrl = self.pattern.vocabularyUrl;
    }
    self.valid = Boolean(self.options.vocabularyUrl);

    self.getBatch = function(page) {
      return {
        page: page ? page : 1,
        size: self.options.batchSize
      };
    };

    self.getCurrentPath = function() {
      var pattern = self.pattern;
      var currentPath;
      /* If currentPath is set on the QueryHelper object, use that first.
       * Then, check on the pattern.
       * Finally, see if it is a function and call it if it is.
       */
      if (self.currentPath) {
        currentPath = self.currentPath;
      } else {
        currentPath = pattern.currentPath;
      }
      if (typeof currentPath === 'function') {
        currentPath = currentPath();
      }
      var path = currentPath;
      if (!path) {
        if (pattern.basePath) {
          path = pattern.basePath;
        } else if (pattern.options.basePath) {
          path = pattern.options.basePath;
        } else {
          path = '/';
        }
      }
      return path;
    };

    self.getCriterias = function(term, searchOptions) {
      if (searchOptions === undefined) {
        searchOptions = {};
      }
      searchOptions = $.extend({}, {
        useBaseCriteria: true,
        additionalCriterias: []
      }, searchOptions);

      var criterias = [];
      if (searchOptions.useBaseCriteria) {
        criterias = self.options.baseCriteria.slice(0);
      }
      if (term) {
        term += '*';
        criterias.push({
          i: self.options.searchParam,
          o: 'plone.app.querystring.operation.string.contains',
          v: term
        });
      }
      if (searchOptions.searchPath) {
        criterias.push({
          i: 'path',
          o: self.options.pathOperator,
          v: searchOptions.searchPath + '::' + self.options.pathDepth
        });
      } else if (self.pattern.browsing) {
        criterias.push({
          i: 'path',
          o: self.options.pathOperator,
          v: self.getCurrentPath() + '::' + self.options.pathDepth
        });
      }
      criterias = criterias.concat(searchOptions.additionalCriterias);
      return criterias;
    };

    self.getQueryData = function(term, page) {
      var data = {
        query: JSON.stringify({
          criteria: self.getCriterias(term),
          sort_on: self.options.sort_on,
          sort_order: self.options.sort_order
        }),
        attributes: JSON.stringify(self.options.attributes)
      };
      if (page) {
        data.batch = JSON.stringify(self.getBatch(page));
      }
      return data;
    };

    self.getUrl = function() {
      var url = self.options.vocabularyUrl;
      if (url.indexOf('?') === -1) {
        url += '?';
      } else {
        url += '&';
      }
      return url + $.param(self.getQueryData());
    };

    self.selectAjax = function() {
      return {
        url: self.options.vocabularyUrl,
        dataType: 'JSON',
        quietMillis: 100,
        data: function(term, page) {
          return self.getQueryData(term, page);
        },
        results: function(data, page) {
          var more = (page * 10) < data.total; // whether or not there are more results available
          // notice we return the value of more so Select2 knows if more results can be loaded
          return {
            results: data.results,
            more: more
          };
        }
      };
    };

    self.search = function(term, operation, value, callback, useBaseCriteria, type) {
      if (useBaseCriteria === undefined) {
        useBaseCriteria = true;
      }
      if (type === undefined) {
        type = 'GET';
      }
      var criteria = [];
      if (useBaseCriteria) {
        criteria = self.options.baseCriteria.slice(0);
      }
      criteria.push({
        i: term,
        o: operation,
        v: value
      });
      var data = {
        query: JSON.stringify({
          criteria: criteria
        }),
        attributes: JSON.stringify(self.options.attributes)
      };
      $.ajax({
        url: self.options.vocabularyUrl,
        dataType: 'JSON',
        data: data,
        type: type,
        success: callback
      });
    };

    return self;
  };

  var Loading = function(options) {
    /*
     * Options:
     *   backdrop(pattern): if you want to have the progress indicator work
     *                      seamlessly with backdrop pattern
     *   zIndex(integer or function): to override default z-index used
     */
    var self = this;
    self.className = 'plone-loader';
    var defaults = {
      backdrop: null,
      zIndex: 10005 // can be a function
    };
    if (!options) {
      options = {};
    }
    self.options = $.extend({}, defaults, options);

    self.init = function() {
      self.$el = $('.' + self.className);
      if (self.$el.length === 0) {
        self.$el = $('<div><div></div></div>');
        self.$el.addClass(self.className).hide().appendTo('body');
      }
    };

    self.show = function(closable) {
      self.init();
      self.$el.show();
      var zIndex = self.options.zIndex;
      if (typeof(zIndex) === 'function') {
        zIndex = Math.max(zIndex(), 10005);
      } else {
        // go through all modals and backdrops and make sure we have a higher
        // z-index to use
        zIndex = 10005;
        $('.plone-modal-wrapper,.plone-modal-backdrop').each(function() {
          zIndex = Math.max(zIndex, $(this).css('zIndex') || 10005);
        });
        zIndex += 1;
      }
      self.$el.css('zIndex', zIndex);

      if (closable === undefined) {
        closable = true;
      }
      if (self.options.backdrop) {
        self.options.backdrop.closeOnClick = closable;
        self.options.backdrop.closeOnEsc = closable;
        self.options.backdrop.init();
        self.options.backdrop.show();
      }
    };

    self.hide = function() {
      self.init();
      self.$el.hide();
    };

    return self;
  };

  var getAuthenticator = function() {
    var $el = $('input[name="_authenticator"]');
    if ($el.length === 0) {
      $el = $('a[href*="_authenticator"]');
      if ($el.length > 0) {
        return $el.attr('href').split('_authenticator=')[1];
      }
      return '';
    } else {
      return $el.val();
    }
  };

  var generateId = function(prefix) {
    if (prefix === undefined) {
      prefix = 'id';
    }
    return prefix + (Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1));
  };

  var setId = function($el, prefix) {
    if (prefix === undefined) {
      prefix = 'id';
    }
    var id = $el.attr('id');
    if (id === undefined) {
      id = generateId(prefix);
    } else {
      /* hopefully we don't screw anything up here... changing the id
       * in some cases so we get a decent selector */
      id = id.replace(/\./g, '-');
    }
    $el.attr('id', id);
    return id;
  };

  var getWindow = function() {
    var win = window;
    if (win.parent !== window) {
      win = win.parent;
    }
    return win;
  };

  var parseBodyTag = function(txt) {
    return $((/<body[^>]*>[^]*<\/body>/im).exec(txt)[0]
      .replace('<body', '<div').replace('</body>', '</div>')).eq(0).html();
  };

  var featureSupport = {
    /* Well tested feature support for things we use in mockup.
     * All gathered from: http://diveintohtml5.info/everything.html
     * Alternative to using some form of modernizr.
     */
    dragAndDrop: function() {
      return 'draggable' in document.createElement('span');
    },
    fileApi: function() {
      return typeof FileReader != 'undefined'; // jshint ignore:line
    },
    history: function() {
      return !!(window.history && window.history.pushState);
    }
  };

  var bool = function(val) {
    if (typeof val === 'string') {
      val = $.trim(val).toLowerCase();
    }
    return ['false', false, '0', 0, '', undefined, null].indexOf(val) === -1;
  };

  var escapeHTML = function(val) {
    return $('<div/>').text(val).html();
  };

  var removeHTML = function(val) {
    return val.replace(/<[^>]+>/ig, '');
  };

  var storage = {
    // Simple local storage wrapper, which doesn't break down if it's not available.
    get: function (name) {
        if (window.localStorage) {
          var val = window.localStorage[name];
          return typeof(val) === 'string' ? JSON.parse(val) : undefined;
      }
    },

    set: function (name, val) {
      if (window.localStorage) {
        window.localStorage[name] = JSON.stringify(val);
      }
    }
  };

  return {
    bool: bool,
    escapeHTML: escapeHTML,
    removeHTML: removeHTML,
    featureSupport: featureSupport,
    generateId: generateId,
    getAuthenticator: getAuthenticator,
    getWindow: getWindow,
    Loading: Loading,
    loading: new Loading(),  // provide default loader
    parseBodyTag: parseBodyTag,
    QueryHelper: QueryHelper,
    setId: setId,
    storage: storage
  };
});
