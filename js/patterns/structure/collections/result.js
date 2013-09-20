// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
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
  'backbone',
  'structure/models/result',
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
      perPage: 15
    },
    server_api: {
      query: function(){
        return JSON.stringify({
          criteria: this.queryHelper.getCriterias()
        });
      },
      batch: function(){
        this.queryHelper.options.batchSize = this.perPage;
        return JSON.stringify(this.queryHelper.getBatch(this.currentPage));
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
