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

  // BBB: we need to hook pattern to classes which plone was using until now
  var Toolbar = {
    name: "plone-toolbar",
    transform: function($root) {
      if ($root.hasClass('modal')) {
        /* do not run in modal */
        return;
      }

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

      // Contents
      $('#plone-action-folderContents > a').addClass('modal-trigger').patternModal({
        width: '60%',
        templateOptions: {
          buttons: '#folderlisting-main-table > input.context,' +
                   '#folderlisting-main-table > input.standalone,' +
                   '.formControls > input',
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
                modal.options.handleLinkAction.apply(modal, [$action, {}]);
              } else {
                // XXX hack the rename form action url
                if(hasForm){
                  var current = form.attr('action');
                  response = response.replace('action="folder_rename_form',
                                              'action="' + current + '/folder_rename_form');
                }
                //modal.redraw(response);
              }
            }
          }
        }
      }).on('before-events-setup.modal.patterns', function(e, modal){
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
          $el.replaceWith($('<div class="pagination pagination-centered"/>').append($pagination));
        });
      }).on('after-render.modal.patterns', function(e, modal){
        // normalize buttons
        modal.$modal.find('input[type="submit"]').addClass('standalone').removeClass('context');
        $('.modal-body #folderlisting-main-table td:not(.draggable) > a:not([href$="folder_contents"])', modal.$modal).css({
          color: '#333333'
        }).off('click').on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.parent.location.href = $(this).attr('href');
        });
      });


      // site setup
      $('#plone-sitesetup a').addClass('modal-trigger').patternModal({
        width: '80%',
        templateOptions: {
          loadLinksWithinModal: false,
          actionsOptions: {
            displayInModal: false
          }
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
        templateOptions: {
          buttons: '.formControls > input[type="submit"],.actionButtons input[type="submit"]',
          automaticallyAddButtonActions: false
        }
      };
      $('#toolbar-manage-portlets a,#manage-dashboard a')
      .addClass('pat-modal')
      .attr('data-pat-modal', JSON.stringify(portletOptions))
      .on('render.modal.patterns', function(e, modal) {
        // Kill the onchange method so we can wire up our own
        $('.section select', modal.$raw).removeAttr('onchange');
        modal.options.templateOptions.actions = {
            // Handle adding portlets via the select
            '.section select': {
              eventType: 'change',
              onSuccess: function(modal, response, state, xhr, form) {
                  if (modal.$modal.find('.pat-modal-buttons input').length === 0) {
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
      $('#plone-contentmenu-factories ul li').addClass('is-content');
      $('#plone-contentmenu-factories ul li#plone-contentmenu-more').removeClass('is-content');
      $('#plone-contentmenu-factories ul li#plone-contentmenu-settings').removeClass('is-content');
      var editOptions = {
        width: '80%',
        backdropOptions: {
          closeOnClick: false
        },
        templateOptions: {
          content: '#content',
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
      var addOptions = editOptions;
      addOptions.templateOptions.actionsOptions.redirectOnResponse = true;
      $('#plone-action-edit > a, #plone-contentmenu-factories ul li.is-content a')
        .addClass('pat-modal')
        .attr('data-pat-modal', JSON.stringify(editOptions));

      $('#plone-contentmenu-factories ul li.is-content a')
        .addClass('pat-modal')
        .attr('data-pat-modal', JSON.stringify(addOptions));


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
            'input[name="form.button.AddAssignment"]': {},
            'a[href$="@@rules-controlpanel"]': {
              displayInModal: false
            }
          };
        });

      /***  Sharing  ***/
      $('#plone-action-local_roles > a').addClass('modal-trigger').patternModal({
        width: '80%',
        templateOptions: {
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
        }
      });

    }
  };

  registry.register(Toolbar);

  // initialize only if we are not in top frame (we are in toolbar's iframe)
  if (window.parent !== window) {
    registry.scan($('body'));
  }

  return Toolbar;

});
