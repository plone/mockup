/* Formunloadalert pattern.
 *
 * Options:
 *    changingEvents(string): Events on which to check for changes (space-separated). ('change keyup paste')
 *    changingFields(string): Fields on which to check for changes (comma-separated). ('input,select,textarea,fileupload')
 *    message(string): Confirmation message to display when dirty form is being unloaded. (Discard changes? If you click OK, any changes you have made will be lost.)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <form class="pat-formunloadalert" onsubmit="javascript:return false;">
 *      <input type="text" value="" />
 *      <select>
 *        <option value="1">value 1</option>
 *        <option value="2">value 2</option>
 *      </select>
 *      <input
 *        class="btn btn-large btn-primary"
 *        type="submit" value="Submit" />
 *      <br />
 *      <a href="/">Click here to go somewhere else</a>
 *    </form>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-i18n'
], function ($, Base, i18n) {
  'use strict';

  i18n.loadCatalog('widgets');
  var _t = i18n.MessageFactory('widgets');

  var FormUnloadAlert = Base.extend({
    name: 'formunloadalert',
    _changed : false,       // Stores a listing of raised changes by their key
    _suppressed : false,     // whether or not warning should be suppressed
    defaults: {
      message :  _t('Discard changes? If you click OK, ' +
                 'any changes you have made will be lost.'),
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

      var $modal = self.$el.parents('.plone-modal');
      if ($modal.size() !== 0) {
        $modal.data('pattern-modal').on('hide', function(e) {
          var modal = $modal.data('pattern-modal');
          if (modal) {
            modal._suppressHide = self._handleUnload.apply(self, e);
          }
        });
      } else {
        $(window).on('beforeunload', function(e) {
          return self._handleUnload(e);
        });
      }

      self.$el.on('submit', function(e) {
        self._suppressed = true;
      });

    },
    _handleUnload : function (e) {
      var self = this;
      if (self._suppressed) {
        self._suppressed = false;
        return undefined;
      }
      if (self._changed) {
        var msg = self.options.message;
        self._handleMsg(e,msg);
        $(window).trigger('messageset');
        return msg;
      }
    },
    _handleMsg:  function(e,msg) {
      (e || window.event).returnValue = msg;
    }
  });
  return FormUnloadAlert;

});
