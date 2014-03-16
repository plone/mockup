// Author: David Glick
// Contact: david@glicksoftware.com
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2014 Plone Foundation
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

/* global alert:true */

define([
  'jquery',
  'underscore',
  'backbone',
  'js/ui/views/base',
  'mockup-utils',
  'text!js/patterns/structure/templates/useractionmenu.xml',
  'bootstrap-dropdown'
], function($, _, Backbone, BaseView, utils, ActionMenuTemplate) {
  'use strict';

  var UserActionMenu = BaseView.extend({
    className: 'btn-group actionmenu',
    template: _.template(ActionMenuTemplate),
    events: {
      'click .enable-login a': 'enableLoginClicked',
      'click .disable-login a': 'disableLoginClicked',
      'click .edit a': 'editClicked',
      'click .groups a': 'groupsClicked',
      'click .roles a': 'rolesClicked',
      'click .password a': 'passwordClicked'
    },
    initialize: function(options) {
      this.options = options;
      this.app = options.app;
      this.model = options.model;
    },
    render: function() {
      var self = this;
      self.$el.empty();

      var data = this.model.toJSON();
      data.attributes = self.model.attributes;

      self.$el.html(self.template(data));

      self.$dropdown = self.$('.dropdown-toggle');
      self.$dropdown.dropdown();

      if (self.options.className){
        self.$el.addClass(self.options.className);
      }
      return this;
    }
  });

  return UserActionMenu;
});
