// tabs pattern.
//
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
  'mockup-patterns-base',
  'underscore',
  'backbone',
  'mockup-patterns-queryhelper',
  'text!templates/paginator.html',
  'button-groups',
  'backbone.paginator'
], function($, Base, _, backbone, QueryHelper, PaginatorTemplate) {
  "use strict";

  var Button = backbone.Model.extend({

    defaults: function(){
      return {
        title: 'Button',
        click: function(e){
          e.preventDefault();
        }
      };
    }
  });

  var Result = backbone.Model.extend({

    defaults: function(){
      return {
        is_folderish: false
      };
    }
  });


  var ResultCollection = backbone.Paginator.extend({
    model: Result,
    queryHelper: null, // need to set
    paginator_core: {
      // the type of the request (GET by default)
      type: 'GET',
      // the type of reply (jsonp by default)
      dataType: 'json'
    },
    paginator_ui: {
      // the lowest page index your API allows to be accessed
      firstPage: 1,
      // which page should the paginator start from 
      // (also, the actual page the paginator is on)
      currentPage: 1,
      // how many items per page should be shown
      perPage: 20,
    },
    server_api: {
      // number of items to return per request/page
      'per_page': function() {
        return this.perPage;
      },
      // how many results the request should skip ahead to
      'page': function() {
        return this.currentPage;
      },
      // field to sort by
      'sort': function() {
        if(this.sortField === undefined){
          return 'created';
        }
        return this.sortField;
      },
    },
    parse: function (response) {
      this.totalRecords = response.total;
      return response.results;
    },
    fetch: function(options) {
      debugger;
      if(!options){
        options = {};
      }
      var data = (options.data || {});
      options.data = {
       attributes: JSON.stringify(this.queryHelper.options.attributes),
      };
      return backbone.Paginator.prototype.fetch.call(this, options);
    }
  });

  var ButtonView = backbone.View.extend({
    tagName: 'li',
    template: _.template('<a href="#"><%- title %></a>'),
    events: {
      'click a': 'handleClick'
    },
    handleClick: function(e){
      return this.model.click(e);
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });


  var ModifyButtonsView = backbone.View.extend({
    tagName: 'div',
    template: _.template(
      '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' +
        'Modify' +
        '<span class="caret"></span>' +
      '</a>' +
      '<ul class="dropdown-menu">' +
      '</ul>'),
    render: function() {
      this.$el.html(this.template({}));
      var btnContainer = this.$('ul');
      _.each(this.options.buttons, function(btn){
        var view = (new ButtonView({model: btn})).render();
        btnContainer.append(view.el);
      });
      this.$el.addClass('btn-group');
      this.$('.dropdown-toggle').dropdown();
      return this;
    },
  });


  var TableRowView = backbone.View.extend({
    tagName: 'tr',
    template: _.template(
      '<td><input type="checkbox" /></td>' +
      '<td><a href="<%- getURL %>"><%- Title %></td></a>' +
      '<td><%- ModificationDate %></td>' +
      '<td><%- EffectiveDate %></td>' +
      '<td><%- review_state %></td>'),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      var attrs = this.model.attributes;
      this.$el.addClass('state-' + attrs.review_state).
        addClass('type-' + attrs.Type);
      if(attrs.is_folderish){
        this.$el.addClass('folder');
      }
      return this;
    },
  });


  var TableView = backbone.View.extend({
    tagName: 'table',
    template: _.template(
      '<thead>' +
        '<tr>' +
          '<th colspan="2">Title</th>' +
          '<th>Last Modified</th>' +
          '<th>Published on</th>' +
          '<th>State</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
      '</tbody>'),
    initialize: function(){
      this.collection = this.options.collection;
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'all', this.render);
      this.collection.fetch();
    },
    render: function() {
      this.$el.html(this.template({}));
      this.$el.addClass('table').addClass('table-striped').
        addClass('table-bordered');
      if(this.collection.length){
        var container = this.$('tbody');
        this.collection.each(function(result){
          var view = (new TableRowView({model: result})).render();
          container.append(view.el);
        });
      }
      return this;
    },
  });


  var PagingView = backbone.View.extend({
    events: {
      'click a.servernext': 'nextResultPage',
      'click a.serverprevious': 'previousResultPage',
      'click a.orderUpdate': 'updateSortBy',
      'click a.serverlast': 'gotoLast',
      'click a.page': 'gotoPage',
      'click a.serverfirst': 'gotoFirst',
      'click a.serverpage': 'gotoPage',
      'click .serverhowmany a': 'changeCount'

    },

    tagName: 'aside',
    template: _.template(PaginatorTemplate),

    initialize: function () {

      this.collection.on('reset', this.render, this);
      this.collection.on('sync', this.render, this);

      this.$el.appendTo('#pagination');

    },

    render: function () {
      var html = this.template(this.collection.info());
      this.$el.html(html);
    },

    updateSortBy: function (e) {
      e.preventDefault();
      var currentSort = $('#sortByField').val();
      this.collection.updateOrder(currentSort);
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


  var WellView = backbone.View.extend({
    tagName: 'div',
    render: function(){
      this.$el.addClass('well');
      return this;
    }
  });


  var StructureView = backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      this.buttons_view = new ModifyButtonsView({
        buttons: [
          new Button({title: 'Cut'}),
          new Button({title: 'Copy'}),
          new Button({title: 'Delete'}),
          new Button({title: 'Workflow'}),
          new Button({title: 'Tags'}),
          new Button({title: 'Dates'})
        ]
      });
      this.collection = new ResultCollection([], {
        url: this.options.collection_url
      });
      this.collection.queryHelper = this.options.queryHelper;
      this.table_view = new TableView({collection: this.collection});
      this.well_view = new WellView({table_view: this.table_view});
      this.paging_view = new PagingView({collection: this.collection});
    },
    render: function(){
      this.$el.append(this.buttons_view.render().el);
      this.$el.append(this.table_view.render().el);
      this.$el.append(this.paging_view.render().el);
      this.$el.append(this.well_view.render().el);
      return this;
    }
  });

  var Structure = Base.extend({
    name: 'structure',
    defaults: {
      ajaxvocabulary: null,
      attributes: ['UID', 'Title', 'Type', 'path', 'review_state',
                   'ModificationDate', 'EffectiveDate', 'CreationDate',
                   'is_folderish'],
      startPath: '/'
    },
    init: function() {
      var self = this;
      self.view = new StructureView({
        collection_url: self.options.ajaxvocabulary,
        queryHelper: new QueryHelper(self.$el,
          $.extend(true, {}, self.options, {basePattern: self}))
      });
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});

