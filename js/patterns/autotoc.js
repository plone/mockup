// Pattern which generates Table Of Contents.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
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
  'js/patterns/base'
], function($, Base, Parser) {
  "use strict";

  var AutoTOC = Base.extend({
    name: "autotoc",
    defaults: {
      section: 'section',
      levels: 'h1,h2,h3',
      IDPrefix: 'autotoc-item-',
      klassTOC: 'autotoc-nav',
      klassSection: 'autotoc-section',
      klassLevelPrefix: 'autotoc-level-',
      klassActive: 'active',
      scrollDuration: 'slow',
      scrollEasing: 'swing'
    },
    init: function() {
      var self = this;
      
      self.$toc = $('<nav/>').addClass(self.options.klassTOC);
      
      if (self.options.prependTo) {
        self.$toc.prependTo(self.options.prependTo);
      }
      else if (self.options.appendTo) {
        self.$toc.appendTo(self.options.appendTo);
      }
      else{
        self.$toc.prependTo(self.$el);
      }

      if (self.options.klass) {
        self.$el.addClass(self.options.klass);
      }

      $(self.options.section, self.$el).addClass(self.options.klassSection);

      $(self.options.levels, self.$el).each(function(i) {
        var $level = $(this),
            id = $level.prop('id') ? '#' + $level.prop('id') :
                 $level.parents(self.options.section).prop('id');
        if (!id) {
          id = self.options.IDPrefix + self.name + '-' + i;
          $level.prop('id', id);
        }
        $('<a/>')
          .appendTo(self.$toc)
          .text($level.text())
          .prop('href', id)
          .addClass(self.options.klassLevelPrefix + self.getLevel($level))
          .on('click', function(e, doScroll) {
            e.stopPropagation();
            e.preventDefault();
            self.$el.children('.' + self.options.klassActive).removeClass(
              self.options.klassActive);
            $(e.target).addClass(self.options.klassActive);
            $level.parents(self.options.section)
                .addClass(self.options.klassActive);
            if (doScroll !== false && self.options.scrollDuration && $level) {
              $('body,html').animate({
                scrollTop: $level.offset().top
              }, self.options.scrollDuration, self.options.scrollEasing);
            }
            if (self.$el.parents('.modal').size() !== 0) {
              self.$el.trigger('resize.modal.patterns');
            }
          });
      });

      self.$toc.find('a').first().trigger('click', false);

    },
    getLevel: function($el) {
      var elementLevel = 0;
      $.each(this.options.levels.split(','), function(level, levelSelector) {
        if ($el.filter(levelSelector).size() === 1) {
          elementLevel = level + 1;
          return false;
        }
      });
      return elementLevel;
    }
  });

  return AutoTOC;

});
