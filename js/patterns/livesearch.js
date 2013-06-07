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
  'js/patterns/toggle'
], function($, Base, Toggle) {
  "use strict";

  var Livesearch = Base.extend({
    name: "livesearch",
    timeout: null,
    $results: null,
    $input: null,
    $toggle: null,
    cache: {},
    defaults: {
      delay: 400, // ms after keyup before search
      param: 'SearchableText', // query string param to pass to search url
      highlight: 'pat-livesearch-highlight', // class to add to items when selected
      chars: 3, // number of chars user should type before searching
      toggle: {
        target: '.pat-livesearch-container', // the element to show/hide when performing search
        klass: 'show'
      },
      results: {
        target: '.pat-livesearch-results', // the element to fill with results
        content: null, // element from the result to grab
        item: 'li', // selector for items in results
        link: 'a' // selector for primary link element inside of item
      },
      input: '.pat-livesearch-input' // input selector
    },

    init: function() {
      var self = this;
      var $toggle, $results;

      this.$results = $(self.options.results.target);

      if (!self.options.url) {
        $.error('No url provided for livesearch results ' + self.$el);
      }

      self.$input = $(self.options.input);

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
        }
      }

      self.$input.on('keyup', function(event) {
        return self._handler(event);
      });
    },

    search: function() {
      var self = this;
      var term = this.$input.val();

      if (self.cache[term]) {
        self.fillResults(self.cache[term]);
      }

      var params = {};
      var query;
      params[self.options.param] = term;
      query = $.param(params);
      $.get(
        self.options.url,
        query,
        function(data) {
          self.cache[term] = data;
          self.fillResults(data);
        }
      );
    },

    fillResults: function(data) {
      var self = this;
      if (self.$results.length > 0) {
        var content = data;
        if (self.options.results.content !== null) {
          content = $(data).find(self.options.results.content);
        }
        $(content).find(self.options.results.item)
        self.$results.html(content);
        self.show();
        window.clearInterval(self.timeout);
      }
    },

    show: function() {
      if (this.$toggle) {
        this.$toggle.addClass(this.options.toggle.klass);
      }
    },

    hide: function() {
      if (this.$toggle) {
        this.$toggle.removeClass(this.options.toggle.klass);
      }
    },

    _keyUp: function() {
      var self = this;
      var hl = self.options.highlight;
      var $selected = self.$results.find('.'+hl);
      if ($selected.length < 1) {
        $selected = self.$results.find(self.options.results.item).last();
        $selected.addClass(hl);
        return;
      } else {
        $selected.removeClass(hl);
        if ($selected.prev().length) {
          $selected = $selected.prev();
        } else {
          $selected = self.$results.find(self.options.results.item).last();
        }
        $selected.addClass(hl);
      }
    },

    _keyDown: function() {
      var self = this;
      var hl = self.options.highlight;
      var $selected = self.$results.find('.'+hl);
      if ($selected.length < 1) {
        $selected = self.$results.find(self.options.results.item).first();
        $selected.addClass(hl);
        return;
      } else {
        $selected.removeClass(hl);
        if ($selected.next().length) {
          $selected = $selected.next();  
        } else {
          $selected = self.$results.find(self.options.results.item).first();
        }
        $selected.addClass(hl);
      }
    },

    _keyEscape: function() {
      this.hide();
    },

    _keyEnter: function() {
      var self = this;
      var hl = self.options.highlight;
      var target = self.$results.find('.'+hl)
        .find(self.options.results.link).attr('href');
      window.location = target;
    },

    _handler: function(event) {
      var self = this;
      window.clearTimeout(self.timeout);
      switch (event.keyCode) {
        case 13:
          self._keyEnter();
          break;
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
            self.timeout = window.setInterval(
              function(){
                self.search();
              }, self.options.delay);
          }
      }
    }

  });

  return Livesearch;

});
