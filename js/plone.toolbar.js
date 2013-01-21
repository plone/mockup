// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
//
// Description:
//    plone.toolbar.js script makes sure that all dropdowns in Plone's toolbar
//    are in sync with iframe's stretching/schrinking.
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
  'js/pattern.toggle',
  'js/jquery.iframe'
], function($, Patterns, Toggle, IFrame, undefined) {
  "use strict";

  var PloneToolbar = Patterns.Base.extend({
    name: 'plone-toolbar',
    jqueryPlugin: 'ploneToolbar',
    init: function() {
      var self = this;

      // for each dropdown toolbar button
      self.$el
        // at opening dropdown:
        // - close all other opened dropdown buttons
        // - stretch iframe
        .on('patterns.toggle.add', 'a[data-pattern~="toggle"]', function(e) {
          var $el = $(this);
          $('.toolbar-dropdown-open > a').each(function() {
            if ($el[0] !== $(this)[0]) {
              $(this).patternToggle('remove');
            }
          });
          IFrame.stretch();
        })
        // at closing dropdown shrink iframe
        .on('patterns.toggle.removed', 'a[data-pattern~="toggle"]', function(e) {
          IFrame.shrink();
        });

      // make sure we close all dropdowns when iframe is shrinking
      IFrame.$el.on('iframe.shrink', function(e) {
        $('.toolbar-dropdown-open > a', self.$el).each(function() {
          $(this).patternToggle('remove');
        });
      });
    }
  });

  Patterns.register(PloneToolbar);

  return PloneToolbar;

});
