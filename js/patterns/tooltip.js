// plone integration for tooltip.
//
// Author: David Hietpas
// Contact: hietpasd@uwosh.edu
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//
// Description:
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

// This is a simple pattern which doesn't do much.  More of a simple learning pattern.

define([
  'jquery',
  'mockup-patterns-base'
], function($, Base, undefined) {
  "use strict";

  var ToolTip = Base.extend({
    name: 'tooltip',
    defaults: {
      attribute: 'class',
      event_enter: 'mouseenter',
      event_exit: 'mouseleave',
    },
    init: function() {
      var self = this;
      
      self.on(self.options.event_enter, function(e) {
        e.stopPropagation();
        self.show(e);
      });
      self.on(self.options.event_exit, function(e) {
        e.stopPropagation();
        self.hide(e);
      });
      
    },
    
    show : function(e) {
        var s = $(e.target).attr('href');
        $(s).addClass('active');
    },
    
    hide : function(e) {
        var s = $(e.target).attr('href');
        $(s).removeClass('active');
    }
    
  });
  

  return ToolTip;

});
