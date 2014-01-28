// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
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
  'underscore',
  'js/ui/views/popover'
], function($, _, PopoverView) {
  "use strict";

  var SortView = PopoverView.extend({
    className: 'popover sort',
    title: _.template('Sort items in this folder'),
    content: _.template(
      '<div class="form-group">' +
        '<label>What to sort on</label>' +
        '<select name="sort_on" class="form-control">' +
          '<% _.each(sortProperties, function(title, property){ %>' +
            '<option value="<%- property %>"><%- title %></option>' +
          '<% }); %>' +
        '</select>' +
      '</div>' +
      '<div class="checkbox">' +
        '<label>Reverse <input type="checkbox" name="reversed" /></label>' +
      '</div>' +
      '<button class="btn btn-block btn-primary">Sort</button>'
    ),
    events: {
      'click button': 'sortButtonClicked'
    },
    initialize: function(options){
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
      this.options.sortProperties = this.app.options.sort.properties;
    },
    render: function(){
      PopoverView.prototype.render.call(this);
      this.$sortOn = this.$('[name="sort_on"]');
      this.$reversed = this.$('[name="reversed"]');
      return this;
    },
    sortButtonClicked: function(){
      var data = {
        sort_on: this.$sortOn.val(),
        reversed: false
      };
      if(this.$reversed[0].checked){
        data.reversed = true;
      }
      this.app.defaultButtonClickEvent(this.triggerView, data);
      this.hide();
    }
  });

  return SortView;
});
