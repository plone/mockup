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
      '<label class="hiddenStructure" for="textFilterInput" aria-label="<%- _t("Search") %>"><%- _t("Search") %>"</label>' +
      '<input id="textFilterInput" type="text" class="form-control search-query" placeholder="<%- _t("Search") %>">' +

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
    statusKeyFilter: 'textfilter_status_message_filter',
    statusKeySorting: 'textfilter_status_message_sorting',

    initialize: function(options) {
      BaseView.prototype.initialize.apply(this, [options]);
      this.app = this.options.app;
    },

    setFilterStatusMessage: function() {
      var clear_btn = $('<button type="button" class="btn btn-primary btn-xs"></button>')
        .text(_t('Clear'))
        .off('click.textfilter').on('click.textfilter', function() {
          this.clearFilter();
        }.bind(this));

      var statusTextFilter = _t('This listing has filters applied. Not all items are shown.');
      this.app.setStatus({
        text: statusTextFilter,
        type: 'success',
      }, clear_btn, true, this.statusKeyFilter);

      var statusTextSorting = _t('Drag and drop reordering is disabled while filters are applied.');
      this.app.setStatus({
        text: statusTextSorting,
        type: 'warning'
      }, null, true, this.statusKeySorting);

    },

    clearFilterStatusMessage: function() {
      if (!this.term && !this.app.additionalCriterias.length) {
        this.app.clearStatus(this.statusKeyFilter);
        this.app.clearStatus(this.statusKeySorting);
      }
    },

    setTerm: function(term, set_input, refresh) {
      var term_el = this.$el[0].querySelector('.search-query');
      this.term = encodeURIComponent(term);
      if (set_input) {
        term_el.value = term;
      }
      if (refresh === undefined || refresh == true) {
        this.app.collection.currentPage = 1;
        this.app.collection.pager();
      }
      if (term) {
        term_el.classList.add('has-filter');
        this.setFilterStatusMessage();
      } else {
        var hasquery = false;
        try {
          var qu =this.$queryString.val();
          if (qu && JSON.parse(qu).length > 0) {
            hasquery = true;
          }
        } finally {
          if (! hasquery) {
            term_el.classList.remove('has-filter');
            this.clearFilterStatusMessage();
          }
        }
      }
    },

    setQuery: function(query, set_input) {
      var query_string = null;
      var query_obj = null;
      try {
        if (typeof query === 'string') {
          query_obj = JSON.parse(query);
          query_string = query;
        } else {
          query_string = JSON.stringify(query);
          query_obj = query;
        }
      } catch (e) {
        query_obj = [];
        query_string = '[]';
      }

      if (set_input) {
        this.$queryString.val(query_string);
        // TODO clear query string form
        // this.queryString._init();
      }
      this.app.additionalCriterias = query_obj;
      this.app.collection.currentPage = 1;
      this.app.collection.pager();
      if (query_obj.length) {
        this.button.$el[0].classList.add('has-filter');
        this.setFilterStatusMessage();
      } else if (! this.term) {
        this.button.$el[0].classList.remove('has-filter');
        this.clearFilterStatusMessage();
      }
    },

    clearTerm: function(refresh) {
      this.setTerm('', true, refresh);
    },

    clearFilter: function() {
      this.setTerm('', true);
      this.setQuery([], true);
    },

    render: function() {
      this.$el.html(this.template({_t: _t}));
      this.button = new ButtonView({
        title: _t('Filter'),
        icon: 'filter',
        extraClasses: ['btn-queryfilter', ],
      });
      this.popover = new PopoverView({
        triggerView: this.button,
        id: 'structure-query',
        title: _.template(_t('Filter')),
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
          self.setQuery(self.$queryString.val(), false);
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
        self.setTerm(term_el.val(), false);
      }, this.keyupDelay);
    }
  });

  return TextFilterView;
});
