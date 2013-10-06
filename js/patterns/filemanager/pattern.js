//
// Author: Nathan Van Gheem<nathan@vangheem.us>
// Version: 1.0
//
// Taken from the original accessibility.js from Plone
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
  'js/patterns/filemanager/views/app'
], function($, Base, AppView) {
  "use strict";

  var FileManager = Base.extend({
    name: "filemanager",
    defaults: {
      aceConfig: {},
      dataTreeUrl: null,
      uploadUrl: null
    },
    treeConfig: {
      autoOpen: true
    },
    init: function() {
      var self = this;
      if(self.options.dataTreeUrl !== null){
        self.options.treeConfig = $.extend(true, {}, self.treeConfig, {
          dataUrl: self.options.dataTreeUrl
        });
        self.appView = new AppView(self.options);
        self.$el.append(self.appView.render().el);
      }else{
        self.$el.html('Must specify dataTreeUrl setting for pattern');
      }
    }
  });

  return FileManager;

});

