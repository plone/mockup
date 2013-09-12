define([
  'backbone',
  'structure/models/Result',
  'backbone.paginator'
], function(Backbone, Result) {
"use strict";

  var ResultCollection = Backbone.Paginator.requestPager.extend({
    model: Result,
    queryHelper: null, // need to set
    paginator_core: {
      // the type of the request (GET by default)
      type: 'GET',
      // the type of reply (jsonp by default)
      dataType: 'json',
      url: function(){
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
      perPage: 25
    },
    server_api: {
      query: null,
      batch: function(){
        return JSON.stringify({
          page: this.currentPage,
          size: this.perPage
        });
      },
      attributes: function(){
        return JSON.stringify(this.queryHelper.options.attributes);
      }
    },
    parse: function (response) {
      this.totalRecords = response.total;
      return response.results;
    }
  });

  return ResultCollection;
});
