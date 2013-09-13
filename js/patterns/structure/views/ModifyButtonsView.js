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
  'underscore',
  'backbone',
  'structure/views/ButtonView',
  'button-groups',
], function(_, Backbone, ButtonView) {
  "use strict";

  var ModifyButtonsView = Backbone.View.extend({
    tagName: 'div',
    className: 'btn-group',
    template: _.template(
      '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' +
        'Modify' +
        '<span class="caret"></span>' +
      '</a>' +
      '<ul class="dropdown-menu">' +
      '</ul>'),
    render: function() {
      this.$el.html(this.template({}));
      var btnContainer = this.$('ul');
      _.each(this.options.buttons, function(btn){
        var view = (new ButtonView({model: btn})).render();
        btnContainer.append(view.el);
      });
      this.$('.dropdown-toggle').dropdown();
      return this;
    },
  });

  return ModifyButtonsView;
});
