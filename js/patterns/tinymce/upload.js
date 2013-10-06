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
  'text!js/patterns/tinymce/templates/upload.tmpl'
], function($, _, Base, RelatedItems, Modal, tinymce, UploadTemplate) {
  "use strict";

  
  tinymce.PluginManager.add('ploneimage', function(editor) {
    editor.addButton('ploneimage', {
      icon: 'image',
      tooltip: 'Insert/edit image',
      onclick: editor.settings.addImageClicked,
      stateSelector: 'img:not([data-mce-object])'
    });

    editor.addMenuItem('ploneimage', {
      icon: 'image',
      text: 'Insert image',
      onclick: editor.settings.addImageClicked,
      context: 'insert',
      prependToContext: true
    });
  });


  tinymce.PluginManager.add('ploneupload', function(editor) {
    editor.addButton('ploneupload', {
      icon: 'newdocument',
      tooltip: 'Upload file',
      onclick: editor.settings.uploadFileClicked
    });

    editor.addMenuItem('ploneupload', {
      icon: 'newdocument',
      text: 'Upload file',
      onclick: editor.settings.uploadFileClicked,
      context: 'insert',
      prependToContext: true
    });
  });


  var UploadModal = Base.extend({
    name: 'uploadmodal',
    defaults: {
      text: {
        uploadHeading: 'Upload file',
        file: 'File',
        uploadBtn: 'Upload',
        uploadLocationWarning: 'If you do not select a folder to upload to, ' +
                               "the file will be uploaded to the current folder."
      }
    },
    template: _.template(UploadTemplate),
    init: function(){
      var self = this;
      self.tinypattern = self.options.tinypattern;
      self.modal = new Modal(self.$el, {
        html: self.template({
          uploadUrl: self.options.uploadUrl,
          uploadHeading: self.options.text.uploadHeading,
          uploadLocationWarning: self.options.text.uploadLocationWarning,
          file: self.options.text.file,
          uploadBtn: self.options.text.uploadBtn
        }),
        content: null,
        buttons: '.btn'
      });
      self.modal.on('shown', function(e){
        self.modalShown.apply(self, [e]);
      });
    },
    show: function(){
      this.modal.show();
    },
    hide: function(){
      this.modal.hide();
    },
    modalShown: function(){
      var self = this;
      /* initialize elements so submit does the right thing.. */
      self.$uploadBtn = $('.modal-footer input[type="submit"]', self.modal.$modal);
      self.$form = $('form', self.modal.$modal);
      self.$iframe = $('iframe', self.modal.$modal);
      self.$location = $('[name="location"]', self.modal.$modal);
      self.$location.addClass('pat-relateditems').patternRelateditems(self.options.relatedItems);

      self.$form.on('submit', function(e){
        /* handle file upload */
        var locationData = self.$location.select2('data');
        if(locationData.length > 0){
          self.$form.attr('action',
            locationData[0].getURL + '/' + self.options.rel_upload_path);
        }
        self.modal.$loading.show();
        self.$iframe.on('load', function(){
          var response = self.$iframe.contents();
          self.modal.$loading.hide();
          self.hide();
          if (!response.length || !response[0].firstChild) {
            self.tinypattern.fileUploadError();
          }
          response = $(response[0].body).text();
          self.tinypattern.fileUploaded($.parseJSON(response));
        });
        self.$form[0].target = 'upload_target';
      });
      self.$uploadBtn.on('click', function(e){
        e.preventDefault();
        self.$form.trigger('submit');
      });
    },
    reinitialize: function(){
    }
  });

  return UploadModal;

});
