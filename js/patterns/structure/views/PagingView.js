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
  'jquery',
  'underscore',
  'backbone',
  'text!structure/templates/paging.html',
], function($, _, Backbone, PagingTemplate) {
  "use strict";


  var PagingView = Backbone.View.extend({
    events: {
      'click a.servernext': 'nextResultPage',
      'click a.serverprevious': 'previousResultPage',
      'click a.serverlast': 'gotoLast',
      'click a.page': 'gotoPage',
      'click a.serverfirst': 'gotoFirst',
      'click a.serverpage': 'gotoPage',
      'click .serverhowmany a': 'changeCount'
    },

    tagName: 'aside',
    template: _.template(PagingTemplate),

    initialize: function () {
      this.app = this.options.app;
      this.collection = this.app.collection;
      this.collection.on('reset', this.render, this);
      this.collection.on('sync', this.render, this);

      this.$el.appendTo('#pagination');

    },

    render: function () {
      var html = this.template(this.collection.info());
      this.$el.html(html);
      return this;
    },

    nextResultPage: function (e) {
      e.preventDefault();
      this.collection.requestNextPage();
    },

    previousResultPage: function (e) {
      e.preventDefault();
      this.collection.requestPreviousPage();
    },

    gotoFirst: function (e) {
      e.preventDefault();
      this.collection.goTo(this.collection.information.firstPage);
    },

    gotoLast: function (e) {
      e.preventDefault();
      this.collection.goTo(this.collection.information.lastPage);
    },

    gotoPage: function (e) {
      e.preventDefault();
      var page = $(e.target).text();
      this.collection.goTo(page);
    },

    changeCount: function (e) {
      e.preventDefault();
      var per = $(e.target).text();
      this.collection.howManyPer(per);
    }
  });

  return PagingView;
});
