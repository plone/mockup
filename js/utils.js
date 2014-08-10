// utils.
//
// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
// Depends: jquery.js
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
      attributes: ['UID','Title', 'Description', 'getURL', 'Type'],
      batchSize: 10, // number of results to retrive
      baseCriteria: [],
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
    if (self.options.vocabularyUrl !== undefined &&
        self.options.vocabularyUrl !== null) {
      self.valid = true;
    } else {
      self.valid = false;
    }

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
      if (typeof(currentPath) === 'function') {
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

    self.getCriterias = function(term, options) {
      if (options === undefined) {
        options = {};
      }
      options = $.extend({}, {
        useBaseCriteria: true,
        additionalCriterias: []
      }, options);

      var criterias = [];
      if (options.useBaseCriteria) {
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
      if (self.pattern.browsing) {
        criterias.push({
          i: 'path',
          o: 'plone.app.querystring.operation.string.path',
          v: self.getCurrentPath() + '::' + self.options.pathDepth
        });
      }
      criterias = criterias.concat(options.additionalCriterias);
      return criterias;
    };

    self.getBatch = function(page) {
      if (!page) {
        page = 1;
      }
      return {
        page: page,
        size: self.options.batchSize
      };
    };

    self.selectAjax = function() {
      return {
        url: self.options.vocabularyUrl,
        dataType: 'JSON',
        quietMillis: 100,
        data: function(term, page) {
          return self.getQueryData(term, page);
        },
        results: function (data, page) {
          var more = (page * 10) < data.total; // whether or not there are more results available
          // notice we return the value of more so Select2 knows if more results can be loaded
          return {results: data.results, more: more};
        }
      };
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

    self.getQueryData = function(term, page) {
      var data = {
        query: JSON.stringify({
          criteria: self.getCriterias(term)
        }),
        attributes: JSON.stringify(self.options.attributes)
      };
      if (page) {
        data.batch = JSON.stringify(self.getBatch(page));
      }
      return data;
    };

    self.search = function(term, operation, value, callback, useBaseCriteria) {
      if (useBaseCriteria === undefined) {
        useBaseCriteria = true;
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
        query: JSON.stringify({ criteria: criteria }),
        attributes: JSON.stringify(self.options.attributes)
      };
      $.ajax({
        url: self.options.vocabularyUrl,
        dataType: 'JSON',
        data: data,
        success: callback
      });
    };

    return self;
  };

  var ProgressIndicator = function(options) {
    /*
     * Options:
     *   className(string): Defaults to "progress-indicator"
     *   container($element): Defaults to null and will create the $element on
     *                        intialization
     *   backdrop(pattern): if you want to have the progress indicator work
     *                      seamlessly with backdrop pattern
     *   wrapper($element): manually set container element to calculate position
     *                      from. If unset, will just use container option
     *   zIndex(integer or function): to override default z-index used
     */
    var self = this;
    var defaults = {
      className: 'progress-indicator',
      container: null,
      backdrop: null,
      wrapper: null,
      zIndex: 10005 // can be a function
    };
    if (!options) {
      options = {};
    }
    self.options = $.extend({}, defaults, options);
    if (self.options.container === null) {
      self.options.container = $('body');
    }
    self.$loading = $('> .' + self.options.className, self.options.container);
    if (self.$loading.size() === 0) {
      self.$loading = $('<div/>').hide()
        .addClass(self.options.className)
        .appendTo(self.options.container);
    }
    self.$wrapper = self.options.wrapper;
    if (self.$wrapper === null) {
      self.$wrapper = self.options.container;
    }

    self.show = function(closable) {
      if (closable === undefined) {
        closable = true;
      }

      if (self.options.backdrop) {
        self.options.backdrop.closeOnClick = closable;
        self.options.backdrop.closeOnEsc = closable;
        self.options.backdrop.init();
      }

      self.$wrapper.parent().css('overflow', 'hidden');
      self.$wrapper.show();
      if (self.options.backdrop) {
        self.options.backdrop.show();
      }
      self.$loading.show();
      self.position();
    };

    self.position = function() {
      self.$loading.css({
        'margin-left': self.$wrapper.width() / 2 - self.$loading.width() / 2,
        'margin-top': self.$wrapper.height() / 2 - self.$loading.height() / 2,
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'right': '0',
        'top': '0'
      });
      var zIndex = self.options.zIndex;
      if (typeof(zIndex) === 'function') {
        zIndex = zIndex();
      }
      self.$loading.css('zIndex', zIndex);
    };

    self.hide = function() {
      self.$loading.hide();
      self.$wrapper.parent().css('overflow', '');
    };

    return self;
  };

  return {

    parseBodyTag: function(txt) {
      return $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(txt)[0]
          .replace('<body', '<div').replace('</body>', '</div>')).eq(0).html();
    },
    setId: function($el, prefix) {
      if (prefix === undefined) {
        prefix = 'id';
      }
      var id = $el.attr('id');
      if (id === undefined) {
        id = prefix + (Math.floor((1 + Math.random()) * 0x10000)
          .toString(16).substring(1));
      } else {
        /* hopefully we don't screw anything up here... changing the id
         * in some cases so we get a decent selector */
        id = id.replace(/\./g, '-');
      }
      $el.attr('id', id);
      return id;
    },
    bool: function(val) {
      if (typeof(val) === 'string') {
        val = $.trim(val).toLowerCase();
      }
      return ['true', true, 1].indexOf(val) !== -1;
    },
    QueryHelper: QueryHelper,
    ProgressIndicator: ProgressIndicator,
    getAuthenticator: function() {
      return $('input[name="_authenticator"]').val();
    }
  };
});
