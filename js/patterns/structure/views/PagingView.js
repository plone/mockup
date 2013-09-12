
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
