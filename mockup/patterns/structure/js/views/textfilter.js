define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/base',
  'mockup-ui-url/views/button',
  'mockup-ui-url/views/popover',
  'mockup-patterns-querystring',
  'translate'
], function($, _, BaseView, ButtonView, PopoverView, QueryString, _t) {
  'use strict';

  var TextFilterView = BaseView.extend({
    tagName: 'div',
    className: 'navbar-search form-search ui-offset-parent',
    template: _.template(
      '<div class="input-group">' +
      '<input type="text" class="form-control search-query" placeholder="<%- _t("Filter") %>">' +
      '<span class="input-group-btn">' +
      '</span>' +
      '</div>'
    ),
    popoverContent: _.template(
      '<input class="pat-querystring" />'
    ),
    events: {
      'keyup .search-query': 'filter'
    },
    term: null,
    timeoutId: null,
    keyupDelay: 300,
    filterStatusMessage: null,

    initialize: function(options) {
      BaseView.prototype.initialize.apply(this, [options]);
      this.app = this.options.app;
    },

    setFilterStatusMessage: function() {
      if (!this.filterStatusMessage) {

        var clear_btn = $('<button type="button" class="btn btn-danger btn-xs"></button>')
          .text(_t('Clear filter'))
          .on('click', function() {
            this.clearFilter();
          }.bind(this));

        this.filterStatusMessage = this.app.setStatus({
          label: _t('Some filters applied'),
          text: _t('This listing has filters applied. Not all items are shown.'),
          type: 'warning'
        }, clear_btn, true);
      }
    },

    clearFilterStatusMessage: function() {
      if (this.filterStatusMessage && !this.term && !this.app.additionalCriterias.length) {
        this.app.clearStatus(this.filterStatusMessage);
        this.filterStatusMessage = null;
      }
    },

    setTerm: function(term) {
      var term_el = this.$el[0].querySelector('.search-query');
      this.term = term;
      term_el.value = term;
      this.app.collection.currentPage = 1;
      this.app.collection.pager();
      if (term) {
        term_el.classList.add('has-filter');
        this.setFilterStatusMessage();
      } else {
        term_el.classList.remove('has-filter');
      }
    },

    setQuery: function(query) {
      this.$queryString.val(JSON.stringify(query));
      this.app.additionalCriterias = query;
      this.app.collection.currentPage = 1;
      this.app.collection.pager();
      if (query.length) {
        this.button.$el[0].classList.add('has-filter');
        this.setFilterStatusMessage();
      } else {
        this.button.$el[0].classList.remove('has-filter');
      }
    },

    clearFilter: function() {
      this.setTerm('');
      this.setQuery([]);
      this.clearFilterStatusMessage();
      this.app.clearStatus();
    },

    render: function() {
      this.$el.html(this.template({_t: _t}));
      this.button = new ButtonView({
        tooltip: _t('Filter'),
        icon: 'filter'
      });
      this.popover = new PopoverView({
        triggerView: this.button,
        id: 'structure-query',
        title: _.template(_t('Query')),
        content: this.popoverContent,
        placement: 'left'
      });
      this.$('.input-group-btn').append(this.button.render().el);
      this.$el.append(this.popover.render().el);
      this.popover.$el.addClass('query');
      this.$queryString = this.popover.$('input.pat-querystring');
      this.queryString = new QueryString(
        this.$queryString, {
          indexOptionsUrl: this.app.options.indexOptionsUrl,
          showPreviews: false
        });
      var self = this;
      self.queryString.$el.on('change', function() {
        if (self.timeoutId) {
          clearTimeout(self.timeoutId);
        }
        self.timeoutId = setTimeout(function() {
          var criterias = $.parseJSON(self.$queryString.val());
          if (criterias.length > 0) {
            self.button.$el[0].classList.add('has-filter');
            self.setFilterStatusMessage();
          } else {
            self.button.$el[0].classList.remove('has-filter');
            self.clearFilterStatusMessage();
          }
          self.app.additionalCriterias = criterias;
          self.app.collection.currentPage = 1;
          self.app.collection.pager();
        }, this.keyupDelay);
      });
      self.queryString.$el.on('initialized', function() {
        self.queryString.$sortOn.on('change', function() {
          self.app['sort_on'] = self.queryString.$sortOn.val(); // jshint ignore:line
          self.app.collection.currentPage = 1;
          self.app.collection.pager();
        });
        self.queryString.$sortOrder.change(function() {
          if (self.queryString.$sortOrder[0].checked) {
            self.app['sort_order'] = 'reverse'; // jshint ignore:line
          } else {
            self.app['sort_order'] = 'ascending'; // jshint ignore:line
          }
          self.app.collection.currentPage = 1;
          self.app.collection.pager();
        });
      });
      return this;
    },

    filter: function(event) {
      var self = this;
      if (self.timeoutId) {
        clearTimeout(self.timeoutId);
      }
      self.timeoutId = setTimeout(function() {
        var term_el = $(event.currentTarget);
        self.term = encodeURIComponent(term_el.val());
        self.app.collection.currentPage = 1;
        self.app.collection.pager();

        if (!self.term) {
            term_el[0].classList.remove('has-filter');
            self.clearFilterStatusMessage();
        } else {
          term_el[0].classList.add('has-filter');
          self.setFilterStatusMessage();
        }

      }, this.keyupDelay);
    }
  });

  return TextFilterView;
});
