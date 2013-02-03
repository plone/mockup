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
  'js/patterns/toggle',
  'js/patterns/modal.js',
  'js/bundles/widgets'
//  'js/overlays'
], function($, iframe) {
  "use strict";

  window.plone = window.plone || {};
  window.plone.toolbar = window.plone.toolbar || {};

  $(document).ready(function() {

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

    //
    function templateBootstrapModal($modal, options) {
      var $content = $modal.html();

      options = $.extend({
        title: 'h1.documentFirstHeading',
        buttons: '.formControls > input[type="submit"]'
      }, options);

      $modal
        .addClass('modal')
        .addClass('fade')
        .html('<div class="modal-header">' +
              '  <a class="close" data-dismiss="modal">&times;</a>' +
              '  <h3></h3>' +
              '</div>' +
              '<div class="modal-body"></div>' +
              '<div class="modal-footer"></div>');


      $('.modal-header > h3', $modal).html($(options.title, $content).html());
      $(options.title, $content).remove();
      $('.modal-body', $modal).html($content);
      $('.modal-header > a', $modal)
        .off('click')
        .on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $.trigger('close.modal.patterns');
        });

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

    // Sharing
    $('#plone-action-local_roles > a').patModal({
      template: function($modal) {
        templateBootstrapModal($modal, {
          buttons: 'input[name="form.button.Save"],input[name="form.button.Cancel"]'
        });
        // FIXME: we shouldn't hack like this
        $('#link-presentation', $modal).remove();
      },
      events: {
        'click .modal-body input[name="form.button.Search"]': {
          onSuccess: function(responseBody) {
            var self = this;
            self.$modal.html('');
            self.$modal.append($('> *', self.modalTemplate(responseBody)));
            self.initModalEvents(self.$modal);
          }
        },
        'click .modal-body input[name="form.button.Cancel"]': {},
        'click .modal-body input[name="form.button.Save"]': {}
      }
    });

    $(document)
      // at opening toolbar dropdown:
      // - close all other opened dropdown buttons
      // - stretch iframe
      .on('add.toggle.patterns', '.toolbar-dropdown > a.pat-toggle', function(e) {
        var $el = $(this);
        $('.toolbar-dropdown-open > a').each(function() {
          if ($el[0] !== $(this)[0]) {
            $(this).trigger('click');
          }
        });
        iframe.stretch();
      })
      // at closing dropdown shrink iframe
      .on('removed.toggle.patterns', '.toolbar-dropdown > a.pat-toggle', function(e) {
        iframe.shrink();
      })
      // integration of toolbar and modals
      .on('beforeajax.modal.patterns', 'a.pat-modal', function(e) {
        var $el = $(this);
        $('.toolbar-dropdown-open > a').each(function() {
          if ($el[0] !== $(this)[0]) {
            $(this).trigger('click');
          }
        });
        $('body', iframe.document).css('overflow', 'hidden');
        iframe.stretch();
      })
      .on('show.modal.patterns', 'a.pat-modal', function(e) {
        var $el = $(this);
        $('.toolbar-dropdown-open > a').each(function() {
          if ($el[0] !== $(this)[0]) {
            $(this).trigger('click');
          }
        });
        $('body', iframe.document).css('overflow', 'hidden');
        iframe.stretch();
      })
      .on('hidden.modal.patterns', 'a.pat-modal', function(e) {
        $('body', iframe.document).css('overflow', 'visible');
        iframe.shrink();
      });


    // make sure we close all dropdowns when iframe is shrinking
    iframe.$el.on('shrink.iframe', function(e) {
      $('.toolbar-dropdown-open > a').each(function() {
        $(this).trigger('click');
      });
    });

  });

});
