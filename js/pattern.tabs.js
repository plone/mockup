// tabs pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js bootstrap-transition.js bootstrap-tab.js
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
  'jam/bootstrap/js/bootstrap-transition',
  'jam/bootstrap/js/bootstrap-tab'
], function($, Patterns, Tab, undefined) {
  "use strict";

  var Tabs = Patterns.Base.extend({
    name: 'tabs',
    jqueryPlugin: 'patternTabs',
    defaults: {
    },
    init: function() {
      var self = this;

      self.options = $.extend({}, self.defaults, self.options);

      self.getTabs()
        .on('click', function(e) {
          e.preventDefault();
          $(this).tab('show');
        })
        .on('show', function(e) { self.show($(this)); })
        .on('hide', function(e) { self.hide($(this)); })
        .first().tab('show');
    },
    show: function($el) {
      this.getPanels().hide();
      this.getPanel($el).show();
    },
    hide: function($el) {
      this.getPanel($el).hide();
    },
    getTabs: function() {
      return this.$el.find('li > a');
    },
    getPanels: function() {
      var self = this, panels = [];
      $.each(self.getTabs(), function(i, el) {
        panels.push(self.getPanel($(el))[0]);
      });
      return $(panels);
    },
    getPanel: function($el) {
      var target = $el.attr('href');
      target = target && target.replace(/.*(?=#[^\s]*$)/, '');  //strip for ie7
      return $(target);
    }
  });

  Patterns.register(Tabs);

  return Tabs;

});
