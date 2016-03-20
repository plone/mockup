define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-structure-url/js/models/result',
  'mockup-utils',
  'backbone.paginator'
], function($, _, Backbone, Result, Utils) {
  'use strict';

  var ResultCollection = Backbone.Paginator.requestPager.extend({
    model: Result,
    initialize: function(models, options) {
      this.options = options;
      this.view = options.view;
      this.url = options.url;

      this.queryHelper = Utils.QueryHelper(
        $.extend(true, {}, this.view.options, {
          attributes: this.view.options.queryHelperAttributes
        }));

      this.queryParser = function(options) {
        var self = this;
        if (options === undefined) {
          options = {};
        }
        var term = null;
        if (self.view.toolbar) {
          term = self.view.toolbar.get('filter').term;
        }
        var sortOn = self.view.sort_on; // jshint ignore:line
        var sortOrder = self.view.sort_order; // jshint ignore:line
        if (!sortOn) {
          sortOn = 'getObjPositionInParent';
        }
        return JSON.stringify({
          criteria: self.queryHelper.getCriterias(term, $.extend({}, options, {
            additionalCriterias: self.view.additionalCriterias
          })),
          sort_on: sortOn,
          sort_order: sortOrder
        });
      };

      // check and see if a hash is provided for initial path
      if (window.location.hash.substring(0, 2) === '#/') {
        this.queryHelper.currentPath = window.location.hash.substring(1);
      }

      Backbone.Paginator.requestPager.prototype.initialize.apply(this, [models, options]);
    },
    getCurrentPath: function() {
      return this.queryHelper.getCurrentPath();
    },
    setCurrentPath: function(path) {
      this.queryHelper.currentPath = path;
    },
    pager: function() {
      this.trigger('pager');
      Backbone.Paginator.requestPager.prototype.pager.apply(this, []);
    },
    paginator_core: {
      // the type of the request (GET by default)
      type: 'GET',
      // the type of reply (jsonp by default)
      dataType: 'json',
      url: function() {
        return this.url;
      }
    },
    paginator_ui: {
      // the lowest page index your API allows to be accessed
      firstPage: 1,
      // which page should the paginator start from
      // (also, the actual page the paginator is on)
      currentPage: 1,
      // how many items per page should be shown
      perPage: 15
    },
    // server_api are query parameters passed directly (currently GET
    // parameters).  These are currently generated using following
    // functions.  Renamed to queryParams in Backbone.Paginator 2.0.
    server_api: {
      query: function() {
        return this.queryParser();
      },
      batch: function() {
        this.queryHelper.options.batchSize = this.perPage;
        return JSON.stringify(this.queryHelper.getBatch(this.currentPage));
      },
      attributes: function() {
        return JSON.stringify(this.queryHelper.options.attributes);
      }
    },
    parse: function(response, baseSortIdx) {
      if (baseSortIdx === undefined) {
        baseSortIdx = 0;
      }
      this.totalRecords = response.total;
      var results = response.results;
      // XXX manually set sort order here since backbone will otherwise
      // do arbitrary sorting?
      _.each(results, function(item, idx) {
        item._sort = idx;
      });
      return results;
    },
    comparator: '_sort'
  });

  return ResultCollection;
});
