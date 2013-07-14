// form auto focus pattern.
//

// Author:K.K. Dhanesh 
// Contact: dhaneshkk@cdac.in
// Version: 1.0
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


define([
  'jquery',
  'js/patterns/base'
], function($, Base, undefined) {
  "use strict";

  var FormAutoFocus = Base.extend({
    name: 'formautofocus',
    defaults: {
      condition: "div.error",
      target: "div.error :input:not(.formTabs):visible:first",
      always: ":input:not(.formTabs):visible:first"
    },
    init: function() {
      var self = this;
      if ($(self.options.condition, self.$el).size() !== 0) {
        $(self.options.target, self.$el).focus();
      }
      else{
        $(self.options.always, self.$el).focus();
      }
        
    }
  });

  return FormAutoFocus;

});
