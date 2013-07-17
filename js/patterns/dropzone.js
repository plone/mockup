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
], function($, Base, Dropzone) {
  "use strict";

  /* we do not want this plugin to auto discover */
  Dropzone.autoDiscover = false;

  var DropzonePattern = Base.extend({
    name: "dropzone",
    defaults: {
      url: null, // XXX MUST provide url to submit to OR be in a form
      klass: 'dropzone',
      paramName: "file",
      uploadMultiple: false,
      clickable: false,
      wrap: false,
      wrapperTemplate: '<div class="tinymce-dropzone-container"/>',
      resultTemplate: '<div class="dz-notice">' +
          '<p>Drop files here...</p></div><div class="dropzone-previews"/>',
      autoCleanResults: false,
      previewsContainer: '.dropzone-previews'
    },
    init: function() {
      var self = this;
      if(typeof(self.options.clickable) === "string"){
        if(self.options.clickable === 'true'){
          self.options.clickable = true;
        } else {
          self.options.clickable = false;
        }
      }
      if(!self.options.url && self.$el[0].tagName === 'FORM'){
        var url = self.$el.attr('action');
        if(!url){
          // form without action, defaults to current url
          url = window.location.href;
        }
        self.options.url = url;
      }
      var $el = self.$el;
      if(self.options.wrap){
        var wrapFunc = $el.wrap;
        if(self.options.wrap === 'inner'){
          $el.wrapInner(self.options.wrapperTemplate);
          $el = $el.children().eq(0);
        } else {
          $el.wrap(self.options.wrapperTemplate);
          $el = $el.parent();
        }
      }
      $el.append('<div class="dz-notice"><p>Drop files here...</p></div>');
      if(self.options.previewsContainer === '.dropzone-previews'){
        $el.append('<div class="dropzone-previews"/>');
      }

      var autoClean = self.options.autoCleanResults;
      $el.addClass(self.options.klass);

      // clean up options
      var options = $.extend({}, self.options);
      delete options.wrap;
      delete options.wrapperTemplate;
      delete options.resultTemplate;
      delete options.autoCleanResults;

      if(self.options.previewsContainer){
        /*
         * if they have a select but it's not an id, let's make an id selector
         * so we can target the correct container. dropzone is weird here...
         */
        var $preview = $el.find(self.options.previewsContainer);
        if($preview.length > 0){
          options.previewsContainer = $preview[0];
        }
      }

      self.dropzone = new Dropzone($el[0], options);
      self.$dropzone = $el;

      if(autoClean){
        self.dropzone.on('complete', function(file){
          setTimeout(function(){
            $(file.previewElement).fadeOut();
          }, 3000);
        });
      }
    }
  });

  return DropzonePattern;

});


