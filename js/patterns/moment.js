// moment.js integration pattern
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


define([
  'jquery',
  'mockup-patterns-base',
  'moment'
], function($, Base, moment) {
  "use strict";

  var Moment = Base.extend({
    name: 'moment',
    defaults: {
      // selector of elements to format dates for
      selector: null,
      // also available options are relative, calendar
      format: 'MMMM Do YYYY, h:mm:ss a'
    },
    convert: function($el){
      var self = this;
      var date = $el.attr('data-date');
      if(!date){
        date = $.trim($el.html());
      }
      date = moment(date);
      if(!date.isValid()){
        return;
      }
      if(self.options.format === 'relative'){
        date = date.fromNow();
      }else if(self.options.format === 'calendar'){
        date = date.calendar();
      }else{
        date = date.format(self.options.format);
      }
      if(date){
        $el.html(date);
      }
    },
    init: function() {
      var self = this;
      if(self.options.selector){
        self.$el.find(self.options.selector).each(function(){
          self.convert($(this));
        });
      }else{
        self.convert(self.$el);
      }
    }
  });

  return Moment;

});
