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


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-patterns-backdrop'
], function($, Base, Backdrop) {
  "use strict";

  var Expose = Base.extend({
    name: "expose",
    defaults: {
      triggers: "focusin",
      klassActive: "active",
      backdrop: "body",
      backdropZIndex: "1000",
      backdropOpacity: "0.8",
      backdropKlass: "backdrop",
      backdropKlassActive: 'backdrop-active',
      backdropCloseOnEsc: true,
      backdropCloseOnClick: true
    },
    init: function() {
      var self = this;

      self.backdrop = new Backdrop(self.$el.parents(self.options.backdrop), {
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
