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


if (window.jQuery) {
  define( "jquery", [], function () {
    "use strict";
    return window.jQuery;
  } );
}
define([
  'jquery',
  'js/jquery.iframe',
  'jam/Patterns/src/registry',
  'jam/jquery-form/jquery.form.js',
  'js/patterns/toggle',
  'js/patterns/modal.js',
  'js/bundles/widgets'
//  'js/overlays'
], function($, iframe, registry) {
  "use strict";

  window.plone = window.plone || {};
  window.plone.toolbar = window.plone.toolbar || {};

  $(document).ready(function() {

    // Dropdown {{{

    // toggle class on click (shows dropdown)
    $('.toolbar-dropdown > a').toggle({
      target: '.toolbar-dropdown',
      value: 'toolbar-dropdown-open'
    });

    // at opening toolbar dropdown:
    // - close all other opened dropdown buttons
    // - stretch iframe
    // at closing dropdown shrink iframe
    $(document)
      .on('attr-add.toggle.patterns', '.toolbar-dropdown > a', function(e) {
        var $el = $(this);
        $('.toolbar-dropdown-open > a').each(function() {
          if ($el[0] !== $(this)[0]) {
            $(this).trigger('click');
          }
        });
        iframe.stretch();
      })
      .on('attr-removed.toggle.patterns', '.toolbar-dropdown > a', function(e) {
        iframe.shrink();
      });

    // }}}

    // Modals {{{

    // mark buttons which open in modal
    $('#plone-action-local_roles > a').addClass('modal-trigger').modal();

    // make sure we close all dropdowns when iframe is shrinking
    iframe.$el.on('shrink.iframe', function(e) {
      $('.toolbar-dropdown-open > a').each(function() {
        $(this).trigger('click');
      });
    });

    // integration of toolbar and modals
    $(document)
      .on('before-ajax.modal.patterns', 'a.modal-trigger', function(e) {
        var $el = $(this);
        $('.toolbar-dropdown-open > a').each(function() {
          if ($el[0] !== $(this)[0]) {
            $(this).trigger('click');
          }
        });
        $('body', iframe.document).css('overflow', 'hidden');
        iframe.stretch();
      })
      .on('show.modal.patterns', 'a.modal-trigger', function(e) {
        var $el = $(this);
        $('.toolbar-dropdown-open > a').each(function() {
          if ($el[0] !== $(this)[0]) {
            $(this).trigger('click');
          }
        });
        $('body', iframe.document).css('overflow', 'hidden');
        iframe.stretch();
      })
      .on('hidden.modal.patterns', 'a.modal-trigger', function(e) {
        $('body', iframe.document).css('overflow', 'visible');
        iframe.shrink();
      });

    // modal template for plone
    function modalTemplate($modal, options) {
      var $content = $modal.html();

      options = $.extend({
        title: 'h1.documentFirstHeading',
        buttons: '.formControls > input[type="submit"]'
      }, options);

      $modal
        .html('<div class="modal-header">' +
              '  <a class="close">&times;</a>' +
              '  <h3></h3>' +
              '</div>' +
              '<div class="modal-body"></div>' +
              '<div class="modal-footer"></div>');


      $('.modal-header > h3', $modal).html($(options.title, $content).html());
      $('.modal-body', $modal).html($content);
      $(options.title, $modal).remove();
      $('.modal-header > a.close', $modal)
        .off('click')
        .on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $(e.target).trigger('close.modal.patterns');
        });

      // cleanup html
      $('.row', $modal).removeClass('row');

      $(options.buttons, $modal).each(function() {
        var $button = $(this);
        $button.clone()
          .appendTo($('.modal-footer', $modal))
          .off('click').on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $button.trigger('click');
          });
        $button.hide();
      });

    }

    // }}}

    // Edit form
    //$('#plone-toolbar #plone-action-edit > a').ploneOverlay(
    //  $.extend(window.plone.toolbar, {
    //    events: {
    //      'click .modal-body input[name="form.button.cancel"]': {},
    //      'click .modal-body input[name="form.button.save"]': {
    //        contentFilters: [ '#portal-column-content' ]
    //      }
    //    }
    //  }));

    function ajaxForm($modal, options) {
      options = $.extend({
        buttons: {},
        timeout: 5000,
        formError: '.portalMessage.error'
      }, options);

      $.each(options.buttons, function(button, buttonOptions) {
        var $button = $(button, $modal);

        buttonOptions = $.extend({}, options, buttonOptions);

        // pass button that was clicked when submiting form
        var extraData = {};
        extraData[$button.attr('name')] = $button.attr('value');

        $button.on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $button.parents('form').ajaxSubmit({
            timeout: buttonOptions.timeout,
            dataType: 'html',
            data: extraData,
            url: $button.parents('form').attr('action'),
            error: function(xhr, textStatus, errorStatus) {
              console.log('error');
              if (textStatus === 'timeout') {
                if (buttonOptions.onTimeout) {
                  buttonOptions.onTimeout(xhr, errorStatus);
                } else {
                  // TODO: show that request timeouted
                  console.log('TODO: make below code work');
                  //var $timeout = $('<p/>').html(buttonOptions.timeoutText);

                  //$('a.retry', $timeout).on('click', function(e) {
                  //  e.stopPropagation();
                  //  e.preventDefault();
                  //  self.show();
                  //});
                  //$('a.close', $timeout).on('click', function(e) {
                  //  e.stopPropagation();
                  //  e.preventDefault();
                  //  self.hide();
                  //});

                  //$('.progress', $modal)
                  //  .removeClass('progress-striped')
                  //  .addClass('progress-danger')
                  //  .after($timeout);

                }

              // on "error", "abort", and "parsererror"
              } else if (buttonOptions.onError) {
                buttonOptions.onError(xhr, textStatus, errorStatus);
              } else {
                // TODO: notify about error (when notification center is done)
                $button.trigger('close.modal.patterns');
              }
            },
            success: function(response, state, xhr, form) {
              var responseBody = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                      .replace('<body', '<div').replace('</body>', '</div>'));

              // if error is found
              if ($(buttonOptions.formError, responseBody).size() !== 0) {
                if (buttonOptions.onFormError) {
                  buttonOptions.onFormError(responseBody, state, xhr, form);
                } else {
                  $modal.html(responseBody.html());
                  modalTemplate($modal);
                  registry.scan($modal);
                }

              // custom success function
              } else if (buttonOptions.onSuccess) {
                buttonOptions.onSuccess(responseBody, state, xhr, form);

              } else {
                $button.trigger('close.modal.patterns');
              }
            }
          });
        });
      });
    }

    // Sharing
    $('#plone-action-local_roles > a').on('show.modal.patterns', function(e, modal) {

      function initModal($modal) {
        modalTemplate($modal, {
          buttons: 'input[name="form.button.Save"],input[name="form.button.Cancel"]'
        });

        // FIXME: we shouldn't be hacking like this
        $('#link-presentation', $modal).remove();

        ajaxForm(modal.$modal, {
          buttons: {
            '.modal-body input[name="form.button.Cancel"]': {},
            '.modal-body input[name="form.button.Save"]': {},
            '.modal-body input[name="form.button.Search"]': {
              onSuccess: function(responseBody, state, xhr, form) {
                modal.$modal.html(responseBody.html());
                initModal(modal.$modal);
                registry.scan(modal.$modal);
              }
            }
          }
        });
      }

      initModal(modal.$modal);

    });

  });

});
