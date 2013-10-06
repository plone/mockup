// Pattern which provide some basic form helpers:
// - prevent forms with changed values to be unloaded 
// This is going to replace 'Products/CMFPlone/skins/plone_ecmascript/formUnload.js'
// Bits of this come from 
// https://raw.github.com/mmonteleone/jquery.safetynet/master/jquery.safetynet.js
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
], function ($, Base) {
  "use strict";

  var FormUnloadAlert = Base.extend({
    name: "formunloadalert",
    _changed : false,       // Stores a listing of raised changes by their key
    _suppressed : false,     // whether or not warning should be suppressed
    defaults: {
      message :  "Discard changes? If you click OK, " +
                 "any changes you have made will be lost.",
      // events on which to check for changes
      changingEvents: 'change keyup paste',
      // fields on which to check for changes
      changingFields: 'input,select,textarea,fileupload'
    },
    init: function () {
      var self = this;
      // if this is not a form just return
      if (!self.$el.is('form')) { return; }

      $(self.options.changingFields, self.$el).on(
        self.options.changingEvents,
        function (evt) {
          self._changed = true;
        }
      );

      var $modal = self.$el.parents('.modal');
      if ($modal.size() !== 0) {
        $modal.data('pattern-modal').on('hide', function(e, modal) {
          modal._suppressHide = self._handle_unload.apply(self, e);
        });
      } else {
        $(window).on('beforeunload', function(e){
          return self._handle_unload(e);
        });
      }

      self.$el.on('submit', function(e){
        self._suppressed = true;
      });

    },
    _handle_unload : function (e) {
      var self = this;
      if (self._suppressed) {
        self._suppressed = false;
        return undefined;
      }
      if (self._changed) {
        var msg = self.options.message;
        self._handle_msg(e,msg);
        $(window).trigger('messageset');
        return msg;
      }
    },
    _handle_msg:  function(e,msg) {
      (e || window.event).returnValue = msg;
    } 
  });
  return FormUnloadAlert;

});
