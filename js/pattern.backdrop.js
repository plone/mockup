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
  'js/pattern.base',
  'jam/Patterns/src/core/parser'
], function($, Base, Parser) {
  "use strict";

  var parser = new Parser("expose");

  parser.add_argument("zIndex", "1000");
  parser.add_argument("opacity", "0.8");
  parser.add_argument("klass", "backdrop");
  parser.add_argument("klassActive", 'backdrop-active');
  parser.add_argument("closeOnEsc", true);
  parser.add_argument("closeOnClick", true);

  var Backdrop = Base.extend({
    name: "backdrop",
    parser: parser,
    init: function() {
      var self = this;
      self.$backdrop = $('> .' + self.options.klass, self.$el);
      if (self.$backdrop.size() === 0) {
        self.$backdrop= $('<div/>')
            .hide()
            .appendTo(self.$el)
            .addClass(self.options.klass);
      }
      if (self.options.closeOnEsc === true) {
        // TODO
        console.log('TODO: need to close backdrop when ESC key is pressed');
      }
      if (self.options.closeOnClick === true) {
        self.$backdrop.on('click', function() {
          self.hide();
        });
      }
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        self.trigger('show');
        self.$backdrop.css('opacity', '0').show();
        self.$el.addClass(self.options.klassActive);
        self.$backdrop.animate({ opacity: self.options.opacity }, 500);
        self.trigger('shown');
      }
    },
    hide: function() {
      var self = this;
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.$backdrop.animate({ opacity: '0' }, 500).hide();
        self.$el.removeClass(self.options.klassActive);
        self.trigger('hidden');
      }
    }
  });

  return Backdrop;

});
