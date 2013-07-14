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


if (window.jQuery) {
  define( "jquery", [], function () {
    "use strict";
    return window.jQuery;
  } );
}

define([
  'jquery',
  './../registry.js',
  './../patterns/select2.js',
  './../patterns/pickadate.js',
  './../patterns/autotoc.js',
  './../patterns/accessibility.js',
  './../patterns/relateditems.js',
  './../patterns/formUnloadAlert.js',
  './../patterns/toggle.js',
  './../patterns/tinymce.js',
  './../patterns/picture.js',
  './../patterns/livesearch.js',
  './../patterns/querystring.js',
  './../patterns/preventdoublesubmit.js',
  './../patterns/formautofocus.js'
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
      $match = $root.filter('.enableUnloadProtection');
      $match = $match.add($root.find('.enableUnloadProtection'));
      $match.addClass('pat-formunloadalert');
      $match.attr({
        'data-pat-formunloadalert':'message: '+window.form_modified_message
      });

      // Fix drop downs
      var personal_tools = $('dl.actionMenu#portal-personaltools dt.actionMenuHeader a');
      personal_tools.addClass('pat-toggle');
      personal_tools.attr({
        'data-pat-toggle': 'target: dl.actionMenu#portal-personaltools;value: activated'
      });
      
      var add_new = $('dl.actionMenu#plone-contentmenu-factories dt.actionMenuHeader a');
      add_new.addClass('pat-toggle');
      add_new.attr({
        'data-pat-toggle': 'target: dl.actionMenu#plone-contentmenu-factories;value: activated'
      });
      
      var display = $('dl.actionMenu#plone-contentmenu-display dt.actionMenuHeader a');
      display.addClass('pat-toggle');
      display.attr({
        'data-pat-toggle': 'target: dl.actionMenu#plone-contentmenu-display;value: activated'
      });
      
      var workflow = $('dl.actionMenu#plone-contentmenu-workflow dt.actionMenuHeader a');
      workflow.addClass('pat-toggle');
      workflow.attr({
        'data-pat-toggle': 'target: dl.actionMenu#plone-contentmenu-workflow;value: activated'
      });
      
      // plone/app/search/search.pt
      var filter_results = $('form[name=searchform] dl.actionMenu dt.actionMenuHeader a');
      filter_results.addClass('pat-toggle');
      filter_results.attr({
        'data-pat-toggle': 'target: form[name=searchform] dl.actionMenu;value: activated'
      });
      
      $('dl.actionMenu').removeClass('deactivated');

      $('html').on('mousedown', function(e) {
        if (!$(e.toElement).parents('dl.actionMenu').hasClass('activated')){
          // Means we clicked an opened menu, do not close
          $('dl.actionMenu').removeClass('activated');
        }
      });

      $match = $root.find('.LSBox');
      var url = $match.parents('form').attr('action').replace('@@search',
          '@@getVocabulary?name=plone.app.vocabularies.Catalog');
      var attrs = {
        'ajaxvocabulary': url
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
      $match.find('.searchButton').hide();

      // add tinymce pattern
      $root.find('.mce_editable').addClass('pat-tinymce').attr({
        'data-pat-tinymce': JSON.stringify({
          relatedItems: {
            ajaxvocabulary: portal_url + '/@@getVocabulary?name=plone.app.vocabularies.Catalog'
          }
        })
      });

      // Use toggle to replace the toggleSelect from the select_all.js
      // First, remove the previous onclick
      $("[onclick^='toggleSelect']").attr('onclick', null);
      
      // Assign the class and data attributes for the "select all of the content_status_history template
      var select_all = $('form[action$=content_status_history] table.listing > thead tr th input[type=checkbox]');
      select_all.addClass('pat-toggle');
      select_all.attr({
        'data-pat-toggle': 'target: table.listing input[type=checkbox];attribute: checked;value: checked;externalClose: false;preventDefault: false'
      });
      
      // Assign the class and data attributes for the "select all of the usergroup-groupmembership view
      select_all = $('form[action*=usergroup-groupmembership] table.listing tr th input[type=checkbox]');
      select_all.addClass('pat-toggle');
      select_all.attr({
        'data-pat-toggle': 'target: table.listing input[type=checkbox];attribute: checked;value: checked;externalClose: false;preventDefault: false'
      });
      
      // Assign the class and data attributes for the "select all of the usergroup-usermembership view
      select_all = $('form[action*=usergroup-usermembership] table.listing tr th input[type=checkbox]');
      select_all.addClass('pat-toggle');
      select_all.attr({
        'data-pat-toggle': 'target:form[action*=usergroup-usermembership] table.listing:last input[type=checkbox];attribute: checked;value: checked;externalClose: false;preventDefault: false'
      });
      
      // plone/app/search/search.pt
      select_all = $("[onchange*='toggleSelect']").attr('onchange', null);
      select_all.addClass('pat-toggle');
      select_all.attr({
        'data-pat-toggle': 'target:form[name=searchform] dd.actionMenuContent input[type=checkbox];attribute: checked;value: checked;externalClose: false;preventDefault: false'
      });
      
      // Apply the preventdoublesubmit pattern to forms
      $('form').addClass('pat-preventdoublesubmit');
      $('form').attr({
        'data-pat-preventdoublesubmit': 'message:'+window.form_resubmit_message
      });
      
      // Add the form auto focus for the add or edit forms
      var add_form = $('form[action*="++add++"]');
      add_form.addClass('pat-formautofocus');
      var edit_form = $('form[action*="@@edit"]');
      edit_form.addClass('pat-formautofocus');
      
    },
    scan: function(selector) {
      registry.scan($(selector));
    }
  };

  registry.register(Widgets);

  return Widgets;
});
