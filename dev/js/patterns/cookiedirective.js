/* Cookie Directive pattern.
 *
 * Options:
 *    allowMsg(string): Allow Text on button used to allow cookies.
 *    askPermissionMsg(string): A message about allowing cookies. (This site uses cookies to provide additional functionality, do you accept?)
 *    cookieName(string): Name of cookie used to store the value of this setting. ('Allow_Cookies_For_Site')
 *    denyMsg(string): Text on button used to deny cookies. (Deny)
 *    shouldAsk(boolean): Should user be prompted about cookies? (true)
 *    shouldEnable(boolean): Display a message about enabling cookies if they are disabled. (true)
 *    shouldEnableMsg(string): A message about enabling cookies if they are disabled, which will be displayed if shouldEnable is true. (You should enable cookies to be able to login.)
 *    shouldEnableSelector(string): shouldEnable message selector. ('.login')
 *
 * Documentation:
 *    # TODO: example is not working
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-cookiedirective">
 *      <div class="login">
 *      </div>
 *    </div>
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
  'jquery.cookie'
], function($, Base) {
  'use strict';

  var CookieDirective = Base.extend({
    name: 'cookiedirective',
    defaults: {
      'shouldEnable': true,
      'shouldEnableMsg': 'You should enable cookies to be able to login.',
      'shouldEnableSelector': '.login',
      'shouldAsk': true,
      'askPermissionMsg': 'This site uses cookies to provide additional functionality, do you accept?',
      'allowMsg': 'Allow',
      'denyMsg': 'Deny',
      'cookieName': 'Allow_Cookies_For_Site'
    },
    cookiesEnabled: function() {
      $.cookie('_cookiesEnabled', 1);
      if (!$.cookie('_cookiesEnabled')) {
        return false;
      }
      $.removeCookie('_cookiesEnabled');
      return true;
    },
    acceptedCookies: function() {
      /*jshint eqeqeq:false */
      var cookie = $.cookie(this.options.cookieName);
      if (cookie === undefined || cookie === null) {
        return undefined;
      }
      if (cookie === 1) {
        return true;
      } else {
        return false;
      }
    },
    acceptCookies: function() {
      $.cookie(this.options.cookieName, 1);
    },
    denyCookies: function() {
      $.cookie(this.options.cookieName, 0);
    },
    ensureBool: function(value) {
      if (typeof(value) === 'string') {
        if (value === 'true') {
          return true;
        } else {
          return false;
        }
      }
      return value;
    },
    init: function() {
      var self = this;
      self.options.shouldAsk = self.ensureBool(self.options.shouldAsk);
      if (self.options.shouldAsk) {
        var accepted = self.acceptedCookies();
        if (accepted === undefined) {
          var div = $('<div></div>')
            .addClass('cookiedirective');
          var msg = $('<div><span>' + self.options.askPermissionMsg + '</span></div>')
            .addClass('cookiemsg');
          var buttonAllow = $('<div><span>' + self.options.allowMsg + '</span></div>')
            .addClass('cookieallowbutton')
            .addClass('btn')
            .on('click', function(e) {
              self.acceptCookies();
              self.$el.find('.cookiedirective').hide('slow');
            });
          var buttonDeny = $('<div><span>' + self.options.denyMsg + '</span></div>')
            .addClass('cookiedenybutton')
            .addClass('btn')
            .on('click', function(e) {
              self.denyCookies();
              self.$el.find('.cookiedirective').hide('slow');
            });
          div.append(msg).append(buttonAllow).append(buttonDeny);
          self.$el.prepend(div);
        }
      }
      self.options.shouldEnable = self.ensureBool(self.options.shouldEnable);
      if (self.options.shouldEnable) {
        if (self.$el.find(self.options.shouldEnableSelector).size() > 0) {
          if (!self.cookiesEnabled()) {
            var newDiv = $('<div></div>')
              .addClass('shouldenablecookies');
            var newMsg = $('<div><span>' + self.options.shouldEnableMsg + '</span></div>')
              .addClass('shouldenablecookiesmsg');
            newDiv.append(newMsg).append(newMsg);
            self.$el.prepend(newDiv);
          }
        }
      }
    }
  });

  return CookieDirective;

});

