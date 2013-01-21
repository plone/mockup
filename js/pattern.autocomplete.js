// plone integration for textext.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.widgets/textext.js
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
  'js/patterns',
  'jam/jquery-textext/src/js/textext.core.js',
  'jam/jquery-textext/src/js/textext.plugin.ajax.js',
  'jam/jquery-textext/src/js/textext.plugin.arrow.js',
  'jam/jquery-textext/src/js/textext.plugin.autocomplete.js',
  'jam/jquery-textext/src/js/textext.plugin.clear.js',
  'jam/jquery-textext/src/js/textext.plugin.filter.js',
  'jam/jquery-textext/src/js/textext.plugin.focus.js',
  'jam/jquery-textext/src/js/textext.plugin.prompt.js',
  'jam/jquery-textext/src/js/textext.plugin.suggestions.js',
  'jam/jquery-textext/src/js/textext.plugin.tags.js'
], function($, Patterns) {
  "use strict";

  var AutocompleteItemManager = function() {};
  AutocompleteItemManager.prototype = {
    // Initialization method called by the core during instantiation.
    init: function(core) {
    },

    // Filters out items from the list that don't match the query and returns
    // remaining items. Default implementation checks if the item starts with the
    // query.
    filter: function(list, query) {
      var result = [],
          i, item;

      for (i = 0; i < list.length; i+=1) {
        item = list[i];
        if (this.itemContains(item, query)) {
          result.push(item);
        }
      }

      return result;
    },

    // Returns `true` if specified item contains another string, `false`
    // otherwise. In the default implementation `String.indexOf()` is used to
    // check if item string begins with the needle string.
    itemContains: function(item, needle) {
      return this.itemToString(item).toLowerCase()
                      .indexOf(needle.toLowerCase()) === 0;
    },

    // Converts specified string to item. Because default implemenation works
    // with string, input string is simply returned back. To use custom objects,
    // different implementation of this method could return something like `{
    // name : {String} }`.
    stringToItem: function(str) {
      return str;
    },

    // Converts specified item to string. Because default implemenation works
    // with string, input string is simply returned back. To use custom objects,
    // different implementation of this method could for example return `name`
    // field of `{ name : {String} }`.
    itemToString: function(item) {
      return item;
    },

    // Returns `true` if both items are equal, `false` otherwise. Because default
    // implemenation works with string, input items are compared as strings. To
    // use custom objects, different implementation of this method could for
    // example compare `name` fields of `{ name : {String} }` type object.
    compareItems: function(item1, item2) {
      return item1 === item2;
    }
  };

  var Autocomplete = Patterns.Base.extend({
    name: 'autocomplete',
    jqueryPlugin: 'patternAutocomplete',
    defaults: {
      createItems: true,
      plugins: 'autocomplete tags ajax prompt focus arrow',
      'prompt': 'Add...',
      ajaxDataType: 'json',
      ajaxCacheResults: true
    },
    init: function() {
      var self = this;

      self.options = $.extend({}, self.defaults, self.options);

      self.textextOptions = {
        itemManager: AutocompleteItemManager,
        tagsItems: JSON.parse(self.$el.val()),
        plugins: self.options.plugins,
        'prompt': self.options['prompt'],
        ext: {
          core: {
            onSetFormData: function(e, data) {
              $.each(data, function(i, item) {
                data[i] = item.trim();
              });
              this.hiddenInput().val(this.serializeData(data));
            }
          },
          autocomplete: {
            onSetSuggestions: function(e, data) {
              var suggestions = [],
                  old_suggestions = this._suggestions = data.result,
                  existing = JSON.parse(self.$el.textext()[0].hiddenInput().val());

              $.each(old_suggestions, function(i, item) {
                if ($.inArray(item, existing) === -1) {
                  suggestions.push(item);
                }
              });

              this._suggestions = suggestions;
              if(data.showHideDropdown !== false) {
                this.trigger(suggestions === null || suggestions.length === 0 ? 'hideDropdown': 'showDropdown');
              }
            }
          },
          tags: {
            onIsTagAllowed: function(e, data) {
              data.result = false;
              if (this.isValueAllowed(data.tag) &&
                  $.inArray(data.tag.trim(), JSON.parse(self.$el.textext()[0].hiddenInput().val())) !== -1) {
                data.result = true;
                if (!self.options.createItems && $.inArray(data.tag, this._suggestions) !== 1) {
                  data.result = false;
                }
              }
            }
          }
        }
      };
      if (self.options.ajaxUrl) {
        $.extend(self.textextOptions, {
          ajax : {
            url: self.options.ajaxUrl,
            dataType: self.options.ajaxDataType,
            cacheResults:  self.options.ajaxCacheResults,
            dataCallback: function(query) {
              return { 'query': query };
            }
          }
        });
      }
      self.$el.val('');

      if (!self.$el.is(':visible')) {
        var $fieldset = self.$el.parents(':hidden').last().show();
        self.$el.textext(self.textextOptions);
        $fieldset.hide();
      } else {
        self.$el.textext(self.textextOptions);
      }
    }
  });

  Patterns.register(Autocomplete);

  return Autocomplete;

});
