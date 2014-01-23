/* Dropzone pattern.
 *
 * Options:
 *    url(string): If not used with a form, this option must provide the URL to submit to (null)
 *    clickable(boolean): If you can click on container to also upload (false)
 *    className(string): value for class attribute in the form element ('dropzone')
 *    paramName(string): value for name attribute in the file input element ('file')
 *    uploadMultiple(boolean): condition value for multiple attribute in the file input element. If the value is 'true' and paramName is file, 'multiple=multiple' and 'name=file[]' will be added in the file input. (false)
 *    wrap(boolean): true or false for wrapping this element using the value of wrapperTemplate. If the value is 'inner', this element will wrap the wrapperTemplate value. (false)
 *    wrapperTemplate(string): HTML template for wrapping around with this element. ('<div class="dropzone-container"/>')
 *    resultTemplate(string): HTML template for the element that will contain file information. ('<div class="dz-notice"><p>Drop files here...</p></div><div class="dropzone-previews"/>')
 *    autoCleanResults(boolean): condition value for the file preview in div element to fadeout after file upload is completed. (false)
 *    previewsContainer(selector): JavaScript selector for file preview in div element. (.dropzone-previews)
 *
 * Documentation:
 *    # On a form element
 *
 *    {{ example-1 }}
 *
 *    # On a div element
 *
 *    {{ example-2 }}
 *
 *    # With custom style
 *
 *    {{ example-3 }}
 *
 * Example: example-1
 *    <form method="post" action="/upload" enctype="multipart/form-data"
 *          class="pat-dropzone" data-pat-dropzone="clickable:true">
 *    </form>
 *
 * Example: example-2
 *    <div class="pat-dropzone" data-pat-dropzone="url: /upload">
 *      <div>
 *        <p>Something here that is useful</p>
 *        <p>Something else here that is useful</p>
 *        <p>Another thing here that is useful</p>
 *      </div>
 *    </div>
 *
 * Example: example-3
 *    <style>
 *      .mydropzone{
 *        width: 400px;
 *        height: 100px;
 *        background-color: gray;
 *      }
 *      .mydropzone.dz-drag-hover{
 *        background-color: red;
 *      }
 *    </style>
 *    <div class="pat-dropzone"
 *         data-pat-dropzone="url: /upload; className: mydropzone">
 *      Drop here...
 *    </div>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'mockup-patterns-base',
  'dropzone',
  'underscore'
], function($, Base, Dropzone, _) {
  "use strict";

  /* we do not want this plugin to auto discover */
  Dropzone.autoDiscover = false;

  var DropzonePattern = Base.extend({
    name: "dropzone",
    defaults: {
      url: null, // XXX MUST provide url to submit to OR be in a form
      className: 'dropzone',
      paramName: "file",
      uploadMultiple: false,
      clickable: false,
      wrap: false,
      addRemoveLinks: false,
      wrapperTemplate: '<div class="dropzone-container"/>',
      autoCleanResults: false,
      previewsContainer: '.dropzone-previews',
      previewsTemplate: '<div class="dropzone-previews"></div>',
      fileaddedClassName: 'dropping',
      useTus: false,
      maxFilesize: 99999999 // let's not have a max by default...
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
        $el.append(self.options.previewsTemplate);
      }

      var autoClean = self.options.autoCleanResults;
      $el.addClass(self.options.className);
      var fileaddedClassName = self.options.fileaddedClassName;
      var useTus = self.options.useTus;

      // clean up options
      var options = $.extend({}, self.options);
      delete options.wrap;
      delete options.wrapperTemplate;
      delete options.resultTemplate;
      delete options.autoCleanResults;
      delete options.previewsTemplate;
      delete options.fileaddedClassName;
      delete options.useTus;

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

      options.autoProcessQueue = false;
      self.dropzone = new Dropzone($el[0], options);
      self.$dropzone = $el;


      if(autoClean){
        self.dropzone.on('complete', function(file){
          setTimeout(function(){
            $(file.previewElement).fadeOut();
          }, 3000);
        });
      }

      /* customize file processing */
      var processing = false;
      function process(){
        processing = true;
        if(self.dropzone.files.length === 0){
          processing = false;
          self.$dropzone.removeClass(fileaddedClassName);
          return;
        }
        var file = self.dropzone.files[0];
        var $preview = $(file.previewElement);
        if([Dropzone.SUCCESS, Dropzone.ERROR,
                              Dropzone.CANCELED].indexOf(file.status) !== -1){
          // remove it
          self.dropzone.removeFile(file);
          process();
        }else if(file.status !== Dropzone.UPLOADING){
          // start processing file
          if(useTus && window.tus){
            // use tus upload if installed
            var $progress = $preview.find("[data-dz-uploadprogress]");
            file.status = Dropzone.UPLOADING;
            window.tus.upload(file, {
              endpoint: self.options.url,
              headers: {
                'FILENAME': file.name
              },
              chunkSize: 1024 * 1024 * 5 // 5mb chunk size
            }).fail(function(){
              alert('Error uploading with TUS resumable uploads');
              file.status = Dropzone.ERROR;
            }).progress(function(e, bytesUploaded, bytesTotal){
              var percentage = (bytesUploaded / bytesTotal * 100);
              $progress.css('width', percentage + '%');
              $progress.parent().css('display', 'block');
            }).done(function(url, file){
              file.status = Dropzone.SUCCESS;
              self.dropzone.emit('success', file);
              self.dropzone.emit('complete', file);
            });
          }else{
            // otherwise, just use dropzone to process
            self.dropzone.processFile(file);
          }
          setTimeout(process, 100);
        }else{
          // currently processing
          setTimeout(process, 100);
        }
      }
      self.dropzone.on('addedfile', function(){
        self.$dropzone.addClass(fileaddedClassName);
        setTimeout(function(){
          if(!processing){
            process();
          }
        }, 100);
      });
    }
  });

  return DropzonePattern;

});
