// Pattern which provide some basic form helpers:
// - prevent forms to be submitted twice w/out warning
// This is going to replace 'Products/CMFPlone/skins/plone_ecmascript/formsubmithelpers.js'
//
// Author: Simone Orsi
// Contact: simahawk@gmail.com
// Version: 1.0
//
// License:
//
// Copyright (C) 2013 Plone Foundation
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


define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  "use strict";

  var PreventDoubleSubmit = Base.extend({
    name: "preventdoublesubmit",
    defaults: {
      message : 'You already clicked the submit button. ' +
                'Do you really want to submit this form again?',
      guardClassName: 'submitting',
      optOutClassName: 'allowMultiSubmit'
    },
    init: function() {
      var self = this;

      // if this is not a form just return
      if(!self.$el.is('form')){
        return;
      }

      $(':submit', self.$el).click(function(e){

        // mark the button as clicked
        $(':submit').removeAttr('clicked');
        $(this).attr('clicked', 'clicked');

        // if submitting and no opt-out guardClassName is found
        // pop up confirmation dialog
        if ($(this).hasClass(self.options.guardClassName) &&
              !$(this).hasClass(self.options.optOutClassName)){
          return self._confirm.call(self);
        }

        $(this).addClass(self.options.guardClassName);
      });

    },

    _confirm: function(e) {
      return window.confirm(this.options.message);
    }

  });

  return PreventDoubleSubmit;

});
