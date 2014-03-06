/* Expose pattern.
 *
 * Options:
 *    backdrop(string): Selector of parent element to use as backdrop. ('body')
 *    backdropCloseOnClick(boolean): Cancel expose on click if true. (true)
 *    backdropCloseOnEsc(boolean): Cancel expose on escape if true. (true)
 *    backdropClassName(string): TODO ('backdrop')
 *    backdropClassActiveName(string): TODO ('backdrop-active')
 *    backdropOpacity(float): Backdrop opacity value between 0 and 1. (0.8)
 *    backdropZIndex(integer): Z-index of backdrop overlay. (null)
 *    classActiveName(string): TODO ('active')
 *    triggers(string): Events that cause the expose feature to be triggered. ('focusin')
 *
 * Documentation:
 *    # Expose on focus event (default)
 *
 *    {{ example-1 }}
 *
 *    # Expose on hover
 *
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <form id="mockup-expose" class="form-horizontal pat-expose">
 *      <div class="control-group">
 *        <label class="control-label" for="inputEmail">Email</label>
 *        <div class="controls">
 *          <input type="text" id="inputEmail" placeholder="Email">
 *        </div>
 *      </div>
 *      <div class="control-group">
 *        <label class="control-label" for="inputPassword">Password</label>
 *        <div class="controls">
 *          <input type="password" id="inputPassword" placeholder="Password">
 *        </div>
 *      </div>
 *      <div class="control-group">
 *        <div class="controls">
 *          <label class="checkbox">
 *            <input type="checkbox"> Remember me
 *          </label>
 *          <button type="submit" class="btn">Sign in</button>
 *        </div>
 *      </div>
 *    </form>
 *
 * Example: example-2
 *    <button type="submit" class="btn btn-large pat-expose"
 *            data-pat-expose="triggers:hover">Hover over this button</button>
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
  'mockup-patterns-backdrop'
], function($, Base, Backdrop) {
  'use strict';

  var Expose = Base.extend({
    name: 'expose',
    defaults: {
      triggers: 'focusin',
      classActiveName: 'active',
      backdrop: 'body',
      backdropZIndex: null,
      backdropOpacity: '0.8',
      backdropClassName: 'backdrop',
      backdropClassActiveName: 'backdrop-active',
      backdropCloseOnEsc: true,
      backdropCloseOnClick: true
    },
    init: function() {
      var self = this;

      self.backdrop = new Backdrop(self.$el.parents(self.options.backdrop), {
        zindex: self.options.backdropZIndex,
        className: self.options.backdropClassName,
        classActiveName: self.options.backdropClassActiveName,
        styles: self.options.backdropStyles,
        opacity: self.options.backdropOpacity,
        closeOnEsc: self.options.backdropCloseOnEsc,
        closeOnClick: self.options.backdropCloseOnClick
      });
      if (self.options.triggers) {
        $.each(self.options.triggers.split(','), function(i, item) {
          item = item.split(' ');
          $(item[1] || self.$el).on(item[0], function() {
            self.show();
          });
        });
      }
      self.backdrop.on('hidden', function() { self.hide(); });
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.classActiveName)) {
        self.trigger('show');
        self.$el.addClass(self.options.classActiveName);
        self.backdrop.show();
        self._initialZIndex = self.$el.css('z-index');
        self.$el.css('z-index', self.options.backdropZIndex !== null ? self.options.backdropZIndex + 1 : 1041);
        self.$el.css('opacity', '0');
        self.$el.animate({ opacity: '1' }, 500);
        self.trigger('shown');
      }
    },
    hide: function() {
      var self = this;
      if (self.$el.hasClass(self.options.classActiveName)) {
        self.trigger('hide');
        self.backdrop.hide();
        self.$el.css('z-index', self._initialZIndex);
        self.$el.removeClass(self.options.classActiveName);
        self.trigger('hidden');
      }
    }
  });

  return Expose;

});
