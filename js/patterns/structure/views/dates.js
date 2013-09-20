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
  'backbone',
  'ui/views/popover',
  'mockup-patterns-pickadate'
], function($, _, Backbone, PopoverView, PickADate) {
  "use strict";

  var DatesView = PopoverView.extend({
    className: 'popoverview dates',
    title: _.template('Modify dates on items'),
    content: _.template(
      '<label>Publication Date</label>' +
      '<input name="effective" />' +
      '<label>Expiration Date</label>' +
      '<input name="expiration" />' +
      '<button class="btn btn-block btn-primary">Apply</button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(){
      this.app = this.options.app;
      PopoverView.prototype.initialize.call(this);
    },
    render: function(){
      PopoverView.prototype.render.call(this);
      this.$effective = this.$('[name="effective"]');
      this.$expiration = this.$('[name="expiration"]');
      this.effectivePickADate = new PickADate(this.$effective);
      this.expirationPickADate = new PickADate(this.$expiration);
      return this;
    },
    applyButtonClicked: function(e){
      this.app.defaultButtonClickEvent(this.button, {
        effectiveDate: this.effectivePickADate.$date.attr('value'),
        effectiveTime: this.effectivePickADate.$time.attr('value'),
        expirationDate: this.expirationPickADate.$date.attr('value'),
        expirationTime: this.expirationPickADate.$time.attr('value')
      });
      this.hide();
    },
    showItemsClicked: function(button, e){
      PopoverView.prototype.showItemsClicked.apply(this, [button, e]);
      var self = this;
      if(!this.opened){
        return;
      }
      this.$effective.attr('value', '');
      this.$expiration.attr('value', '');
    }
  });

  return DatesView;
});



