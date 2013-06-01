// Pattern which provides accessibility support
//
// Author: Franco Pellegrini
// Contact: frapell@gmail.com
// Version: 1.0
//
// Taken from the original accessibility.js from Plone
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

  var Accessibility = Base.extend({
    name: "accessibility",
    defaults: {
      'smallbtn': null,
      'normalbtn': null,
      'largebtn': null
    },
    setBaseFontSize: function($fontsize, $reset) {
      if ($reset) {
        this.$el.removeClass('smallText').removeClass('largeText').
            removeClass('mediumText');
        $.cookie('fontsize', $fontsize, { expires: 365, path:"/" });
      }
      this.$el.addClass($fontsize);
    },
    initBtn: function(btn){
      var self = this;
      btn.el.click(function(e){
        e.preventDefault();
        self.setBaseFontSize(btn.name + 'Text', 1);
      });
    },
    init: function() {
      var self = this;
      var $fontsize = $.cookie('fontsize');
      if ($fontsize) {
          self.setBaseFontSize($fontsize, 0);
      }
      var btns = ['smallbtn', 'normalbtn', 'largebtn'];
      for(var i=0; i<btns.length; i++){
        var btn = btns[i];
        var btnName = btn.replace('btn', '');
        var btnSelector = self.options[btn];
        if(btnSelector !== null){
          var el = $(btnSelector, self.$el);
          if(el){
            btn = {
              name: btnName,
              el: el
            };
            self[btnName] = btn;
            self.initBtn(btn);
          }
        }
      }
    }
  });

  return Accessibility;

});

