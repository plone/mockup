// This script will register Plone's overlays for toolbar actions.
//
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
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
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:false, undef:true, strict:true, trailing:true, browser:true */


(function($, Patterns, undefined) {
"use strict";

$(document).ready(function() {

  // Edit form
  $('#plone-toolbar #plone-action-edit > a').ploneOverlay({
    events: {
      'click .modal-body input[name="form.button.cancel"]': {},
      'click .modal-body input[name="form.button.save"]': {
        contentFilters: [ '#portal-column-content' ]
      }
    }
  });

  // Rules form
  $('#plone-toolbar #plone-action-contentrules > a').ploneOverlay({
  });

  // Sharing form
  $('#plone-toolbar #plone-action-local_roles > a').ploneOverlay({
    modalTemplate: function($modal) {
      // FIXME: we should hack like this
      $('#link-presentation', $modal).remove();
      return $modal;
    },
    ajaxSubmitOptions: {
      contentButtons: 'input[name="form.button.Save"],input[name="form.button.Cancel"]'
    },
    events: {
      'click .modal-body input[name="form.button.Search"]': {
        onSuccess: function(responseBody) {
          var self = this;
          self.$modal.html('');
          self.$modal.append($('> *', self.modalTemplate(responseBody)));
          self.initModalEvents(self.$modal);

          // patterns integration
          if (Patterns) {
            Patterns.initialize(self.$modal);
            $('[data-pattern~="tabs"] > li > a', self.$modal).on('shown', function() {
              self.resizeModal(self.$modal);
            });
          }
        }
      },
      'click .modal-body input[name="form.button.Cancel"]': {},
      'click .modal-body input[name="form.button.Save"]': {
      }
    }
  });

  // Delete Action
  $('#plone-toolbar #plone-contentmenu-actions > ul > li#plone-contentmenu-actions-delete > a').ploneOverlay({
    events: {
      'click .modal-body input[name="form.button.Cancel"]': {},
      'click .modal-body input.destructive': {
        onSuccess: function(responseBody, state, xhr) {
          window.parent.location.href = window.parent.location.href + '/..';
        }
      }
    }
  });

  // Rename Action
  $('#plone-toolbar #plone-contentmenu-actions > ul > li#plone-contentmenu-actions-rename > a').ploneOverlay({
    events: {
      'click .modal-body input[name="form.button.Cancel"]': {},
      'click .modal-body input[name="form.button.RenameAll"]': {
        onSuccess: function(responseBody, state, xhr) {
          window.parent.location.href = responseBody.data('context-url') || window.parent.location.href;
        }
      }
    }
  });

  // Change content item as default view...
  $('#plone-toolbar #plone-contentmenu-display > ul > li#folderChangeDefaultPage > a,' +
    '#plone-toolbar #plone-contentmenu-display > ul > li#contextSetDefaultPage > a').ploneOverlay({
    modalTemplate: function($modal) {
      // FIXME: we should hack like this
      $('form > dl', $modal).addClass('default-page-listing');
      $('input[name="form.button.Cancel"]', $modal).attr('class', 'standalone');
      return $modal;
    },
    events: {
      'click .modal-body input[name="form.button.Cancel"]': {},
      'click .modal-body input[name="form.button.Save"]': {
        onSuccess: function(responseBody, state, xhr) {
          window.parent.location.href = window.parent.location.href;
        }
      }
    }
  });

  // Add forms
  $('#plone-toolbar #plone-contentmenu-factories > ul > li:not(#plone-contentmenu-settings) > a').ploneOverlay({
    events: {
      'click .modal-body input[name="form.button.cancel"]': {},
      'click .modal-body input[name="form.button.save"]': {
        onSuccess: function(responseBody, state, xhr) {
          window.parent.location.href = responseBody.data('context-url') || window.parent.location.href;
        }
      }
    }
  });

  // "Restrictions..." form
  var restrictionsOverlayOptions = {
    modalTemplate: function($modal) {
      var $details = $('#details', $modal)
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

      $('input[name="constrainTypesMode:int"]', $modal)
        .removeAttr('onclick')
        .on('click', function() {
          show_submenu($(this).parents('.modal'));
        });
      $('input[name="currentPrefer:list"],input[name="currentAllow:list"]', $modal)
        .removeAttr('onclick')
        .on('click', function() {
          check_mode($(this).parents('.modal'), $(this).attr('id'));
        });
      show_submenu($modal);

      return $modal;
    },
    events: {
      'click .modal-body input[name="form.button.Cancel"]': {},
      'click .modal-body input[name="form.button.Save"]': {
        onSuccess: function(responseBody, state, xhr) {
          var self = this;
          $('#plone-contentmenu-factories').html(
              $('#plone-contentmenu-factories', responseBody).html());
          Patterns.initialize($('#plone-contentmenu-factories'));
          $('#plone-toolbar #plone-contentmenu-factories > ul > li#plone-contentmenu-settings > a').ploneOverlay(restrictionsOverlayOptions);
          self.hide();
        }
      }
    }
  };
  $('#plone-toolbar #plone-contentmenu-factories > ul > li#plone-contentmenu-settings > a').ploneOverlay(restrictionsOverlayOptions);

  // Advance workflow
  $('#plone-toolbar #plone-contentmenu-workflow > ul > li#workflow-transition-advanced > a').ploneOverlay({
    modalTemplate: function($modal) {
      // FIXME: we should hack like this
      $('#workflow_action', $modal).parent().find('> br').remove();
      return $modal;
    },
    events: {
      'click .modal-body input[name="form.button.Cancel"]': {},
      'click .modal-body input[name="form.button.Publish"]': {}
    }
  });


  // Site setup
  //$('#plone-toolbar #plone-personal-actions > ul > li#plone-personal-actions-plone_setup a').ploneOverlay({
  //  onShow: function() { $(this).patternToggle('toggle'); },
  //  onLoaded: function() {
  //    var overlay = this,
  //    el = overlay.el;
  //    el.find('a').on('click', function(e){
  //      el.load($(this).attr('href'));
  //      overlay._el = overlay.el = overlay.options.modalTemplate.apply(overlay, [ el ]).hide();
  //      e.stopPropagation();
  //      e.preventDefault();
  //    });
  //  }
  //});

});

}(window.jQuery, window.Patterns));
