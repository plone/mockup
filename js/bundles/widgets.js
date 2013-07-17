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
  'mockup-registry',
  'mockup-patterns-select2',
  'mockup-patterns-pickadate',
  'mockup-patterns-autotoc',
  'mockup-patterns-accessibility',
  'mockup-patterns-relateditems',
  'mockup-patterns-formunloadalert',
  'mockup-patterns-toggle',
  'mockup-patterns-tinymce',
  'mockup-patterns-picture',
  'mockup-patterns-querystring',
  'mockup-patterns-preventdoublesubmit',
  'mockup-patterns-formautofocus',
  'mockup-patterns-livesearch'
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

      // add tinymce pattern
      $root.find('.mce_editable').addClass('pat-tinymce').each(function(){
        var $tiny = $(this);
        var config = $.parseJSON($tiny.attr('data-mce-config'));
        $tiny.attr({
          'data-pat-tinymce': JSON.stringify({
            relatedItems: {
              ajaxvocabulary: config.portal_url + '/@@getVocabulary?name=plone.app.vocabularies.Catalog'
            },
            rel_upload_path: '@@fileUpload',
            folder_url: config.document_base_url,
            tiny: {
              content_css: config.portal_url + '/base.css'
            }
          })
        });
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

      /*** Login ***/
      var loginOptions = {
        templateOptions: {
          title: 'Login',
          content: '#content',
          prependContent: '.portalMessage'
        }
      };
      $('#personaltools-login')
        .addClass('pat-modal')
        .attr('data-pat-modal', JSON.stringify(loginOptions));

      /*** Contact form ***/
      $('#siteaction-contact > a').addClass('pat-modal');

      /*** Register form ***/
      var registerOptions = {
        templateOptions: {
          buttons: '.actionButtons > input[type="submit"]'
        }
      };
      $('#personaltools-join')
        .addClass('pat-modal')
        .attr('data-pat-modal', JSON.stringify(registerOptions));

      /*** Content History ***/
      var contentHistoryOptions = {
        templateOptions: {
          titleSelector: 'h2:first',
          content: '#content-core'
        }
      };
      $('#content-history > a, #plone-action-content-history > a')
        .addClass('pat-modal')
        .attr('data-pat-modal', JSON.stringify(contentHistoryOptions));

      /*** Default Page ***/
      $('#folderChangeDefaultPage').addClass('pat-modal');

      /*** Add user form ***/
      var users_add = $('form[name="users_add"]');
      if ( users_add.length > 0) {
        var addUserOptions = {
          ajaxUrl: users_add[0].action,
          triggers: ['click input[name="form.button.AddUser"]'],
          templateOptions: {
            buttons: 'input[name="form.actions.register"]',
            content: '#content',
            prependContent: '.portalMessage'
          }
        };
        $('input[name="form.button.AddUser"]')
          .addClass('pat-modal')
          .attr('data-pat-modal', JSON.stringify(addUserOptions));
      }

      /*** Add group form ***/
      var groups_add = $('form[name="groups_add"]');
      if ( groups_add.length > 0) {
        var addGroupOptions = {
          ajaxUrl: groups_add[0].action,
          triggers: ['click input[name="form.button.AddGroup"]'],
          templateOptions: {
            buttons: 'input[name="form.button.Save"]',
            content: '#content',
            prependContent: '.portalMessage'
          }
        };
        $('input[name="form.button.AddGroup"]')
          .addClass('pat-modal')
          .attr('data-pat-modal', JSON.stringify(addGroupOptions));
      }


      /*** Content Type Restrctions form ***/
      $('#plone-contentmenu-settings > a,a#plone-contentmenu-settings').addClass('modal-trigger').patternModal({
        width: '80%',
        templateOptions: {
          actionsOptions: {
            displayInModal: false
          }
        }
      }).on('shown.modal.patterns', function(modal){
        var $modal = modal.$modal;
        var prefered = $(".current_prefer_form", $modal),
            allowed = $(".current_allow_form", $modal),
            constrain_mode = $(".constrain_types_mode_form", $modal),
            prefered_field = prefered.parents('.field'),
            allowed_field = allowed.parents('.field'),
            ACQUIRE = -1,
            DISABLED = 0,
            ENABLED = 1;
        function updateVisibility(){
          var mode = parseInt(constrain_mode.val(), 10);
          if(mode === ENABLED){
            prefered_field.show();
            allowed_field.show();
          }else{
            prefered_field.hide();
            allowed_field.hide();
          }
        }
        function updateSelectable(){
          prefered.each(function(){
            var allowed_id = this.id.replace('prefer', 'allow'),
                allowed_item = allowed_field.find("#" + allowed_id);
            if (this.checked){
              allowed_item[0].disabled = false;
            }else{
              allowed_item[0].disabled = true;
              allowed_item[0].checked = false;
            }
          });
        }
        constrain_mode.change(updateVisibility);
        updateVisibility();
        prefered_field.change(updateSelectable);
        updateSelectable();
      });


      /*** Advanced workflow
      // This form needs additional JS and CSS for the calendar widget.
      // The AJAX form doesn't load it from the javascript_head_slot. */
      $('#workflow-transition-advanced > a,a#workflow-transition-advanced').addClass('modal-trigger').patternModal({
        width: '80%',
        templateOptions: {
          actionsOptions: {
            displayInModal: false
          }
        }
      });


    },
    scan: function(selector) {
      registry.scan($(selector));
    }
  };

  registry.register(Widgets);

  return Widgets;
});
