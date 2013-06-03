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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
  'jam/jquery-cookie/jquery.cookie'
], function($, Base, Parser) {
  "use strict";

  var CookieDirective = Base.extend({
    name: "cookiedirective",
    defaults: {
      'should_enable': true,
      'should_enable_msg': "You should enable cookies to be able to login.",
      'should_enable_selector': ".login",
      'should_ask': true,
      'ask_permission_msg': "This site uses cookies to provide additional functionality, do you accept?",
      'allow_msg': "Allow",
      'deny_msg': "Deny",
      'cookie_name': "Allow_Cookies_For_Site"
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
      var cookie = $.cookie(this.options['cookie_name']);
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
      $.cookie(this.options['cookie_name'], 1);
    },
    denyCookies: function() {
      $.cookie(this.options['cookie_name'], 0);
    },
    init: function() {
      var self = this;
      if (self.options['should_ask']){
        var accepted = self.acceptedCookies();
        if (accepted === undefined){
          var div = $('<div></div>')
            .addClass('cookiedirective');
          var msg = $('<div><span>'+self.options['ask_permission_msg']+'</span></div>')
            .addClass('cookiemsg');
          var button_allow = $('<div><span>'+self.options['allow_msg']+'</span></div>')
            .addClass('cookieallowbutton')
            .addClass('btn')
            .on('click', function(e) {
                self.acceptCookies();
                self.$el.find('.cookiedirective').hide('slow');
              });
          var button_deny = $('<div><span>'+self.options['deny_msg']+'</span></div>')
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
      if (self.options['should_enable']){
        if (self.$el.find(self.options['should_enable_selector']).size() > 0){
          if (!self.cookiesEnabled()){
            var div = $('<div></div>')
              .addClass('shouldenablecookies');
            var msg = $('<div><span>'+self.options['should_enable_msg']+'</span></div>')
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

