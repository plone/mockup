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
  'js/patterns/picture',
  'js/patterns/livesearch',
  'js/patterns/querystring'
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
        'data-pat-autotoc':'levels: legend;section: fieldset;klass: autotabs'
      });

      // activate accessibility pattern by default
      $root.addClass('pat-accessibility');
      $root.attr({
        'data-pat-accessibility': 'smallbtn: #accessibility-smallText;normalbtn: #accessibility-normalText;largebtn: #accessibility-largeText'
      });

      // apply formUnloadAlert pattern where enableUnloadProtection exists
      var $match = $root.filter('.enableUnloadProtection');
      $match = $match.add($root.find('.enableUnloadProtection'));
      $match.addClass('pat-formunloadalert');
      $match.attr({
        'data-pat-formunloadalert':'message: '+window.form_modified_message
      });

      // apply formUnloadAlert pattern where enableUnloadProtection exists
      var $match = $root.filter('dl.actionMenu dt.actionMenuHeader a');
      $match = $match.add($root.find('dl.actionMenu dt.actionMenuHeader a'));
      $match.addClass('pat-toggle');
      $match.attr({
        'data-pat-toggle': 'target: dl.actionMenu;value: activated'
      });
      $root.find('dl.actionMenu').removeClass('deactivated');

      $root.on('mousedown', function(e) {
        if ($(e.toElement).parents('dd.actionMenuContent').size() == 0){
          // If we are not clicking inside a content menu, then remove the
          // attribute from all other elements
          $('dl.actionMenu').removeClass('activated');
        }
      });

      // Live Search
      $match = $root.find('.LSBox');
      var url = $('#searchGadget_form').attr('action').replace('@@search', '@@updated_search');
      var attrs = {
        'url': url,
        'results': {
          'content': '#search-results',
          'item': 'dt'
        }
      };
      $match.attr({
        'class': 'pat-livesearch',
        'data-pat-livesearch': JSON.stringify(attrs)
      });
      $match.find('.searchSection').remove();
      $match.find('.LSResult').attr({
        'class': 'pat-livesearch-container pull-right',
        'id': ''
      });
      $match.find('.LSShadow').attr('class', 'pat-livesearch-results');
      $match.find('#searchGadget').addClass('pat-livesearch-input')
        .attr('autocomplete', 'off');

      // add tinymce pattern
      $root.find('.mce_editable').addClass('pat-tinymce');
      
      // Use toggle to replace the toggleSelect from the select_all.js
      // First, remove the previous onclick
      $("[onclick^='toggleSelect']").attr('onclick', null);
      
      // Assign the class and data attributes for the "select all of the content_status_history template
      var select_all = $('form[action$=content_status_history] table.listing > thead tr th input[type=checkbox]');
      select_all.addClass('pat-toggle');
      select_all.attr({
        'data-pat-toggle': 'target: table.listing input[type=checkbox];attribute: checked;value: checked;externalClose: false;preventDefault: false'
      });
      
    },
    scan: function(selector) {
      registry.scan($(selector));
    }
  };

  registry.register(Widgets);

  return Widgets;
});
