// Pattern which adds support for checking if the user has his cookies enabled
// when logging in, and also to ask if he accepts that the site can use
// cookies.
//
// Author: Nathan Van Gheem
// Contact: nathan@vangheem.su
// Version: 1.0
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
  'dropzone'
], function($, Base, dropzone) {
  "use strict";

  var DropZone = Base.extend({
    name: "dropzone",
    defaults: {
      url: null, // XXX MUST provide url to submit to OR be in a form
      klass: 'dropzone',
      paramName: "file",
      uploadMultiple: false
    },
    init: function() {
      var self = this;

      if(!self.options.url && self.$el[0].tagName === 'FORM'){
        var url = self.$el.attr('action');
        if(!url){
          // form without action, defaults to current url
          url = window.location.href;
        }
        self.options.url = url;
      }
      self.$el.addClass(self.options.klass);
      self.dropzone = self.$el.dropzone(self.options);
      self.dropzone.on('dragstart', function(){
        console.log('dragstart');
      });
      self.dropzone.on('dragend', function(){
        console.log('dragend');
      });
      self.dropzone.on('dragenter', function(){
        console.log('dragenter');
      });
      self.dropzone.on('dragover', function(){
        console.log('dragover');
      });
      self.dropzone.on('dragleave', function(){
        console.log('dragleave');
      });

    }
  });

  return DropZone;

});


