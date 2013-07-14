// Pattern which adds support for checking if the user has his cookies enabled
// when logging in, and also to ask if he accepts that the site can use
// cookies.
//
// Author: Franco Pellegrini
// Contact: frapell@gmail.com
// Version: 1.0
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


define([
  'jquery',
  'js/patterns/base',
  'jquery.cookie'
], function($, Base, Parser) {
  "use strict";

  var CookieDirective = Base.extend({
    name: "cookiedirective",
    defaults: {
      'shouldEnable': true,
      'shouldEnableMsg': "You should enable cookies to be able to login.",
      'shouldEnableSelector': ".login",
      'shouldAsk': true,
      'askPermissionMsg': "This site uses cookies to provide additional functionality, do you accept?",
      'allowMsg': "Allow",
      'denyMsg': "Deny",
      'cookieName': "Allow_Cookies_For_Site"
    },
    cookiesEnabled: function() {
      $.cookie("_cookiesEnabled", 1);
      if (!$.cookie("_cookiesEnabled")) {
        return false;
      }
      $.removeCookie("_cookiesEnabled");
      return true;
    },
    acceptedCookies: function() {
      var cookie = $.cookie(this.options.cookieName);
      if (cookie === undefined){
        return undefined;
      }
      if (cookie == 1) {
        return true;
      }
      else{
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
        if (accepted === undefined){
          var div = $('<div></div>')
            .addClass('cookiedirective');
          var msg = $('<div><span>'+self.options.askPermissionMsg+'</span></div>')
            .addClass('cookiemsg');
          var button_allow = $('<div><span>'+self.options.allowMsg+'</span></div>')
            .addClass('cookieallowbutton')
            .addClass('btn')
            .on('click', function(e) {
                self.acceptCookies();
                self.$el.find('.cookiedirective').hide('slow');
              });
          var button_deny = $('<div><span>'+self.options.denyMsg+'</span></div>')
            .addClass('cookiedenybutton')
            .addClass('btn')
            .on('click', function(e) {
                self.denyCookies();
                self.$el.find('.cookiedirective').hide('slow');
              });
          div.append(msg).append(button_allow).append(button_deny);
          self.$el.prepend(div);
        }
      }
      self.options.shouldEnable = self.ensureBool(self.options.shouldEnable);
      if (self.options.shouldEnable) {
        if (self.$el.find(self.options.shouldEnableSelector).size() > 0){
          if (!self.cookiesEnabled()){
            var div = $('<div></div>')
              .addClass('shouldenablecookies');
            var msg = $('<div><span>'+self.options.shouldEnableMsg+'</span></div>')
              .addClass('shouldenablecookiesmsg');
            div.append(msg).append(msg);
            self.$el.prepend(div);
          }
        }
      }
    }
  });

  return CookieDirective;

});

