// Patterns 
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */

define([
  'jquery'
], function($, undefined) {
  "use strict";

  var error = $.error,
      _registry = {};

  // Get options from element's data attributes
  // Collect options from parent tree of elements
  function getOptions($el, prefix, options) {
    options = options || {};

    // get options from parent element first, stop if element tag name is 'body'
    if ($el.size() !== 0 && !$.nodeName($el[0], 'body')) {
      options = getOptions($el.parent(), prefix, options);
    }

    // collect all options from element
    if($el.length) {
      $.each($el[0].attributes, function(index, attr) {
        if (attr.name.substr(0, ('data-'+prefix).length) === 'data-'+prefix) {
          if (attr.value === 'true') {
            options[$.camelCase(attr.name.substr(('data-'+prefix).length+1))] = true;
          } else if (attr.value === 'false') {
            options[$.camelCase(attr.name.substr(('data-'+prefix).length+1))] = false;
          } else {
            options[$.camelCase(attr.name.substr(('data-'+prefix).length+1))] = attr.value;
          }
        }
      });
    }

    return options;
  }


  function initializePattern($el, patternName, extra_options) {
    var pattern = new _registry[patternName]($el, getOptions(
          $el, patternName, extra_options));
    return pattern;
  }

  function initializePatternsForElement($el) {
    $.each(($el.data('pattern') || '').split(' '), function(i, patternName) {
      if (patternName.length !== 0) {
        if (_registry[patternName] === undefined) {
          error('Pattern you try to initialize "' + patternName + '" does not exists.');
          return;
        }
        $el.data('pattern-' + patternName, initializePattern($el, patternName));
      }
    });
  }

  // Initialize patterns over some context/dom element.
  // Patterns already initialized won't be initialized again.
  function initializePatterns(context) {
    // first initialize patterns for current context
    if ($(context)[0] !== $(document)[0]) {
      initializePatternsForElement($(context));
    }
    // then initialize for its childrens
    $('[data-pattern]', context).each(function() {
        initializePatternsForElement($(this));
    });
  }

  // Register pattern
  function registerPattern(Pattern) {
    if (!Pattern.prototype.name) {
      error('Pattern you try to register has no name.');
      return;
    }
    if (_registry[Pattern.prototype.name] !== undefined) {
      error('Pattern with name "' + Pattern.prototype.name + '" was already ' +
            'registered. Please select different name.');
      return;
    }

    _registry[Pattern.prototype.name] = Pattern;

    if (Pattern.prototype.jqueryPlugin) {
      $.fn[Pattern.prototype.jqueryPlugin] = function(method, options) {
        $(this).each(function() {
          var $el = $(this),
              pattern = $el.data('pattern-' + Pattern.prototype.name);
          if (typeof method === "object") {
            options = method;
            method = undefined;
          }
          if (!pattern || typeof(pattern) === 'string') {
            pattern = initializePattern($el, Pattern.prototype.name, options);
            $el.data('pattern-' + Pattern.prototype.name, pattern);
          } else if (method && pattern && pattern[method]) {
            pattern[method].apply(pattern, [options]);
          }

        });
        return this;
      };
      $.fn[Pattern.prototype.jqueryPlugin].Constructor = Pattern.constructor;
    }
  }

  // Base Pattern
  var BasePattern = function($el, options) {
    this.$el = $el.addClass('pattern-' + this.name);
    this.options = options;
    if (this.init) {
      this.init();
    }
  };
  BasePattern.prototype = { constructor: BasePattern };
  BasePattern.extend = function(NewPattern) {
    var Base = this;
    var Constructor;

    if (NewPattern && NewPattern.hasOwnProperty('constructor')) {
      Constructor = NewPattern.constructor;
    } else {
      Constructor = function() { Base.apply(this, arguments); };
    }

    var Surrogate = function() { this.constructor = Constructor; };
    Surrogate.prototype = Base.prototype;
    Constructor.prototype = new Surrogate();

    $.extend(true, Constructor.prototype, NewPattern);

    Constructor.__super__ = Base.prototype;
    return Constructor;
  };

  // Initial initialization of patterns
  $(document).ready(function() {
    initializePatterns($(document));
  });

  // Public API
  return {
    _registry: _registry,
    initialize: initializePatterns,
    register: registerPattern,
    getOptions: getOptions,
    Base: BasePattern
  };

});
