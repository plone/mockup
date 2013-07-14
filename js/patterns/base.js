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
  'jquery',
  'js/registry'
], function($, registry) {
  "use strict";

  function getName(name) {
    return name.replace(/\.(\w)/g, function(match, letter) { return letter.toUpperCase(); });
  }

  function _keysToObject(object, keys, value) {
    if (keys.length === 1) {
      return object[keys[0]] = value;
    } else {
      var key = keys.shift();
      if (!object[key]) {
        object[key] = {};
      }
      return _keysToObject(object[key], keys, value);
    }
  }

  function getOptions($el, name, options) {
    options = options || {};

    // get options from parent element first, stop if element tag name is 'body'
    if ($el.length !== 0 && !$.nodeName($el[0], 'body')) {
      options = getOptions($el.parent(), name, options);
    }

    // collect all options from element
    var elOptions = {};
    if ($el.length !== 0) {
      elOptions = $el.data('pat-' + name);
      if (elOptions) {
        // parse options if string
        if (typeof(elOptions) === 'string') {
          var tmpOptions = {};
          // TODO: Redo this with a proper Regex
          $.each(elOptions.split(';'), function(i, item) {
            item = item.split(':');
            if (item.length >= 1) {
              item.reverse();
              var key = item.pop();
              key = key.replace(/^\s+|\s+$/g, '');  // trim
              item.reverse();
              var value = item.join(':');
              value = value.replace(/^\s+|\s+$/g, '');  // trim
              tmpOptions[key] = value;
            }
          });
          elOptions = {};
          $.each(tmpOptions, function(key, value) {
            _keysToObject(elOptions, key.split('-'), value);
          });
        }
      }
    }

    return $.extend(true, {}, options, elOptions)
  }

  // Base Pattern
  var Base = function($el, options) {
    this.$el = $el;
    if (this.parser) {
      this.options = $.extend(true, {},
          this.parser.parse($el, this.defaults || {}, this.multipleOptions || false),
          options || {});
    } else {
      this.options = $.extend(true, {},
          this.defaults || {},
          getOptions($el, this.name),
          options || {});
    }
    this.init();
    this.trigger('init');
  };
  Base.prototype = {
    constructor: Base,
    on: function(eventName, eventCallback) {
      this.$el.on(eventName + '.' + this.name + '.patterns', eventCallback);
    },
    trigger: function(eventName) {
      this.$el.trigger(eventName + '.' + this.name + '.patterns', [ this ]);
    }
  };
  Base.extend = function(NewPattern) {
    var Base = this, Constructor;

    if (NewPattern && NewPattern.hasOwnProperty('constructor')) {
      Constructor = NewPattern.constructor;
    } else {
      Constructor = function() { Base.apply(this, arguments); };
    }

    var Surrogate = function() { this.constructor = Constructor; };
    Surrogate.prototype = Base.prototype;
    Constructor.prototype = new Surrogate();
    Constructor.extend = Base.extend;

    $.extend(true, Constructor.prototype, NewPattern);

    Constructor.__super__ = Base.prototype;

    if (Constructor.prototype.jqueryPlugin === undefined) {
      Constructor.prototype.jqueryPlugin = "pattern" +
          Constructor.prototype.name.charAt(0).toUpperCase() +
          Constructor.prototype.name.slice(1);
    }
    if (Constructor.prototype.jqueryPlugin) {
      $.fn[Constructor.prototype.jqueryPlugin] = function(method, options) {
        $(this).each(function() {
          var $el = $(this),
              pattern = $el.data('pattern-' + Constructor.prototype.name);
          if (typeof method === "object") {
            options = method;
            method = undefined;
          }
          if (!pattern || typeof(pattern) === 'string') {
            pattern = new Constructor($el, options);
            $el.data('pattern-' + Constructor.prototype.name, pattern);
          } else if (method && pattern && pattern[method]) {
            // TODO: now allow method starts with "_"
            pattern[method].apply(pattern, [options]);
          }

        });
        return this;
      };
    }

    registry.register({
      name: Constructor.prototype.name,
      trigger: '.pat-' + Constructor.prototype.name,
      jquery_plugin: false,
      init: function($all) {
        return $all.each(function(i) {
          var $el = $(this),
              data = $el.data('pattern-' + Constructor.prototype.name + '-' + i);
          if (!data) {
            $el.data('pattern-' + Constructor.prototype.name + '-' + i, new Constructor($el));
          }
        });
      }
    });

    return Constructor;
  };

  return Base;
});
