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
  'underscore',
  'backbone'
  ], function(_, Backbone) {
  "use strict";

  var BaseView = Backbone.View.extend({
    isUIView: true,
    eventPrefix: 'ui',
    template: null,
    appendInContainer: true,
    initialize: function(options) {
      this.options = options;
      for (var key in this.options) {
        this[key] = this.options[key];
      }
    },
    render: function() {
      this.applyTemplate();

      this.trigger('render', this);
      this.afterRender();

      return this;
    },
    afterRender: function() {

    },
    serializedModel: function() {
      return this.options;
    },
    applyTemplate: function() {
      if (this.template !== null) {
        this.$el.html(_.template(this.template, this.serializedModel()));
      }
    },
    propagateEvent: function(eventName) {
      if (eventName.indexOf(':') > 0) {
        var eventId = eventName.split(':')[0];
        if (this.eventPrefix !== '') {
          if (eventId === this.eventPrefix ||
              eventId === this.eventPrefix + '.' + this.id) { return true; }
        }
      }
      return false;
    },
    uiEventTrigger: function(name) {
      var args = [].slice.call(arguments, 0);

      if (this.eventPrefix !== '') {
        args[0] = this.eventPrefix + ':' + name;
        Backbone.View.prototype.trigger.apply(this, args);
        if (this.id) {
          args[0] =  this.eventPrefix + '.' + this.id + ':' + name;
          Backbone.View.prototype.trigger.apply(this, args);
        }
      }
    }
  });

  return BaseView;
});
