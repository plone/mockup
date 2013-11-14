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


if (window.jQuery) {
  define( "jquery", [], function () {
    "use strict";
    return window.jQuery;
  } );
}

define([
  'jquery',
  'mockup-router',
  'mockup-iframe',
  'mockup-registry',
  'mockup-patterns-base',
  'mockup-patterns-toggle',
  'mockup-patterns-modal',
  'mockup-patterns-tinymce',
  'mockup-patterns-structure',
  'mockup-patterns-autotoc',
  'mockup-patterns-accessibility',
  'mockup-patterns-formunloadalert',
  'mockup-patterns-preventdoublesubmit',
  'mockup-patterns-formautofocus',
  'mockup-patterns-livesearch',
  'mockup-bundles-widgets'
], function($, Router, iframe, registry, Base, Toggle, Modal, TinyMCE,
            Structure, AutoTOC, Accessibility, FormUnloadAlert, LiveSearch,
            PloneWidgets) {
  "use strict";

  // BBB: we need to hook pattern to classes which plone was using until now
  var Toolbar = Base.extend({
    name: "plone-toolbar",
    init: function() {
      var self = this;

      // do not run in modal
      if (self.$el.hasClass('modal')) {
        return;
      }

      // apply autotoc pattern where enableFormTabbing exists
      var $match = self.$el.filter('.enableFormTabbing');
      $match = $match.add(self.$el.find('.enableFormTabbing'));
      $match.addClass('pat-autotoc');
      $match.patternAutotoc({
        levels: 'legend',
        section: 'fieldset',
        className: 'autotabs'
      });

      // activate accessibility pattern by default
      self.$el.addClass('pat-accessibility').patternAccessibility({
        smallbtn: '#accessibility-smallText',
        normalbtn: '#accessibility-normalText',
        largebtn: '#accessibility-largeText'
      });

      // apply formUnloadAlert pattern where enableUnloadProtection exists
      $match = self.$el.filter('.enableUnloadProtection');
      $match = $match.add(self.$el.find('.enableUnloadProtection'));
      $match.addClass('pat-formunloadalert');
      // TODO: need to get form_modified_message into body data attributes
      //$match.attr({
      //  'data-pat-formunloadalert':'message: '+window.form_modified_message
      //});

      // Use toggle to replace the toggleSelect from the select_all.js {{{
      // First, remove the previous onclick
      $("[onclick^='toggleSelect']", self.$el).attr('onclick', null);

      // Assign the class and data attributes for the "select all of the content_status_history template
      var select_all = $('form[action$=content_status_history] table.listing > thead tr th input[type=checkbox]', self.$el);
      select_all.addClass('pat-toggle').patternToggle({
        target: 'table.listing input[type=checkbox]',
        attribute: 'checked',
        value: 'checked',
        externalClose: false,
        preventDefault: false
      });

      // Assign the class and data attributes for the "select all of the usergroup-groupmembership view
      select_all = $('form[action*=usergroup-groupmembership] table.listing tr th input[type=checkbox]', self.$el);
      select_all.addClass('pat-toggle').patternToggle({
        target: 'table.listing input[type=checkbox]',
        attribute: 'checked',
        value: 'checked',
        externalClose: false,
        preventDefault: false
      });

      // Assign the class and data attributes for the "select all of the usergroup-usermembership view
      select_all = $('form[action*=usergroup-usermembership] table.listing tr th input[type=checkbox]', self.$el);
      select_all.addClass('pat-toggle').patternToggle({
        target: 'form[action*=usergroup-usermembership] table.listing:last input[type=checkbox]',
        attribute: 'checked',
        value: 'checked',
        externalClose: false,
        preventDefault: false
      });

      // plone/app/search/search.pt
      select_all = $("[onchange*='toggleSelect']", self.$el).attr('onchange', null);
      select_all.addClass('pat-toggle').patternToggle({
        target: 'form[name=searchform] dd.actionMenuContent input[type=checkbox]',
        attribute: 'checked',
        value: 'checked',
        externalClose: false,
        preventDefault: false
      });
      // }}}

      // Apply the preventdoublesubmit pattern to forms
      // XXX requires form_resubmit_message to be set!
      $('form', self.$el)
        .not('[action$="@@new-user"]')
        .not('[action$="@@usergroup-groupdetails"]')
        .patternPreventdoublesubmit({
          message: window.form_resubmit_message
        });

      // Add the form auto focus for the add or edit forms
      var add_form = $('form[action*="++add++"]', self.$el);
      add_form.addClass('pat-formautofocus');
      var edit_form = $('form[action*="@@edit"]', self.$el);
      edit_form.addClass('pat-formautofocus');

      /*** Login ***/
      var loginOptions = {
        title: 'Login',
        content: '#content',
        prependContent: '.portalMessage',
        actions: {
          '#login_form input[type="submit"]': {
            displayInModal: false
          }
        }
      };
      $('#personaltools-login', self.$el)
        .addClass('pat-modal')
        .patternModal(loginOptions);

      /*** Contact form ***/
      $('#siteaction-contact > a', self.$el).addClass('pat-modal');

      /*** Register form ***/
      var registerOptions = {
        buttons: '.actionButtons > input[type="submit"]'
      };
      $('#personaltools-join', self.$el)
        .addClass('pat-modal')
        .patternModal(registerOptions);

      /*** Content History ***/
      var contentHistoryOptions = {
        titleSelector: 'h2:first',
        content: '#content-core'
      };
      $('#content-history > a, #plone-action-content-history > a', self.$el)
        .addClass('pat-modal')
        .patternModal(contentHistoryOptions);

      /*** Default Page ***/
      var defaultPage = {
        actionOptions: {
          displayInModal: false
        }
      };
      $('#folderChangeDefaultPage, #folderChangeDefaultPage a, #contextSetDefaultPage a', self.$el)
        .addClass('pat-modal')
        .patternModal(defaultPage);

      /*** Add user form ***/
      var users_add = $('form[name="users_add"]', self.$el);
      if ( users_add.length > 0) {
        var addUserOptions = {
          ajaxUrl: users_add[0].action,
          triggers: ['click input[name="form.button.AddUser"]'],
          buttons: 'input[name="form.actions.register"]',
          content: '#content',
          prependContent: '.portalMessage'
        };
        $('input[name="form.button.AddUser"]')
          .addClass('pat-modal')
          .patternModal(addUserOptions);
      }

      /*** Add group form ***/
      var groups_add = $('form[name="groups_add"]', self.$el);
      if ( groups_add.length > 0) {
        var addGroupOptions = {
          ajaxUrl: groups_add[0].action,
          triggers: ['click input[name="form.button.AddGroup"]'],
          buttons: 'input[name="form.button.Save"]',
          content: '#content',
          prependContent: '.portalMessage'
        };
        $('input[name="form.button.AddGroup"]')
          .addClass('pat-modal')
          .patternModal(addGroupOptions);
      }


      /*** Content Type Restrctions form ***/
      $('#plone-contentmenu-settings > a,a#plone-contentmenu-settings', self.$el).addClass('modal-trigger').patternModal({
        width: '80%',
        contentClass: 'modal-constrain-types',
        actionOptions: {
          displayInModal: false
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
      $('#workflow-transition-advanced > a,a#workflow-transition-advanced', self.$el).addClass('modal-trigger').patternModal({
        width: '80%',
        actionOptions: {
          displayInModal: false
        }
      });

      /*** Personal preferences ***/
      var prefs = $('#plone-personal-actions-preferences > a, #personaltools-preferences > a', self.$el);
      var prefsOptions = {
        buttons: 'input[type="submit"]',
        actionOptions: {
          displayInModal: false
        }
      };
      prefs.addClass('pat-modal');
      prefs.patternModal(prefsOptions);

      /*** Rename Action ***/
      var renameOptions = {
        actionOptions: {
          displayInModal: false
        }
      };
      $('#plone-contentmenu-actions-rename a', self.$el)
        .addClass('pat-modal')
        .patternModal(renameOptions);

      /*** Delete action ***/
      function processDelete(modal, responseBody, state, xhr, form) {
        modal.redraw(responseBody);
        modal.$el.on('hidden.modal.patterns', function(e) {
            // We want to send the user to the containing folder *after* the status messages
            // have been displayed, and the user has closed the modal
            window.parent.location = modal.options.ajaxUrl.split('/').slice(0, -2).join('/');
        });
      }
      var delete_action = $('#plone-contentmenu-actions-delete > a, #plone-contentmenu-actions-delete', self.$el);
      delete_action.addClass('pat-modal');
      delete_action.on('render.modal.patterns', function(e, modal) {
        modal.options.actionOptions.onSuccess = processDelete;
      });

      // Dropdown {{{

      // toggle class on click (shows dropdown)
      $('.toolbar-dropdown > a', self.$el).each(function() {
        $(this).patternToggle({
          target: '.toolbar-dropdown',
          value: 'toolbar-dropdown-open',
          menu: 'parent'
        });
      });

      // make sure clicking on anything in the menu closes the toggled element
      $('.toolbar-dropdown .toolbar-dropdown-menu a', self.$el).click(function(e) {
          $(this).parents('.toolbar-dropdown').children('a').trigger('click');
      });

      // at opening toolbar dropdown:
      // - close all other opened dropdown buttons
      // - stretch iframe
      // at closing dropdown shrink iframe
      $(document)
        .on('add-attr.toggle.patterns', '.toolbar-dropdown > a', function(e) {
          var $el = $(this);
          $('.toolbar-dropdown-open > a').each(function() {
            if ($el[0] !== $(this)[0]) {
              $(this).trigger('click');
            }
          });
          iframe.stretch();
        })
        .on('removed-attr.toggle.patterns', '.toolbar-dropdown > a', function(e) {
          iframe.shrink();
        });

      // }}}

      // Modals Helpers {{{

      // make sure we close all dropdowns when iframe is shrinking
      iframe.$el.on('shrink.iframe', function(e) {
        $('.toolbar-dropdown-open > a').each(function() {
          $(this).trigger('click');
        });
      });

      // integration of toolbar and modals
      $(document)
        .on('before-ajax.modal.patterns', 'a.modal-trigger, a.pat-modal', function(e) {
          var $el = $(this);
          $('.toolbar-dropdown-open > a').each(function() {
            if ($el[0] !== $(this)[0]) {
              $(this).trigger('click');
            }
          });
          $('body', iframe.document).css('overflow', 'hidden');
          iframe.stretch();
        })
        .on('show.modal.patterns', 'a.modal-trigger, a.pat-modal', function(e, modal) {
          var $el = $(this);
          $('.toolbar-dropdown-open > a').each(function() {
            if ($el[0] !== $(this)[0]) {
              $(this).trigger('click');
            }
          });
          $('body', iframe.document).css('overflow', 'hidden');
          iframe.stretch();
        })
        .on('hidden.modal.patterns', 'a.modal-trigger, a.pat-modal', function(e) {
          $('body', iframe.document).css('overflow', 'visible');
          iframe.shrink();
        });

      // }}}

      // Modals {{{

      // Contents
      $('#plone-action-folderContents > a', self.$el).addClass('modal-trigger').patternModal({
        width: '96%',
        position: 'middle top',
        actionOptions: {
          onSuccess: function(modal, response, state, xhr, form){
          }
        }
      });

      // site setup
      $('#plone-sitesetup a', self.$el).addClass('modal-trigger').patternModal({
        width: '80%',
        loadLinksWithinModal: false,
        actionOptions: {
          displayInModal: false
        }
      }).on('show.modal.patterns', function(evt, modal) {
        $('a[href]', modal.$modal).each(function(){
          var href = this.href;
          var parts = href.split('/');
          parts.splice(parts.length-1, 0, '++nodiazo++');
          href = parts.join('/');

          $(this).attr('href', href);
          $(this).click(function(){
            window.open(href);
          });
        });
      });

      // Manage portlets
      var portletOptions = {
        width: '50%',
        buttons: '.formControls > input[type="submit"],.actionButtons input[type="submit"]',
        automaticallyAddButtonActions: false
      };
      $('#toolbar-manage-portlets a,#manage-dashboard a', self.$el)
      .addClass('pat-modal')
      .patternModal(portletOptions)
      .on('render.modal.patterns', function(e, modal) {
        // Kill the onchange method so we can wire up our own
        $('.section select', modal.$raw).removeAttr('onchange');
        modal.options.actions = {
            // Handle adding portlets via the select
            '.section select': {
              eventType: 'change',
              onSuccess: function(modal, response, state, xhr, form) {
                  if (modal.$modal.find('.pattern-modal-buttons input').length === 0) {
                      // The portlet didn't have an edit form (e.g. calendar)
                      modal.reloadWindow();
                  }
              },
              ajaxUrl: function($action, options) {
                var portlet = $action.val();
                var form_action = $action.parents('form').attr('action');
                return form_action + portlet;
              }
            },
            '.actionButtons input': {
              // Handle errors on portlet submission
              error: '.fieldErrorBox',
              onSuccess: function(modal, response, state, xhr, form) {
                modal.reloadWindow();
              }
            },
            // Handle moving and hiding portlets
            '.portlet-action': {
              isForm: true
            }
          };
      })
      .on('hidden.modal.patterns', function(e, modal) {
          modal.reloadWindow();
        }
      );

      // Edit/Add
      $('#plone-contentmenu-factories ul li', self.$el).addClass('is-content');
      $('#plone-contentmenu-factories ul li#plone-contentmenu-more', self.$el).removeClass('is-content');
      $('#plone-contentmenu-factories ul li#plone-contentmenu-settings', self.$el).removeClass('is-content');
      var editOptions = {
        width: '80%',
        backdropOptions: {
          closeOnClick: false
        },
        position: "center top",
        content: '#content',
        automaticallyAddButtonActions: false,
        actionOptions: {
          displayInModal: false,
          redirectOnResponse: true
        },
        actions: {
          'input#form-buttons-save, .formControls input[name="form.button.save"]': {},
          'input#form-buttons-cancel, .formControls input[name="form.button.cancel"]': {
            modalFunction: 'hide'
          }
        },
        routerOptions: {
          id: 'edit',
          pathExp: '/edit$'
        }
      };
      var addOptions = editOptions;

      addOptions.actionOptions.redirectOnResponse = true;
      $('#plone-action-edit > a, #plone-contentmenu-factories ul li.is-content a', self.$el)
        .addClass('pat-modal')
        .patternModal(editOptions);

      delete addOptions.routerOptions;
      $('#plone-contentmenu-factories ul li.is-content a', self.$el)
        .addClass('pat-modal')
        .patternModal(addOptions);


      // Content Rules
      var rulesOptions = {
        width: '80%',
        content: '#content-core',
        loadLinksWithinModal: false
      };
      $('#plone-action-contentrules > a', self.$el)
        .addClass('pat-modal')
        .patternModal(rulesOptions).
        on('render.modal.patterns', function(e, modal) {
          modal.options.actions = {
            'table.listing a': {
              ajaxUrl: function($action, options) {
                return $action.attr('href').replace(/@@/g, "++nodiazo++/@@");
              },
              displayInModal: false
            },
            'input[name="form.button.AddAssignment"]': {},
            'a[href$="@@rules-controlpanel"]': {
              displayInModal: false
            }
          };
        });

      /***  Sharing  ***/
      $('#plone-action-local_roles > a', self.$el).addClass('modal-trigger').patternModal({
        width: '80%',
        buttons: '#sharing-save-button, input[name="form.button.Cancel"]',
        automaticallyAddButtonActions: false,
        actions: {
          '#sharing-search-button': {},
          'a': {},
          'input[name="form.button.Cancel"]': {
            modalFunction: 'hide'
          },
          '#sharing-save-button': {
            onSuccess: function(modal, responseBody, state, xhr, form) {
              modal.redraw(responseBody);
              modal.$el.on('hidden.modal.patterns', function(e) {
                // We want to send the user to the original object *after* the status messages
                // have been displayed, and the user has closed the modal
                window.parent.location = modal.options.ajaxUrl.split('/').slice(0, -1).join('/');
              });
            }
          }
        }
      });

      self.$el.find('.mce_editable').addClass('pat-tinymce').each(function(){
        var $tiny = $(this);
        var config = $.parseJSON($tiny.attr('data-mce-config'));
        config.content_css = config.portal_url + '/base.css';
        delete config.customplugins;
        delete config.plugins;
        delete config.theme;
        $tiny.attr({
          'data-pat-tinymce': JSON.stringify({
            relatedItems: {
              vocabularyUrl: config.portal_url + '/@@getVocabulary?name=plone.app.vocabularies.Catalog'
            },
            rel_upload_path: '@@fileUpload',
            folder_url: config.document_base_url,
            tiny: config,
            prependToUrl: 'resolveuid/',
            linkAttribute: 'UID',
            prependToScalePart: '/@@images/image/'
          })
        });
      });


      // XXX important, run pattern mods against overlays
      $('body').on('rendered.modal.patterns', function(){
        (new Toolbar($(this))); // just run init again...
      });

    }

  });

  // initialize only if we are not in top frame (we are in toolbar's iframe)
  if (window.parent !== window) {
    $('body').addClass('pat-plone-toolbar');
    registry.scan($('body'));
    Router.redirect();
    Router.start();
  }

  return Toolbar;

});
