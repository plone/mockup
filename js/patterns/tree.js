// plone integration for tooltip.
//
// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
// Depends:
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
], function($, Base) {
  "use strict";

  var Tree = Base.extend({
    name: 'tree',
    defaults: {
    },
    init: function() {
      var self = this;

    },
  });


  return Tree;

});
