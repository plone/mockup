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
  'mockup-ui-url/views/popover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var FileManagerPopover = PopoverView.extend({
    className: 'popover',
    title: _.template('nothing'),
    content: _.template('<div/>'),
    initialize: function(options) {
      this.app = options.app;
      options.translations = this.app.options.translations;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    render: function() {
      var self = this;
      PopoverView.prototype.render.call(this);
      return self;
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      var $path = self.$('.current-path');
      if ($path.length !== 0){
        $path.html(self.getPath());
      }
    },
    getPath: function() {
      return this.app.getFolderPath();
    }
  });

  return FileManagerPopover;
});