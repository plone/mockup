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
  'js/ui/views/base',
  'bootstrap-tooltip'
],
  function($, Backbone, _, BaseView) {
  "use strict";

  var ButtonView = BaseView.extend({
    tagName: 'a',
    className: 'btn',
    eventPrefix: 'button',
    context: 'default',
    attributes: {
      'href': '#'
    },
    tooltip: null,
    template: '<% if (icon) { %><span class="glyphicon glyphicon-<%= icon %>"></span><% } %> <%= title %>',
    events: {
      'click': 'handleClick'
    },
    initialize: function(options) {
      if (!options.id) {
        var title = options.title || '';
        options.id = title !== '' ? title.toLowerCase().replace(' ', '-') : this.cid;
      }
      BaseView.prototype.initialize.apply(this, [options]);

      this.on('disable', function() {
        this.disable();
      }, this);

      this.on('enable', function() {
        this.enable();
      }, this);

      this.on('render', function() {
        if(this.context !== null){
          this.$el.addClass('btn-' + this.context);
        }

        if (this.tooltip !== null) {
          this.$el.tooltip({
            title: this.tooltip
          });
          // XXX since tooltip triggers hidden
          // suppress so it plays nice with modals, backdrops, etc
          this.$el.on('hidden', function(e){
            if(e.type == 'hidden'){
              e.stopPropagation();
            }
          });
        }
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
