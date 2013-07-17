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
  'mockup-iframe',
  'mockup-registry',
  'mockup-patterns-toggle',
  'mockup-patterns-modal',
  'mockup-patterns-tinymce',
  'mockup-bundles-widgets'
], function($, iframe, registry, Toggle, Modal, TinyMCE) {
  "use strict";

  $(document).ready(function() {

    // Dropdown {{{

    // toggle class on click (shows dropdown)
    $('.toolbar-dropdown > a').each(function() {
      $(this).patternToggle({
        target: '.toolbar-dropdown',
        value: 'toolbar-dropdown-open',
        menu: 'parent'
      });
    });

    // make sure clicking on anything in the menu closes the toggled element
    $('.toolbar-dropdown .toolbar-dropdown-menu a').click(function(e) {
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

    // Contents {{{
    $('#plone-action-folderContents > a').addClass('modal-trigger').patternModal({
      width: '80%',
      templateOptions: {
        buttons: '#folderlisting-main-table > input.context,' +
                 '#folderlisting-main-table > input.standalone,' +
                 '.modal-body .formControls > input',
        actionsOptions: {
          onSuccess: function(modal, response, state, xhr, form){
            // handle content_status_history differently than other buttons
            var hasForm = form && form.attr;
            var action = hasForm ? form.attr('action'): null;
            if(action && action.indexOf('content_status_history') !== -1){
              // load back the folder contents
              var $action = $('<a href="' +
                action.replace('content_status_history', 'folder_contents') +
                '"/>');
              modal.options.handleLinkAction.apply(modal, [$action]);
            } else {
              // XXX hack the rename form action url
              if(hasForm){
                var current = form.attr('action');
                response = response.replace('action="folder_rename_form',
                                            'action="' + current + '/folder_rename_form');
              }
              modal.redraw(response);
            }
          }
        }
      }
    }).on('show.modal.patterns', function(e, modal) {
      // TODO: not sure exectly how to handle this for now we hide it
      $('#plone-document-byline', modal.$modal).hide();
      $('.modal-footer input.context', modal.$modal).removeClass('context').addClass('standalone');
      $('.listingBar', modal.$modal).each(function() {  // TODO: we shouldn't hack like this
        var $el = $(this),
            $pagination = $('<ul/>'),
            $previous, $next;

        // create boostrap style pagination
        $('> *', $el).each(function() {
          if ($(this).hasClass('previous')) {
            $previous = $('<li/>').append($('a', this).clone());
          } else if ($(this).hasClass('next')) {
            $next = $('<li/>').append($('a', this).clone());
          } else if ($.nodeName(this, 'span')) {
            if ($('a', this).size() !== 0) {
              $pagination.append($('<li/>').append($('a', this).clone()));
              if ($(this).html().indexOf("...") !== -1) {
                $pagination.append($('<li class="deactive"><span>...</span></li>'));
              }
            } else {
              $pagination.append($('<li class="active"/>').append($(this).clone()));
            }
          } else {
            $pagination.append($('<li/>').append($(this).clone()));
          }
        });
        if ($previous) {
          $pagination.prepend($previous);
        }
        if ($next) {
          $pagination.append($next);
        }
        $el.hide().before($('<div class="pagination pagination-centered"/>').append($pagination));
      });
    }).on('shown.modal.patterns linkActionSuccess.modal.patterns', function(e, modal){
      $('.modal-body #folderlisting-main-table td:not(.draggable) > a:not([href$="folder_contents"])', modal.$modal).css({
        color: '#333333'
      }).off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.location.href = $(this).attr('href');
      });
    });
    // }}}

    // site setup
    $('#plone-personal-actions-plone_setup a').on('show.modal.patterns', function(evt, modal) {
      $('a[href$=controlpanel]', modal.$modal).each(function(){
        var fixedhref = this.href;
        fixedhref = fixedhref.replace(/@@/g, "++nodiazo++/@@");

        $(this).attr('href', fixedhref);
        $(this).click(function(){
          window.open(fixedhref);
        });
      });
    });

    var portletOptions = {
      templateOptions: {
        actions: {
          // Handle the main portlets listing screen submit
          '.section form': {
            eventType: 'submit',
            isForm: true
          },
          '.actionButtons input': {
            // Handle errors on portlet submission
            error: '.fieldErrorBox'
          }
        }
      }
    };
    $('#toolbar-manage-portlets a,#plone-action-content-history > a').attr('data-pat-modal', JSON.stringify(portletOptions))
    .on('show.modal.patterns', function(evt, modal) {
      // Kill the onchange method so we can wire up our own
      $('.section select').removeAttr('onchange');
      $('.section select').on('change', function(e) {
          var portlet = $(this).val();
          var form_action = $(this).parents('form').attr('action');
          // Load the value of the selected portlet as a link
          modal.options.handleLinkAction.apply(
            modal,
            [$('<a href="' + form_action + portlet + '">foo</a>'), {}]
          );
      });
    });

    // Edit/Add
    var editOptions = {
      width: '80%',
      templateOptions: {
        content: '.template-edit #content-core, .template-atct_edit #content',
        automaticallyAddButtonActions: false,
        actionsOptions: {
          displayInModal: false
        },
        actions: {
          'input#form-buttons-save, .formControls input[name="form.button.save"]': {},
          'input#form-buttons-cancel, .formControls input[name="form.button.cancel"]': {
            modalFunction: 'hide'
          }
        }
      }
    };
    $('#plone-action-edit > a, #plone-contentmenu-factories ul a')
      .addClass('pat-modal')
      .attr('data-pat-modal', JSON.stringify(editOptions));


    // Content Rules
    var rulesOptions = {
      width: '80%',
      templateOptions: {
        content: '#content-core',
        loadLinksWithinModal: false
      }
    };
    $('#plone-action-contentrules > a')
      .addClass('pat-modal')
      .attr('data-pat-modal', JSON.stringify(rulesOptions)).
      on('render.modal.patterns', function(e, modal) {
        modal.options.templateOptions.actions = {
          'table.listing a': {
            ajaxUrl: function($action, options) {
              return $action.attr('href').replace(/@@/g, "++nodiazo++/@@");
            },
            displayInModal: false
          },
          'input[name="form.button.AddAssignment"]': {}
        };
      });


//
//    // Sharing
    $('#plone-action-local_roles > a').addClass('pat-modal');
//    Modal.prepareModal('#plone-action-local_roles > a', function(modal, modalInit, modalOptions) {
//      Modal.createTemplate(modal.$modal, {
//        buttons: 'input[name="form.button.Save"],input[name="form.button.Cancel"]'
//      });
//      // FIXME: we shouldn't be hacking like this
//      $('#link-presentation', modal.$modal).remove();
//      Modal.createAjaxForm(modal, modalInit, modalOptions, {
//        buttons: {
//          '.modal-body input[name="form.button.Cancel"]': {},
//          '.modal-body input[name="form.button.Save"]': {},
//          '.modal-body input[name="form.button.Search"], dl.portalMessage.info > dd > a': {
//            onSuccess: function(modal, responseBody, state, xhr, form) {
//              modal.$modal.html(responseBody.html());
//              modalInit(modal, modalInit, modalOptions);
//              modal.positionModal();
//              registry.scan(modal.$modal);
//            }
//          }
//        }
//      });
//
//    });
//
//    // Rules form
//    Modal.prepareModal('#plone-action-contentrules > a', function(modal, modalInit, modalOptions) {
//      Modal.createTemplate(modal.$modal, {
//        buttons: 'input[name="form.button.AddAssignment"],' +
//                 'input[name="form.button.Enable"],' +
//                 'input[name="form.button.Disable"],' +
//                 'input[name="form.button.Bubble"],' +
//                 'input[name="form.button.NoBubble"],' +
//                 'input[name="form.button.Delete"]'
//      });
//      $('.modal-body #content-core > p:first > a', modal.$modal).on('click', function(e) {
//        window.parent.location.href = $(this).attr('href');
//      });
//      Modal.createTemplate(modal, modalInit, modalOptions, {
//        buttons: {
//          'input[name="form.button.AddAssignment"],input[name="form.button.Enable"],input[name="form.button.Disable"],input[name="form.button.Bubble"],input[name="form.button.NoBubble"],input[name="form.button.Delete"]': {
//            onSuccess: function(modal, responseBody, state, xhr, form) {
//              modal.$modal.html(responseBody.html());
//              modalInit(modal, modalInit, modalOptions);
//              modal.positionModal();
//              registry.scan(modal.$modal);
//            }
//          }
//        }
//      });
//    });
//
//    // Delete Action
    function processDelete(modal, responseBody, state, xhr, form) {
        modal.redraw(responseBody);
        modal.$el.on('hidden.modal.patterns', function(e) {
            // We want to send the user to the containing folder *after* the status messages
            // have been displayed, and the user has closed the modal
            window.parent.location = modal.options.ajaxUrl.split('/').slice(0, -2).join('/');
        });
    }
    var delete_action = $('#plone-contentmenu-actions-delete > a');
    delete_action.addClass('pat-modal');
    delete_action.on('render.modal.patterns', function(e, modal) {
      modal.options.templateOptions.actionsOptions.onSuccess = processDelete;
    });
//
//    // Rename Action
    $('#plone-contentmenu-actions-rename > a').addClass('pat-modal');
//
//    // Change content item as default view...
    $('#contextSetDefaultPage > a, #folderChangeDefaultPage > a').addClass('pat-modal');
//
//    // Add forms
//    Modal.prepareModal('#plone-contentmenu-factories > ul > li > a', function(modal, modalInit, modalOptions) {
//      Modal.createTemplate(modal.$modal, {
//        buttons: 'input[name="form.buttons.save"],input[name="form.buttons.cancel"],input[name="form.button.save"],input[name="form.button.cancel"]'
//      });
//      $('span.label', modal.$modal).removeClass('label');
//      $('.mce_editable', modal.$modal).addClass('pat-plone-tinymce');
//      Modal.createAjaxForm(modal, modalInit, modalOptions, {
//        buttons: {
//          '.modal-body input[name="form.buttons.cancel"],.modal-body input[name="form.button.cancel"]': {},
//          '.modal-body input[name="form.buttons.save"],.modal-body input[name="form.button.save"]': {
//            onSuccess: function(modal, responseBody, state, xhr, form) {
//              $('#portal-column-content', window.parent.document).html(
//                  $('#portal-column-content', responseBody).html());
//              window.parent.location.href = $($(xhr.responseText).filter('base')[0]).attr('href');
//            }
//          }
//        }
//      });
//    }, { width: '80%' });


    // "Restrictions..." form
    $('#plone-contentmenu-settings > a').addClass('modal-trigger').patternModal({
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


/*
    Modal.prepareModal('#plone-contentmenu-settings > a', function(modal, modalInit, modalOptions) {
      Modal.createTemplate(modal.$modal);
      // FIXME: we should hack like this
      var $details = $('#details', modal.$modal)
        .removeAttr('style')
        .removeAttr('id')
        .first().parent();

      function show_submenu($modal) {
        if ($('#mode_enable', $modal).is(':checked')) {
          $details.attr({'id': 'details', 'style': ''});
        } else {
          $details.attr({'id': 'details', 'style': 'display:none;'});
        }
      }
      function check_mode($modal, value) {
        // The logic here is that from #6151, comment 12.
        var $preferred = $('#' + value, $modal),
            $allowed = $('#' + value + '_allowed', $modal),
            $allowed_hidden = $('#' + value + '_allowed_hidden', $modal);

        // type is not preferred, so it is not allowed, too.
        // We uncheck and disable (ghost) the allowed checkbox
        if (!$preferred.is(':checked')) {
          $allowed.attr('checked', false);
          $allowed.attr('disabled', true);

        // type _is_ preferred, so user _may_ want to make it
        // an "allowed-only" type by checking the "allowed" checkbox.
        // We need to enable (unghost) the allowed checkbox
        } else {
          $allowed.attr('disabled', false);
        }
      }

      $('input[name="constrainTypesMode:int"]', modal.$modal)
        .removeAttr('onclick')
        .on('click', function() {
          show_submenu($(this).parents('.modal'));
        });
      $('input[name="currentPrefer:list"],input[name="currentAllow:list"]', modal.$modal)
        .removeAttr('onclick')
        .on('click', function() {
          check_mode($(this).parents('.modal'), $(this).attr('id'));
        });
      show_submenu(modal.$modal);

      Modal.createAjaxForm(modal, modalInit, modalOptions, {
        buttons: {
          '.modal-body input[name="form.button.Cancel"]': {},
          '.modal-body input[name="form.button.Save"]': {
            onSuccess: function(modal, responseBody, state, xhr) {
              $('#plone-contentmenu-factories').html(
                  $('#plone-contentmenu-factories', responseBody).html());
              modal.hide();
            }
          }
        }
      });
    });
*/


   // Advanced workflow
   // This form needs additional JS and CSS for the calendar widget.
   // The AJAX form doesn't load it from the javascript_head_slot.
    $('#workflow-transition-advanced > a').addClass('modal-trigger').patternModal({
      width: '80%',
      templateOptions: {
        actionsOptions: {
          displayInModal: false
        }
      }
    });

    $('#manage-dashboard a').addClass('modal-trigger').patternModal({
      width: '80%',
    });

//    // personal preferences
    $('#plone-personal-actions-preferences > a').addClass('pat-modal');
//    // Content history
    $('#plone-action-content-history > a').addClass('pat-modal');
//
//    // }}}
//
  });

  return {
    scan: function(selector) {
      registry.scan($(selector));
    }
  };

});
