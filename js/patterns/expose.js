// expose pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
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
  'js/patterns/base',
  'js/patterns/backdrop',
  'jam/Patterns/src/core/parser'
], function($, Base, Backdrop, Parser) {
  "use strict";

  var parser = new Parser("expose");

  parser.add_argument("triggers", "focusin");
  parser.add_argument("klassActive", "active");
  parser.add_argument("backdrop", "body");
  parser.add_argument("backdropZIndex", "1000");
  parser.add_argument("backdropOpacity", "0.8");
  parser.add_argument("backdropKlass", "backdrop");
  parser.add_argument("backdropKlassActive", 'backdrop-active');
  parser.add_argument("backdropCloseOnEsc", true);
  parser.add_argument("backdropCloseOnClick", true);

  var Expose = Base.extend({
    name: "expose",
    parser: parser,
    init: function() {
      var self = this;

      self.backdrop = new Backdrop($(self.options.backdrop), {
        zindex: self.options.backdropZIndex,
        klass: self.options.backdropKlass,
        klassActive: self.options.backdropKlassActive,
        styles: self.options.backdropStyles,
        opacity: self.options.backdropOpacity,
        closeOnEsc: self.options.backdropCloseOnEsc,
        closeOnClick: self.options.backdropCloseOnClick
      });
      if (self.options.triggers) {
        $.each(self.options.triggers.split(','), function(i, item) {
          item = item.split(' ');
          $(item[1] || self.$el).on(item[0], function() {
            self.show();
          });
        });
      }
      self.backdrop.on('hidden', function() { self.hide(); });
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        self.trigger('show');
        self.$el.addClass(self.options.klassActive);
        self.backdrop.show();
        self._initialZIndex = self.$el.css('z-index');
        self.$el.css('z-index', self.options.backdropZIndex + 1);
        self.$el.css('opacity', '0');
        self.$el.animate({ opacity: '1' }, 500);
        self.trigger('shown');
      }
    },
    hide: function() {
      var self = this;
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.backdrop.hide();
        self.$el.css('z-index', self._initialZIndex);
        self.$el.removeClass(self.options.klassActive);
        self.trigger('hidden');
      }
    }
  });

  return Expose;

});
