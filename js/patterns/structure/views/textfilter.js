// Author: Ryan Foster
// Contact: ryan@rynamic.com
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
  'ui/views/base',
  'ui/views/button',
  'ui/views/popover'
  ],
  function($, Backbone, _, BaseView, ButtonView, PopoverView) {
  "use strict";

  var TextFilterView = BaseView.extend({
    tagName: 'form',
    className: 'navbar-search pull-right form-search',
    template: _.template(
      '<div class="input-append">' +
        '<input type="text" class="search-query" placeholder="Filter">' +
      '</div>'),
    popoverContent: _.template(
      ''
    ),
    events: {
      'keyup .search-query': 'filter'
    },
    render: function(){
      this.$el.html(this.template({}));
      this.button = new ButtonView({
        title: 'Query'
      });
      this.popover = new PopoverView({
        button: this.button,
        title: _.template('Query'),
        content: this.popoverContent
      });
      this.$('div.input-append').append(this.button.render().el);
      this.$el.append(this.popover.render().el);
      return this;
    },
    filter: function(event) {
      var val = $(event.currentTarget).val();
      this.uiEventTrigger('change', val, this);
    }
  });

  return TextFilterView;
});
