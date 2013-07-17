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
    $('#plone-sitesetup a').addClass('modal-trigger').patternModal({
      width: '80%'
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
    $('#toolbar-manage-portlets a,#manage-dashboard a').attr('data-pat-modal', JSON.stringify(portletOptions))
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
    $('#plone-action-edit > a, #plone-contentmenu-factories ul li:not(#plone-contentmenu-settings) a')
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



    /***  Sharing  ***/
    $('#plone-action-local_roles > a').addClass('modal-trigger').patternModal({
      width: '80%',
      templateOptions: {
        actions: {
          '#sharing-search-button': function(){},
          'a': function(){}
        },
        buttons: '#sharing-save-button, input[name="form.button.Cancel"]'
      }
    }).on('render.modal.patterns', function(e, modal) {
      modal.options.templateOptions.actions['.modal-footer #sharing-save-button'] = {
        onSucess: function redirectUp(modal, responseBody, state, xhr, form) {
          modal.redraw(responseBody);
          modal.$el.on('hidden.modal.patterns', function(e) {
            // We want to send the user to the original object *after* the status messages
            // have been displayed, and the user has closed the modal
            window.parent.location = modal.options.ajaxUrl.split('/').slice(0, -1).join('/');
          });
        }
      };
    });


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


//    // personal preferences
    var prefs = $('#plone-personal-actions-preferences > a');
    var prefsOptions = {
      templateOptions: {
        buttons: 'input[type="submit"]'
      }
    };
    prefs.addClass('pat-modal');
    prefs.attr('data-pat-modal', JSON.stringify(prefsOptions));
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
