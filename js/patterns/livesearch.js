/* Livesearch pattern.
 *
 * Options:
 *    url(string): The server-side url that will be queried. (null)
 *    delay(integer): Delay in ms after user types before searching. (200)
 *    highlight(string): CSS class that will be used to highlight items on keyboard navigation. ('pattern-livesearch-highlight')
 *    minimumInputLength(integer): Number of characters user must type before search begins. (3)
 *    input(string): Selector for element that will be used for the livesearch input. ('.pattern-livesearch-input')
 *    toggleTarget(string): Selector for element that will be shown when results are found. ('.pattern-livesearch-container')
 *    toggleClass(string): CSS class that will be added to target toggle element when results are found. ('show')
 *    positionToggleWithInput(boolean): Whether or not the toggle element should be positioned relative to the input element. If set to false setPosition() will not be called. (true)
 *    setPosition(function): Function which will be used to set the position of the toggle element. (look at source)
 *    resultsTarget(string): Selector for element where results from the server will be inserted. ('.pattern-livesearch-results')
 *    resultsContainerTemplate(string): Template for the element that will contain results. If resultContainerTemplateSelector is set, this will not be used. ('<ul></ul>')
 *    resultsContainerTemplateSelector(string): Selector for an element in the DOM to use in place of resultContainerTemplate. (null)
 *    resultsAppendTo(string): Selector for element within results to append to ('ul')
 *    resultSelector(string): Will be used to select result items from within the result container. ('.pattern-livesearch-result')
 *    resultTemplate(string): Will be used to select result items from within the result container. ('<li class="pat-livesearch-result pat-livesearch-type-<%= Type %>"><a class="pat-livesearch-result-title" href="<%= getURL %>"><%= Title %></a><p class="pat-livesearch-result-desc"><%= Description %></p></li>')
 *    resultTemplateSelector(string): Selector for element to be used in place of resultTemplate. (null)
 *    helpTemplate(string): Template for the element that will contain help messages, such as 'No results found.' or 'Type 3 more characters to search.' ('<div class="pattern-livesearch-help"><%= help %></div>')
 *    helpTemplateSelector(string): Element in the DOM to be used instead of helpTemplate. (null)
 *    typeMoreTemplate(string): Template for message which is displayed if the current input length is less than minimumInputLength. ('Type <%= more %> more character<%= more === 1 ? "" : "s" %> to search.')
 *    typeMoreTemplateSelector(string): Element in the DOM to be used instead of typeMoreTemplate. (null)
 *    noResultsTemplate(string): Template for message that is displayed after a search when no results were found. ('No results found.')
 *    noResultsTemplateSelector(string): Element in the DOM to be used instead of noResultsTemplate. (null)
 *    searchingTemplate(string): Template for message which will be displayed after a search has started and before it has ended. ('Searching...')
 *    searchingTemplateSelector(string): Element in the DOM to be used instead of searchingTemplate. (null)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-livesearch"
 *         data-pat-livesearch="url: /search.json;">
 *      <input type="text" class="pat-livesearch-input" placeholder="Search" />
 *      <div class="pat-livesearch-container">
 *        <div class="pat-livesearch-results"></div>
 *      </div>
 *    </div>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'underscore',
  'mockup-patterns-base',
  'mockup-patterns-toggle',
  'mockup-patterns-select2', // TODO: is this still a dependency
  'mockup-utils'
], function($, _, Base, Toggle, Select2, utils) {
  "use strict";

  var Livesearch = Base.extend({
    name: "livesearch",
    timeout: null,
    blurTimout: null,
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
      url: null, // must be set in order to work
      delay: 200,
      blurDelay: 200,
      highlight: 'pattern-livesearch-highlight', // class to add to items when selected
      minimumInputLength: 3, // number of chars user should type before searching
      toggleTarget: '.pattern-livesearch-container', // the element to show/hide when performing search
      toggleClass: 'show',
      positionToggleWithInput: true,
      resultsTarget: '.pattern-livesearch-results', // the element to fill with results
      input: '.pattern-livesearch-input', // input selector
      resultsContainerTemplate: '<ul></ul>',
      resultsContainerTemplateSelector: null,
      resultsAppendTo: 'ul', // selector for element within results to append to.
      resultSelector: '.pattern-livesearch-result',
      resultTemplate: '' +
        '<li class="pattern-livesearch-result pattern-livesearch-type-<%= Type %>">' +
          '<a class="pattern-livesearch-result-title" href="<%= getURL %>">' +
            '<%= Title %>' +
          '</a>' +
          '<p class="pattern-livesearch-result-desc"><%= Description %></p>' +
        '</li>',
      resultTemplateSelector: null,
      helpTemplate: '<div class="pattern-livesearch-help"><%= help %></div>',
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
      self.query = new utils.QueryHelper(
          $.extend(true, {}, self.options, {pattern: self}));

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
        window.clearInterval(self.blurTimeout);
        self.show();
      });

      self.$input.on('blur.livesearch.patterns', function(e) {
        self.blurTimeout = window.setInterval(function(){
          self.hide();
          window.clearInterval(self.blurTimeout);
        }, self.options.blurDelay);
      });

      if (self.options.toggleTarget) {
        self.$toggle = $(self.options.toggleTarget, self.$el);
        if (self.$toggle.length) {
          $('html').on('click.livesearch.patterns', function() {
            self.hide();
          });
          self.$toggle.on('click.livesearch.patterns', function(event) {
            event.stopPropagation();
            window.clearInterval(self.blurTimeout);
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
      window.clearInterval(self.timeout);
      $.get(
        self.options.ajax.url,
        $.param(params),
        function(data) {
          if(data.results !== undefined){
            self.cache[term] = data.results;
          }else{
            console.log('error from server returning result');
          }

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

    renderJsonResults: function(data) {
      var self = this;
      var html = '';
      if (data.length > 0) {
        $.each(data, function(index, value){
          html += self.applyTemplate('result', value);
        });
      } else {
        html = self.renderHelp('noResults', {});
      }
      return html;
    },

    render: function(event) {
      var self = this;

      // Don't do anything if we have already rendered for this term
      if (self.currentTerm === self.renderedTerm) {
        return;
      }

      var container = $('<div />');

      if (event.type === 'searching') {
        container.html(self.renderHelp('searching', {}));
      } else {
        self.renderedTerm = self.currentTerm;
        if (self.currentTerm === null || self.currentTerm.length < self.options.minimumInputLength) {
          var chars = self.currentTerm !== null ? self.options.minimumInputLength - self.currentTerm.length : self.options.minimumInputLength;
          container.html(self.renderHelp('typeMore', {more: chars}));
        } else {
          var data = self.getCache();
          container.html(self.applyTemplate('resultsContainer', self));
          var appendTo = container.find(self.options.resultsAppendTo);
          if (appendTo.length === 0) {
            appendTo = container;
          }
          if (data) {
            appendTo.append(self.renderJsonResults(data));
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
      var className = self.options.highlight;
      self.trigger('hiding');
      if (self.$toggle) {
        self.$toggle.removeClass(self.options.toggleClass);
      }
      $('.'+className, self.$results).removeClass(className);
      self.trigger('hidden');
    },

    items: function() {
      return this.$results.find(this.options.resultSelector);
    },

    _keyUp: function() {
      var self = this;
      var className = self.options.highlight;
      var selected = $('.'+className, self.$results);

      if (selected.length > 0) {
        if (selected.prev().length > 0) {
          selected.removeClass(className);
          selected = selected.prev().addClass(className);
        }
      }
    },

    _keyDown: function() {
      var self = this;
      var className = self.options.highlight;
      var selected = $('.'+className, self.$results);

      if (selected.length === 0) {
        selected = self.items().first().addClass(className);
      } else {
        if (selected.next().length > 0) {
          selected.removeClass(className);
          selected = selected.next().addClass(className);
        }
      }
    },

    _keyEscape: function() {
      this.$input.trigger('blur.livesearch.patterns');
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
        switch (event.which) {
          case 13:
            self._keyEnter();
            return false;
          case 27:
            self._keyEscape();
            break;
          case 38: break; // up arrow
          case 40: break; // down arrow
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
        switch (event.which) {
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
