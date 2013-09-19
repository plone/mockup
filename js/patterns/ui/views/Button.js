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
  'backbone',
  'underscore',
  'ui/views/base'
  ],
  function($, Backbone, _, BaseView) {
  "use strict";

  var ButtonView = BaseView.extend({
    tagName: 'a',
    className: 'btn',
    eventPrefix: 'button',
    attributes: {
      'href': '#'
    },
    template: '<% if (icon) { %><i class="icon-<%= icon %>"</i><% } %> <%= title %>',
    events: {
      'click': 'handleClick'
    },
    initialize: function() {
      if (!this.options.id) {
        var title = this.options.title || '';
        this.options.id = title !== '' ? title.toLowerCase().replace(' ', '-') : this.cid;
      }
      BaseView.prototype.initialize.call(this);

      this.on('disable', function() {
        this.disable();
      }, this);

      this.on('enable', function() {
        this.enable();
      }, this);

      this.on('render', function() {

      }, this);
    },
    handleClick: function(e){
      e.preventDefault();
      if (!this.$el.is('.disabled')) {
        this.uiEventTrigger('click', this, e);
      }
    },
    serializedModel: function() {
      return _.extend({'icon': '', 'title': ''}, this.options);
    },
    disable: function() {
      this.options.disabled = true;
      this.$el.addClass('disabled');
    },
    enable: function() {
      this.options.disabled = false;
      this.$el.removeClass('disabled');
    }
  });

  return ButtonView;
});
