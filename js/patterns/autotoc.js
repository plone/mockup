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
  'js/patterns/base',
  'jam/Patterns/src/core/parser'
], function($, Base, Parser) {
  "use strict";

  var parser = new Parser('autotoc');

  parser.add_argument('section', 'section');
  parser.add_argument('levels', 'h1,h2,h3');
  parser.add_argument('IDPrefix', 'autotoc-item-');
  parser.add_argument('klassTOC', 'autotoc-nav');
  parser.add_argument('klassSection', 'autotoc-section');
  parser.add_argument('klassLevelPrefix', 'autotoc-level-');
  parser.add_argument('klassActive', 'active');
  parser.add_argument('scrollDuration');
  parser.add_argument('scrollEasing', 'swing');
  parser.add_argument('klass');

  var AutoTOC = Base.extend({
    name: "autotoc",
    parser: parser,
    init: function() {
      var self = this;
      self.$toc = $('<nav/>')
          .prependTo(self.$el)
          .addClass(self.options.klassTOC);

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
            $('.' + self.options.klassActive, self.$el)
                .removeClass(self.options.klassActive);
            $(e.target).addClass(self.options.klassActive);
            $level.parents(self.options.section)
                .addClass(self.options.klassActive);
            if (doScroll !== false && self.options.scrollDuration && $level) {
              $('body,html').animate({
                scrollTop: $level.offset().top
              }, self.options.scrollDuration, self.options.scrollEasing);
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
