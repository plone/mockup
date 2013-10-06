// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// Description:
//    TinyMCE pattern (for now its depening on Plone's integration)
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */
/*global alert,console:true */


define([
  'jquery',
  'underscore',
  'mockup-patterns-base',
  'mockup-patterns-relateditems',
  'mockup-patterns-modal',
  'tinymce',
  'mockup-patterns-dropzone',
  'dropzone',
  'text!js/patterns/tinymce/templates/result.tmpl',
  'text!js/patterns/tinymce/templates/selection.tmpl',
  'mockup-utils',
  'js/patterns/tinymce/links',
  'js/patterns/tinymce/upload'
], function($, _, Base, RelatedItems, Modal, tinymce, DropZone, dropzone, ResultTemplate, SelectionTemplate, utils, LinkModal, UploadModal) {
  "use strict";

  var TinyMCE = Base.extend({
    name: 'tinymce',
    defaults: {
      relatedItems: {
        attributes: ['UID', 'Title', 'Description', 'getURL', 'Type', 'path', 'ModificationDate'],
        batchSize: 20,
        basePath: '/',
        ajaxVocabulary: null,
        width: 500,
        maximumSelectionSize: 1,
        placeholder: 'Search for item on site...'
      },
      text: {
        insertBtn: 'Insert', // so this can be configurable for different languages
        cancelBtn: 'Cancel',
        insertHeading: 'Insert link',
        title: 'Title',
        internal: 'Internal',
        external: 'External',
        email: 'Email',
        anchor: 'Anchor',
        subject: 'Subject',
        image: 'Image',
        imageAlign: 'Align',
        scale: 'Size',
        alt: 'Alternative Text',
        externalImage: 'External Image URI'
      },
      scales: 'Listing (16x16):listing,Icon (32x32):icon,Tile (64x64):tile,' +
              'Thumb (128x128):thumb,Mini (200x200):mini,Preview (400x400):preview,' +
              'Large (768x768):large',
      targetList: [
        {text: 'Open in this window / frame', value: ''},
        {text: 'Open in new window', value: '_blank'},
        {text: 'Open in parent window / frame', value: '_parent'},
        {text: 'Open in top frame (replaces all frames)', value: '_top'}
      ],
      imageTypes: 'Image',
      folderTypes: 'Folder,Plone Site',
      linkableTypes: 'Document,Event,File,Folder,Image,News Item,Topic',
      tiny: {
        plugins: [
          "advlist autolink lists charmap print preview anchor ploneupload",
          "searchreplace visualblocks code fullscreen autoresize",
          "insertdatetime media table contextmenu paste plonelink ploneimage"
        ],
        menubar: "edit table format tools view insert",
        toolbar: "undo redo | styleselect | bold italic | " +
                 "alignleft aligncenter alignright alignjustify | " +
                 "bullist numlist outdent indent | " +
                 "unlink plonelink ploneimage | ploneupload",
        autoresize_max_height: 1500
      },
      rel_upload_path: null,
      folder_url: null
    },
    uploadFileClicked: function(){
      var self = this;
      if(self.uploadModal === null){
        var $el = $('<div/>').insertAfter(self.$el);
        self.uploadModal = new UploadModal($el,
          $.extend(true, {}, self.options, {
            tinypattern: self,
            relatedItems: {
              baseCriteria: [{
                i: 'Type',
                o: 'plone.app.querystring.operation.list.contains',
                v: self.options.folderTypes.split(',')
              }],
              placeholder: 'Select a folder to upload to...'
            }
          })
        );
        self.uploadModal.show();
      } else {
        self.uploadModal.reinitialize();
        self.uploadModal.show();
      }
    },
    addLinkClicked: function(){
      var self = this;
      if(self.linkModal === null){
        var $el = $('<div/>').insertAfter(self.$el);
        self.linkModal = new LinkModal($el,
          $.extend(true, {}, self.options, {
            tinypattern: self,
            linkTypes: [
              'internal',
              'external',
              'email',
              'anchor'
            ]
          })
        );
        self.linkModal.show();
      } else {
        self.linkModal.reinitialize();
        self.linkModal.show();
      }
    },
    addImageClicked: function(){
      var self = this;
      if(self.imageModal === null){
        var options = $.extend(true, {}, self.options, {
          tinypattern: self,
          linkTypes: ['image', 'externalImage'],
          initialLinkType: 'image',
          text: {
            insertHeading: 'Insert Image'
          },
          relatedItems: {
            baseCriteria: [{
              i: 'Type',
              o: 'plone.app.querystring.operation.list.contains',
              v: self.options.imageTypes.split(',').concat(self.options.folderTypes.split(','))
            }],
            resultTemplate: ResultTemplate,
            selectionTemplate: SelectionTemplate
          }
        });
        var $el = $('<div/>').insertAfter(self.$el);
        self.imageModal = new LinkModal($el, options);
        self.imageModal.show();
      } else {
        self.imageModal.reinitialize();
        self.imageModal.show();
      }
    },
    fileUploaded: function(data){
      var self = this;
      if(data === null){
        return; // bail, something is wrong here...
      }
      var filename = data.filename;
      var ext = filename.split('.');
      ext = ext[ext.length-1].toLowerCase();
      var attr;
      function waitLoad(imgElm) {
          imgElm.onload = imgElm.onerror = function() {
            imgElm.onload = imgElm.onerror = null;
            self.tiny.selection.select(imgElm);
            self.tiny.nodeChanged();
          };
        }

      if(['png', 'jpg', 'gif', 'jpeg'].indexOf(ext) !== -1){
        /* handle images different than others */
        attr = {
          src: 'resolveuid/' + data.uid + '/@@images/image/preview',
          class: 'image-inline'
        };
        attr.id = '__mcenew';
        self.tiny.insertContent(self.tiny.dom.createHTML('img', attr));
        var imgElm = self.tiny.dom.get('__mcenew');
        self.tiny.dom.setAttrib(imgElm, 'id', null);
      }else{
        attr = {
          id: '__mcenew'
        };
        self.tiny.insertContent(self.tiny.dom.createHTML('a', attr));
        var aElm = self.tiny.dom.get('__mcenew');
        self.tiny.dom.setAttrib(aElm, 'id', null);
        self.tiny.dom.setAttrib(aElm, 'href', 'resolveuid/' + data.uid);
        self.tiny.dom.setHTML(aElm, filename);
      }
    },
    fileUploadError: function(){
      /* XXX need to be able to handle errors better? */
      alert('There was an error attempting to upload file. ' +
            'It is possible the file you are uploading is not allowed ' +
            'in the folder you are trying to add it to.');
    },
    init: function() {
      var self = this;
      self.linkModal = self.imageModal = self.uploadModal = null;
      // tiny needs an id in order to initialize. Creat it if not set.
      var id = utils.setId(self.$el);
      var tinyOptions = self.options.tiny;
      tinyOptions.selector = '#' + id;
      tinyOptions.addLinkClicked = function(){
        self.addLinkClicked.apply(self, []);
      };
      tinyOptions.addImageClicked = function(){
        self.addImageClicked.apply(self, []);
      };
      // XXX: disabled skin means it wont load css files which we already
      // include in widgets.min.css
      tinyOptions.skin = false;

      if(!self.options.base_url){
        self.options.base_url = window.location.href;
      }
      if(self.options.rel_upload_path){
        self.options.uploadUrl = self.options.folder_url + '/' + self.options.rel_upload_path;
      } else {
        self.options.uploadUrl = null;
      }

      if(self.options.uploadUrl){
        /*
         * disable until it works better
         * can still upload via link and file overlays
         
        self.dropzone = new DropZone(self.$el, {
          className: 'tinymce-dropzone',
          clickable: false,
          url: self.options.uploadUrl,
          wrap: true,
          autoCleanResults: true,
          success: function(e, data){
            self.fileUploaded($.parseJSON(data));
          },
          error: function(){
            self.fileUploadError();
          }
        });
        */

        tinyOptions.uploadFileClicked = function(){
          self.uploadFileClicked.apply(self, []);
        };
      } else {
        // disable upload button
        tinyOptions.plugins[0] = tinyOptions.plugins[0].replace('ploneupload', '');
        tinyOptions.toolbar = tinyOptions.toolbar.replace('ploneupload', '');
      }

      tinymce.init(tinyOptions);

      /* fixes chrome at least,
       * still not working quite right in firefox
      if(self.options.uploadUrl){
        var events = ["drop", "dragstart", "dragend", "dragenter", "dragover",
                      "dragleave"];
        var iframe = self.$el.prev().find('.mce-edit-area iframe');
        var win = $(window.frames[iframe.attr('id')]);
        var body = iframe.contents().find('body');
        $.each(events, function(index, ev){
          win.on(ev, function(e){
            self.dropzone.dropzone.emit(ev);
            console.log(ev);
          });
          body.on(ev, function(e){
            self.dropzone.dropzone.emit(ev);
            console.log(ev);
          });
        });
      }*/
      self.tiny = tinymce.get(id);

      /* tiny really should be doing this by default
       * but this fixes overlays not saving data */
      var $form = self.$el.parents('form');
      $form.on('submit', function(){
        self.tiny.save();
      });
    }
  });

  return TinyMCE;

});
