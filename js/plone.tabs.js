// tabs pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js pattern.tabs.js
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
  'js/pattern.tabs'
], function($, Patterns, Tabs, undefined) {
  "use strict";

  var PloneTabs = Patterns.Base.extend({
    name: 'plone-tabs',
    jqueryPlugin: 'ploneTabs',
    defaults: {
      panels: '.enableFormTabbing fieldset',
      panelKlass: 'formPanel',
      tabKlass: 'formTab',
      tabsKlass: 'formTabs'
    },
    init: function() {
      var self = this;

      self.options = $.extend({}, self.defaults, self.options);

      self.$panels = $(self.options.panels, self.$el);
      if (!self.$panels.size()) { return; }

      self.$tabs = $('<ul/>')
        .addClass(self.options.tabsKlass)
        .insertBefore(self.$panels.parent());

      self.$panels.each(function() {
        var $panel = $(this).addClass(self.options.panelKlass),
            $legend = $('> legend', $panel).hide();
        self.$tabs.append(
          $('<li/>')
            .addClass(self.options.tabKlass)
            .append($('<a/>').attr({
              'id': $legend.attr('id'),
              'href': '#' + $panel.attr('id')
              }).append($('<span/>').html($legend.text()))
          ));
      });

      self.$tabs.patternTabs();
    }
  });

  Patterns.register(PloneTabs);

  return PloneTabs;

});
