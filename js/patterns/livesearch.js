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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
  'js/patterns/toggle',
  'underscore',
  'js/patterns/select2',
  'js/patterns/queryhelper'
], function($, Base, Toggle, _, Select2, QueryHelper) {
  "use strict";

  var Livesearch = Base.extend({
    name: "livesearch",
    timeout: null,
    $results: null,
    $input: null,
    $toggle: null,
    $selected: null,
    cache: {},
    index: null,
    defaults: {
      delay: 400,
      highlight: 'pat-livesearch-highlight', // class to add to items when selected
      chars: 3, // number of chars user should type before searching
      toggle: {
        target: '.pat-livesearch-container', // the element to show/hide when performing search
        klass: 'show'
      },
      resultsTarget: '.pat-livesearch-results', // the element to fill with results
      input: '.pat-livesearch-input', // input selector
      resultContainerTemplate: '<ul></ul>',
      resultContainerTemplateSelector: null,
      dropdownCssClass: 'pat-livesearch-dropdown',
      linkSelector: '.pat-livesearch-result-title',
      itemSelector: '.pat-livesearch-result',
      resultTemplate: '' +
        '<li class="pat-livesearch-result pat-livesearch-type-<%= Type %>">' +
          '<a class="pat-livesearch-result-title" href="<%= getURL %>">' +
            '<%= Title %>' +
          '</a>' +
          '<p class="pat-livesearch-result-desc"><%= Description %></p>' +
        '</li>',
      resultTemplateSelector: null,
      searchHelpTemplate: '<div class="pat-livesearch-help"><%= help %></div>',
      searchHelpTemplateSelector: null,
      typeMoreTemplate: 'Type <%= more %> more characters to search.',
      typeMoreTemplateSelector: null,
      noResultsTemplate: 'No results found.',
      noResultsTemplateSelector: null,
      isTest: false
    },

    init: function() {
      var self = this;
      self.query = new QueryHelper(self.$el, self.options);
      self.query.init(self);

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

      if (self.options.toggle.target) {
        self.$toggle = $(self.options.toggle.target, self.$el);
        if (self.$toggle.length) {
          self.$toggle.on('click.livesearch.patterns', function(event) {
            event.stopPropagation();
          });
          $('html').on('click.livesearch.patterns', function() {
            self.hide();
          });
          self.$input.on('click.livesearch.patterns', function(e) {
            e.stopPropagation();
          });
        }

      }

      self.$input.on('keyup', function(event) {
        return self._handler(event);
      });
    },

    search: function() {
      var self = this;
      var term = this.$input.val();
      self.trigger('searching');

      if (self.cache[term]) {
        // already have results, do not load ajax
        self.fillResults(self.cache[term]);
        return;
      }

      var params = self.options.ajax.data(term, 1);

      $.get(
        self.options.ajax.url,
        $.param(params),
        function(data) {
          self.cache[term] = data.results;
          if(data.results !== undefined){
            self.fillResults(data.results);
          }else{
            console.log('error from server returning result');
          }
          self.cache[term] = data;
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

    fillResults: function(data) {
      var self = this;
      if (self.$results.length > 0) {
        var container = $(self.applyTemplate('resultContainer', self));
        $.each(data, function(index, value){
          container.append(self.applyTemplate('result', value));
        });
        self.$results.html(container);
        self.show();
        window.clearInterval(self.timeout);
      }
    },

    show: function() {
      var self = this;
      self.trigger('showing');
      if (self.$toggle) {
        self.$toggle.addClass(self.options.toggle.klass);
      }
      self.trigger('shown');
    },

    hide: function() {
      var self = this;
      self.trigger('hiding');
      if (self.$toggle) {
        self.$toggle.removeClass(self.options.toggle.klass);
      }
      self.trigger('hidden');
    },

    items: function() {
      return this.$results.find(this.options.itemSelector);
    },

    _keyUp: function() {
      var self = this;
      var hl = self.options.highlight;
      if (self.index === null || self.index === 0) {
        self.index = self.items().length - 1;
      } else {
        self.index -= 1;
      }
      if (self.$selected !== null) self.$selected.removeClass(hl);
      self.$selected = $(self.items()[self.index]);
      self.$selected.addClass(hl);
    },

    _keyDown: function() {
      var self = this;
      var hl = self.options.highlight;
      if (self.index === null || self.index === self.items().length-1) {
        self.index = 0;
      } else {
        self.index += 1;
      }
      if (self.$selected !== null) self.$selected.removeClass(hl);
      self.$selected = $(self.items()[self.index]);
      self.$selected.addClass(hl);
    },

    _keyEscape: function() {
      this.hide();
    },

    _keyEnter: function() {
      var self = this;
      var hl = self.options.highlight;
      var target = self.$results.find('.'+hl)
        .find('a').attr('href');
      window.location = target;
    },

    _handler: function(event) {
      var self = this;
      window.clearTimeout(self.timeout);
      switch (event.keyCode) {
        case 13:
          self._keyEnter();
          return false;
        case 38:
          self._keyUp();
          return false;
        case 40:
          self._keyDown();
          return false;
        case 27:
          self._keyEscape();
          break;
        case 37: break; // keyLeft
        case 39: break; // keyRight
        default:
          if (self.$input.val().length >= self.options.chars) {
            self.timeout = window.setInterval(function(){
              try{
                self.search();
              }catch(e){
                console.log('error trying to search');
              }
            }, self.options.delay);
          }
      }
    },

    select: function() {
      var self = this;
      var select2 = self.$el.data().select2;
      var dropdown = select2.dropdown;
      var selected = $('.select2-highlighted', dropdown);
      var link = $('.'+self.options.linkSelector, selected);
      var target = link.attr('href');
      if (target) {
        // There may be a better way to do this
        if (self.options.isTest) {
          self.testTarget = target;
        } else {
          window.location = target;
        }
      }
    }

  });

  return Livesearch;

});
