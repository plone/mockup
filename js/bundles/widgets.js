// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
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
/*global define:false, window:false */

if (window.jQuery) {
  define( "jquery", [], function () {
    "use strict";
    return window.jQuery;
  } );
}

define([
  'jquery',
  'jam/Patterns/src/registry',
  'js/patterns/select2',
  'js/patterns/pickadate',
  'js/patterns/autotoc',
  'js/patterns/accessibility',
  'js/patterns/relateditems',
  'js/patterns/formUnloadAlert',
  'js/patterns/toggle',
  'js/patterns/tinymce',
  'js/patterns/picture'
], function($, registry) {
  "use strict";

  // BBB: we need to hook pattern to classes which plone was using until now
  var Widgets = {
    name: "plone-widgets",
    transform: function($root) {

      // apply autotoc pattern where enableFormTabbing exists
      var $match = $root.filter('.enableFormTabbing');
      $match = $match.add($root.find('.enableFormTabbing'));
      $match.addClass('pat-autotoc');
      $match.attr({
        'data-pat-autotoc-levels': 'legend',
        'data-pat-autotoc-section': 'fieldset',
        'data-pat-autotoc-klass': 'autotabs'
      });

      // activate accessibility pattern by default
      $root.addClass('pat-accessibility');
      $root.attr({
        'data-pat-accessibility-smallbtn': "#accessibility-smallText",
        'data-pat-accessibility-normalbtn': "#accessibility-normalText",
        'data-pat-accessibility-largebtn': "#accessibility-largeText"
      });

      // apply formUnloadAlert pattern where enableUnloadProtection exists
      var $match = $root.filter('.enableUnloadProtection');
      $match = $match.add($root.find('.enableUnloadProtection'));
      $match.addClass('pat-formunloadalert');
      $match.attr({
        'data-pat-formunloadalert-message': window.form_modified_message
      });

      // apply formUnloadAlert pattern where enableUnloadProtection exists
      var $match = $root.filter('dl.actionMenu dt.actionMenuHeader a');
      $match = $match.add($root.find('dl.actionMenu dt.actionMenuHeader a'));
      $match.addClass('pat-toggle');
      $match.attr({
        'data-pat-toggle-target': 'dl.actionMenu',
        'data-pat-toggle-value': 'activated'
      });
      $root.find('dl.actionMenu').removeClass('deactivated');

      $root.on('mousedown', function(e) {
        if ($(e.toElement).parents('dd.actionMenuContent').size() == 0){
          // If we are not clicking inside a content menu, then remove the
          // attribute from all other elements
          $('dl.actionMenu').removeClass('activated');
        }
      });


      // add tinymce pattern
      $root.find('.mce_editable').addClass('pat-tinymce');
    },
    scan: function(selector) {
      registry.scan($(selector));
    }
  };

  registry.register(Widgets);

  return Widgets;
});
