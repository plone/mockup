// Pattern which Plone livesearch functionality on an input
//
// Author: Ryan Foster
// Contact: ryan@rynamic.com
// Version: 1.0
//
// Adapted from livesearch.js in Plone.
//
// License:
//
// Copyright (C) 2013 Plone Foundation
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
  'mockup-patterns-base',
  'mockup-patterns-toggle',
  'mockup-patterns-select2',
  'mockup-patterns-queryhelper'
], function($, _, Base, Toggle, Select2, QueryHelper) {
  "use strict";

  var Livesearch = Base.extend({
    name: "livesearch",
    timeout: null,
    $results: null,
    $input: null,
    $toggle: null,
    cache: {},
    currentTerm: null,
    renderedTerm: '',
    results: '',
    index: null,
    testTarget: null,
    defaults: {
      ajaxvocabulary: null, // must be set in order to work
      delay: 200,
      highlight: 'pat-livesearch-highlight', // class to add to items when selected
      minimumInputLength: 3, // number of chars user should type before searching
      toggleTarget: '.pat-livesearch-container', // the element to show/hide when performing search
      toggleClass: 'show',
      positionToggleWithInput: true,
      resultsTarget: '.pat-livesearch-results', // the element to fill with results
      input: '.pat-livesearch-input', // input selector
      resultsContainerTemplate: '<ul></ul>',
      resultsContainerTemplateSelector: null,
      resultsAppendTo: 'ul', // selector for element within results to append to.
      resultSelector: '.pat-livesearch-result',
      resultTemplate: '' +
        '<li class="pat-livesearch-result pat-livesearch-type-<%= Type %>">' +
          '<a class="pat-livesearch-result-title" href="<%= getURL %>">' +
            '<%= Title %>' +
          '</a>' +
          '<p class="pat-livesearch-result-desc"><%= Description %></p>' +
        '</li>',
      resultTemplateSelector: null,
      helpTemplate: '<div class="pat-livesearch-help"><%= help %></div>',
      helpTemplateSelector: null,
      typeMoreTemplate: 'Type <%= more %> more character<%= more === 1 ? "" : "s" %> to search.',
      typeMoreTemplateSelector: null,
      noResultsTemplate: 'No results found.',
      noResultsTemplateSelector: null,
      searchingTemplate: 'Searching...',
      searchingTemplateSelector: null,
      isTest: false,
      setPosition: function() {
        var self = this;
        if (self.options.positionToggleWithInput) {
          var top = self.$input.position().top + self.$input.outerHeight();
          self.$toggle.css({'top': top+'px'});
        }
      }
    },

    init: function() {
      var self = this;
      self.query = new QueryHelper(self.$el,
        $.extend(true, {}, self.options, {basePattern: self}));

      this.$results = $(self.options.resultsTarget, self.$el);

      if (!self.query.valid) {
        $.error('No url provided for livesearch results ' + self.$el);
      }

      if(self.query.valid){
        self.options.ajax = self.query.selectAjax();
      }
      else {
        self.options.tags = [];
      }

      self.$input = $(self.options.input, self.$el);

      if (self.$input.length < 1) {
        $.error('Input element not found ' + self.$el);
      }

      self.$input.on('focus.livesearch.patterns', function(e) {
        self.show();
      });

      self.$input.on('blur.livesearch.patterns', function(e) {
        self.hide();
      });

      if (self.options.toggleTarget) {
        self.$toggle = $(self.options.toggleTarget, self.$el);
        if (self.$toggle.length) {
          $('html').on('click.livesearch.patterns', function() {
            self.hide();
          });
          self.$toggle.on('click.livesearch.patterns', function(event) {
            event.stopPropagation();
          });
          self.$input.on('click.livesearch.patterns', function(event) {
            event.stopPropagation();
          });
        }

      }

      self.$input.on('keyup keydown', function(event) {
        return self._handler(event);
      });

      self.on('showing.livesearch.patterns', function(event) {
        self.render(event);
      });
      self.on('searched.livesearch.patterns', function(event) {
        self.render(event);
      });
      self.on('render.livesearch.patterns', function(event) {
        self.render(event);
      });
      self.on('searching.livesearch.patterns', function(event) {
        self.render(event);
      });
      self.on('cachedresult.livesearch.patterns', function(event) {
        self.render(event);
      });
    },

    search: function() {
      var self = this;
      var term = self.currentTerm;
      self.trigger('searching');

      if (self.cache[term] !== undefined) {
        // already have results, do not load ajax
        self.trigger('cachedresult');
        return;
      }

      var params = self.options.ajax.data(term, 1);

      $.get(
        self.options.ajax.url,
        $.param(params),
        function(data) {
          if(data.results !== undefined){
            self.cache[term] = data.results;
          }else{
            console.log('error from server returning result');
          }
          window.clearInterval(self.timeout);
          self.trigger('searched');
        }
      );
    },

    applyTemplate: function(tpl, item) {
      var self = this;
      var template;
      if (self.options[tpl+'TemplateSelector']) {
        template = $(self.options[tpl+'TemplateSelector']).html();
        if (!template) {
          template = self.options[tpl+'Template'];
        }
      } else {
        template = self.options[tpl+'Template'];
      }
      return _.template(template, item);
    },

    getCache: function() {
      var self = this;
      var data = [];
      if (self.currentTerm !== null && self.currentTerm.length >= self.options.minimumInputLength) {
        if (self.cache[self.currentTerm] !== undefined) {
          data = self.cache[self.currentTerm];
        }
      }
      return data;
    },

    renderHelp: function(tpl, data) {
      var self = this;
      var msg = self.applyTemplate(tpl, data);
      return self.applyTemplate('help', {help: msg});
    },

    render: function(event) {
      var self = this;

      // Don't do anything if we have already rendered for this term
      if (self.currentTerm === self.renderedTerm) {
        return;
      }

      var container = $(self.applyTemplate('resultsContainer', self));

      if (event.type === 'searching') {
        container.html(self.renderHelp('searching', {}));
      } else {
        self.renderedTerm = self.currentTerm;
        if (self.currentTerm === null || self.currentTerm.length < self.options.minimumInputLength) {
          var chars = self.currentTerm !== null ? self.options.minimumInputLength - self.currentTerm.length : self.options.minimumInputLength;
          container.html(self.renderHelp('typeMore', {more: chars}));
        } else {
          var data = self.getCache();
          var appendTo = container.find(self.options.resultsAppendTo);
          if (appendTo.length === 0) {
            appendTo = container;
          }
          if (data.length > 0) {
            $.each(data, function(index, value){
              appendTo.append(self.applyTemplate('result', value));
            });
          } else {
            container.html(self.renderHelp('noResults', {}));
          }
        }
      }

      self.options.setPosition.apply(self);
      self.$results.html(container);
      self.trigger('rendered');
    },

    show: function() {
      var self = this;
      self.trigger('showing');
      if (self.$toggle) {
        self.$toggle.addClass(self.options.toggleClass);
      }
      self.trigger('shown');
    },

    hide: function() {
      var self = this;
      var klass = self.options.highlight;
      self.trigger('hiding');
      if (self.$toggle) {
        self.$toggle.removeClass(self.options.toggleClass);
      }
      $('.'+klass, self.$results).removeClass(klass);
      self.trigger('hidden');
    },

    items: function() {
      return this.$results.find(this.options.resultSelector);
    },

    _keyUp: function() {
      var self = this;
      var klass = self.options.highlight;
      var selected = $('.'+klass, self.$results);

      if (selected.length > 0) {
        if (selected.prev().length > 0) {
          selected.removeClass(klass);
          selected = selected.prev().addClass(klass);
        }
      }
    },

    _keyDown: function() {
      var self = this;
      var klass = self.options.highlight;
      var selected = $('.'+klass, self.$results);

      if (selected.length === 0) {
        selected = self.items().first().addClass(klass);
      } else {
        if (selected.next().length > 0) {
          selected.removeClass(klass);
          selected = selected.next().addClass(klass);
        }
      }
    },

    _keyEscape: function() {
      this.$input.trigger('blur');
    },

    _keyEnter: function() {
      var self = this;
      var hl = self.options.highlight;
      var target = self.$results.find('.'+hl)
        .find('a').attr('href');
      if (self.options.isTest) {
        self.testTarget = target;
        return;
      }
      window.location = target;
    },

    _handler: function(event) {
      var self = this;
      window.clearTimeout(self.timeout);
      if (event.type === 'keyup') {
        switch (event.keyCode) {
          case 13:
            self._keyEnter();
            return false;
          case 27:
            self._keyEscape();
            break;
          case 38: break;
          case 40: break;
          case 37: break; // keyLeft
          case 39: break; // keyRight
          default:
            self.currentTerm = self.$input.val();
            if (self.$input.val().length >= self.options.minimumInputLength) {
              self.timeout = window.setInterval(function(){
                try{
                  self.search();
                }catch(e){
                  console.log('error trying to search');
                  window.clearInterval(self.timeout);
                }
              }, self.options.delay);
            } else {
              self.trigger('render');
            }

        }
      } else if (event.type === 'keydown') {
        switch (event.keyCode) {
          case 38:
            self._keyUp();
            return false;
          case 40:
            self._keyDown();
            return false;
        }
      }
    }

  });

  return Livesearch;

});
