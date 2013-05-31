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
    defaults: {}, 
    setBaseFontSize: function($fontsize, $reset) {
      if ($reset) {
        this.$el.removeClass('smallText').removeClass('largeText');
        $.cookie('fontsize', $fontsize, { expires: 365 });
      }
      this.$el.addClass($fontsize);
    },
    init: function() {
      var $fontsize = $.cookie('fontsize');
      if ($fontsize) {
          this.setBaseFontSize($fontsize, 0);
      }

    }
  });

  return Accessibility;

});


define([
  'jquery',
  'js/patterns/base',
  'jam/jquery-cookie/jquery.cookie'
], function($, Accessibility, Parser) {
  "use strict";

  var FontSizeChanger = Base.extend({
    name: "fontsizechanger",
    defaults: {
      'size': 'large'
    }, 
    init: function() {
      var self = this;
      self.$el.click(function(e){
        e.preventDefault();
        self.setBaseFontSize(self.options.size + 'Text', true);
      });
    }
  });

  return FontSizeChanger;

});


