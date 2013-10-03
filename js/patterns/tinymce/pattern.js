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
  'text!js/patterns/tinymce/templates/upload.tmpl',
  'text!js/patterns/tinymce/templates/link.tmpl',
  'text!js/patterns/tinymce/templates/result.tmpl',
  'text!js/patterns/tinymce/templates/selection.tmpl'
], function($, _, Base, RelatedItems, Modal, tinymce, DropZone, dropzone,
            UploadTemplate, LinkTemplate, ResultTemplate, SelectionTemplate) {
  "use strict";

  /* register the tinymce plugin */
  tinymce.PluginManager.add('plonelink', function(editor) {
    editor.addButton('plonelink', {
      icon: 'link',
      tooltip: 'Insert/edit link',
      shortcut: 'Ctrl+K',
      onclick: editor.settings.addLinkClicked,
      stateSelector: 'a[href]'
    });

    editor.addButton('unlink', {
      icon: 'unlink',
      tooltip: 'Remove link(s)',
      cmd: 'unlink',
      stateSelector: 'a[href]'
    });

    editor.addShortcut('Ctrl+K', '', editor.settings.addLinkClicked);

    editor.addMenuItem('plonelink', {
      icon: 'link',
      text: 'Insert link',
      shortcut: 'Ctrl+K',
      onclick: editor.settings.addLinkClicked,
      stateSelector: 'a[href]',
      context: 'insert',
      prependToContext: true
    });
  });


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


  var LinkModal = Base.extend({
    /*
    * XXX ONLY working with linking by resolveuid. IMO, this should be the
    * only supported way.
    */
    name: 'linkmodal',
    defaults: {
      anchor_selector: 'h1,h2,h3',
      linkTypes: [
        /* available, none activate by default because these options
         * only get merged, not set.
        'internal',
        'external',
        'email',
        'anchor',
        'image'*/
      ],
      initialLinkType: 'internal',
      text: {
        insertHeading: 'Insert Link'
      }
    },
    template: _.template(LinkTemplate),
    init: function(){
      var self = this;
      self.tinypattern = self.options.tinypattern;
      if(self.tinypattern.options.anchor_selector){
        self.options.anchor_selector = self.tinypattern.options.anchor_selector;
      }
      self.tiny = self.tinypattern.tiny;
      self.linkType = self.options.initialLinkType;
      self.linkTypes = self.options.linkTypes;
      self.initData();
      self.anchor_nodes = [];
      self.anchor_data = [];
      self.$_modal = null;

      self.modal = new Modal(self.$el, {
        html: self.generateModalHtml(),
        content: null,
        buttons: '.btn'
      });
      self.modal.on('shown', function(e){
        self.modalShown.apply(self, [e]);
      });
      self.initElements();
    },
    generateModalHtml: function(){
      var self = this;
      return self.template({
        text: self.options.text,
        insertHeading: self.options.text.insertHeading,
        linkTypes: self.linkTypes,
        relatedItems: JSON.stringify(self.options.relatedItems),
        externalText: self.options.text.external,
        external: self.external,
        emailText: self.options.text.email,
        email: self.email,
        subjectText: self.options.text.subject,
        subject: self.subject,
        anchor: self.anchor,
        targetList: self.options.targetList,
        selectedTarget: self.target,
        titleText: self.options.text.title,
        title: self.title,
        externalImageText: self.options.text.externalImage,
        externalImage: self.externalImage,
        altText: self.options.text.alt,
        alt: self.alt,
        imageAlignText: self.options.text.imageAlign,
        selectedAlign: self.align,
        scaleText: self.options.text.scale,
        scales: self.options.scales,
        selectedScale: self.scale,
        cancelBtn: self.options.text.cancelBtn,
        insertBtn: self.options.text.insertBtn,
        uid: self.uid
      });
    },
    isImageMode: function(){
      return ['image', 'externalImage'].indexOf(this.linkType) !== -1;
    },
    initElements: function(){
      var self = this;
      self.$internal = $('input[name="internal"]', self.modal.$modal);
      self.$internal.addClass('pat-relateditems').patternRelateditems(self.options.relatedItems);
      self.$target = $('select[name="target"]', self.modal.$modal);
      self.$button = $('.modal-footer input[name="insert"]', self.modal.$modal);
      self.$title = $('input[name="title"]', self.modal.$modal);
      self.$external = $('input[name="external"]', self.modal.$modal);
      self.$email = $('input[name="email"]', self.modal.$modal);
      self.$subject = $('input[name="subject"]', self.modal.$modal);
      self.$anchor = $('select[name="anchor"]', self.modal.$modal);

      /* image elements */
      self.$image = $('input[name="image"]', self.modal.$modal);
      self.$image.addClass('pat-relateditems').patternRelateditems(self.options.relatedItems);

      self.$alt = $('input[name="alt"]', self.modal.$modal);
      self.$align = $('select[name="align"]', self.modal.$modal);
      self.$scale = $('select[name="scale"]', self.modal.$modal);
      self.$externalImage = $('input[name="externalImage"]', self.modal.$modal);

      /* modal els */
      self.$linkTypes = $('.linkTypes', self.modal.$modal);
      var $linkType = self.$linkTypes.find('input[value="' + self.linkType + '"]');
      if($linkType.length > 0){
        $linkType[0].checked = true;
      }
      self.populateAnchorList();
      self.activateLinkTypeElements();
    },
    activateLinkTypeElements: function(){
      /* handle specify url types */
      var self = this;
      $('.linkType', self.modal.$modal).hide();
      $('.' + self.linkType).show();
    },
    getLinkUrl: function(){
      // get the url, only get one uid
      var self = this;
      var val;
      if(self.linkType === 'internal'){
        val = self.$internal.select2('data');
        if(val){
          if(typeof(val) === 'object'){
            val = val[0];
          }
          if(val){
            return 'resolveuid/' + val.UID;
          }
        }
      } else if(self.linkType === 'external'){
        return self.$external.val();
      } else if(self.linkType === 'email'){
        val = self.$email.val();
        if(val){
          var subject = self.$subject.val();
          var href = 'mailto:' + self.$email.val();
          if(subject){
            href += '?subject=' + subject;
          }
          return href;
        }
      } else if(self.linkType === 'anchor'){
        val = self.$anchor.select2('val');
        if(val){
          var index = parseInt(val, 10);
          var node = self.anchor_nodes[index];
          var data = self.anchor_data[index];
          if(data.newAnchor){
            node.innerHTML = '<a name="' + data.name + '" class="mce-item-anchor"></a>' + node.innerHTML;
          }
          return '#' + data.name;
        }
      } else if(self.linkType === 'image'){
        val = self.$image.select2('data');
        if(val){
          if(typeof(val) === 'object'){
            val = val[0];
          }
          if(val){
            var url = 'resolveuid/' + val.UID;
            var scale = self.$scale.val();
            if(scale){
              url += '/@@images/image/' + scale;
            }
            return url;
          }
        }
      } else if(self.linkType === 'externalImage'){
        val = self.$externalImage.val();
        if(val){
          return val;
        }
      }
      return null;
    },
    getAnchorIndex: function(name){
      var self = this;
      for(var i=0; i<self.anchor_data.length; i=i+1){
        var data = self.anchor_data[i];
        if(data.name === name){
          return i;
        }
      }
      return 0;
    },
    updateAnchor: function(href){
      var self = this;
      var target = self.$target.val();
      var title = self.$title.val();
      if (self.text !== self.initialText) {
        if (self.anchorElm) {
          self.tiny.focus();
          self.anchorElm.innerHTML = self.text;

          self.dom.setAttribs(self.anchorElm, {
            href: href,
            target: target ? target : null,
            rel: self.rel ? self.rel : null,
            title: title ? title : null
          });

          self.selection.select(self.anchorElm);
        } else {
          self.tiny.insertContent(self.dom.createHTML('a', {
            href: href,
            target: target ? target : null,
            rel: self.rel ? self.rel : null,
            title: title ? title : null
          }, self.text));
        }
      } else {
        self.tiny.execCommand('mceInsertLink', false, {
          href: href,
          target: target,
          rel: self.rel ? self.rel : null,
          title: title ? title : null
        });
      }
    },
    updateImage: function(src){
      var self = this;
      var data = {
        src: src,
        alt: self.$alt.val(),
        class: 'image-' + self.$align.val()
      };
      if (self.imgElm && !self.imgElm.getAttribute('data-mce-object')) {
        data.width = self.dom.getAttrib(self.imgElm, 'width');
        data.height = self.dom.getAttrib(self.imgElm, 'height');
      } else {
        self.imgElm = null;
      }

      function waitLoad(imgElm) {
        imgElm.onload = imgElm.onerror = function() {
          imgElm.onload = imgElm.onerror = null;
          self.tiny.selection.select(imgElm);
          self.tiny.nodeChanged();
        };
      }

      if (!self.imgElm) {
        data.id = '__mcenew';
        self.tiny.insertContent(self.dom.createHTML('img', data));
        self.imgElm = self.dom.get('__mcenew');
        self.dom.setAttrib(self.imgElm, 'id', null);
      } else {
        self.dom.setAttribs(self.imgElm, data);
      }

      waitLoad(self.imgElm);
    },
    modalShown: function(e){
      var self = this;
      
      self.initElements();
      self.$button.off('click').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var href = self.getLinkUrl();
        if(!href){
          return; // just cut out if no url
        }
        if(self.isImageMode()){
          self.updateImage(href);
        } else {
          /* regular anchor */
          self.updateAnchor(href);
        }
        self.hide();
      });
      $('.modal-footer input[name="cancel"]', self.modal.$modal).click(function(e){
        e.preventDefault();
        self.hide();
      });
      $('.linkTypes input:radio', self.modal.$modal).change(function(){
        self.linkType = $(this).val();
        self.activateLinkTypeElements();
      });
      self.setupDropzone();
    },
    setupDropzone: function(){
      var self = this;
      if(self.options.uploadUrl){
        self.dropzone = new DropZone(self.modal.$modal, {
          className: 'tinymce-dropzone',
          clickable: false,
          url: self.options.uploadUrl,
          wrap: 'inner',
          autoCleanResults: true,
          success: function(e, data){
            self.tinypattern.fileUploaded($.parseJSON(data));
            self.hide();
          }
        });
      }
    },
    populateAnchorList: function(){
      /* 
       * initialize form data that needs to be calculated
       */
      var self = this;
      self.$anchor.find('option').remove();
      self.anchor_nodes = [];
      self.anchor_data = [];
      var node, i, name, title;

      var nodes = self.tiny.dom.select('a.mceItemAnchor,img.mceItemAnchor,a.mce-item-anchor,img.mce-item-anchor');
      for (i = 0; i < nodes.length; i=i+1) {
        node = nodes[i];
        name = self.tiny.dom.getAttrib(node, "name");
        if(!name){
          name = self.tiny.dom.getAttrib(node, "id");
        }
        if (name !== "") {
          self.anchor_nodes.push(node);
          self.anchor_data.push({name: name, title: name});
        }
      }

      nodes = self.tiny.dom.select(self.options.anchor_selector);
      if (nodes.length > 0) {
        for (i = 0; i < nodes.length; i=i+1) {
          node = nodes[i];
          title = $(node).text().replace(/^\s+|\s+$/g, '');
          if (title==='') {
            continue;
          }
          name = title.toLowerCase().substring(0,1024);
          name = name.replace(/[^a-z0-9]/g, '-');
          /* okay, ugly, but we need to first check that this anchor isn't already available */
          var found = false;
          for(i=0; i<self.anchor_nodes.length; i=i+1){
            var anode = self.anchor_data[i];
            if(anode.name === name){
              found = true;
              // so it's also found, let's update the title to be more presentable
              anode.title = title;
              break;
            }
          }
          if(!found){
            self.anchor_data.push({name: name, title:title, newAnchor: true});
            self.anchor_nodes.push(node);
          }
        }
      }
      if(self.anchor_nodes.length > 0){
        for(i = 0; i < self.anchor_data.length; i=i+1){
          var data = self.anchor_data[i];
          self.$anchor.append("<option value='" + i + "'>" + data.title + '</option>');
        }
      } else {
        self.$anchor.append('<option>No anchors found..</option>');
      }
    },
    show: function(){
      this.modal.show();
    },
    hide: function(){
      this.modal.hide();
    },
    initData: function(){
      var self = this;

      self.dom = self.tiny.dom;
      self.selection = self.tiny.selection;
      self.external = self.externalImage = self.email = self.subject = self.anchor = self.scale = self.align ='';
      self.tiny.focus();

      self.selectedElm = self.imgElm = self.selection.getNode();
      self.anchorElm = self.dom.getParent(self.selectedElm, 'a[href]');
      if (self.anchorElm) {
        self.selection.select(self.anchorElm);
      }
      if(self.imgElm.nodeName !== 'IMG' || !self.isImageMode()){
        self.imgElm = null;
      }

      self.text = self.initialText = self.selection.getContent({format: 'text'});
      self.href = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'href') : '';
      self.target = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'target') : '';
      self.rel = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'rel') : '';
      self.title = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'title') : '';
      self.src = self.imgElm ? self.dom.getAttrib(self.imgElm, 'src') : '';
      self.className = self.imgElm ? self.dom.getAttrib(self.imgElm, 'class') : '';
      self.alt = self.imgElm ? self.dom.getAttrib(self.imgElm, 'alt') : '';

      if (self.imgElm && self.imgElm.nodeName === "IMG") {
        self.text = self.initialText = " ";
      }

      self.uid = '';
      if(self.href && !self.isImageMode()){
        if(self.href.indexOf('resolveuid/') !== -1){
          self.uid = self.href.replace('resolveuid/', '');
          self.linkType = 'internal';
        } else if(self.href.indexOf('mailto:') !== -1){
          self.linkType = 'email';
          var email = self.href.substring("mailto:".length, self.href.length);
          var split = email.split('?subject=');
          self.email = split[0];
          if(split.length > 1){
            self.subject = decodeURIComponent(split[1]);
          }
        } else if(self.href[0] === '#'){
          self.linkType = 'anchor';
          self.anchor = self.getAnchorIndex(self.href.substring(1));
        } else {
          self.linkType = 'external';
          self.external = self.href;
        }
      } else if(self.src){
        /* image parsing here */
        if(self.src.indexOf('resolveuid/') !== -1){
          self.linkType = 'image';
          self.uid = self.src.replace('resolveuid/', '');
          // strip scale off
          if(self.uid.indexOf('@@images/image/') !== -1){
            self.scale = self.uid.split('@@images/image/')[1];
          } else if(self.uid.indexOf('/image_') !== -1){
            self.scale = self.uid.split('/image_')[1];
          }
          self.uid = self.uid.split('/@@images')[0].split('/image_')[0];
        } else {
          self.linkType = 'externalImage';
          self.externalImage = self.src;
        }
        var klasses = self.className.split(' ');
        for(var i=0; i<klasses.length; i=i+1){
          var klass = klasses[i];
          if(klass.indexOf('image-') !== -1){
            self.align = klass.replace('image-', '');
          }
        }
      }
    },
    setSelectElement: function($el, val){
      $el.find('option:selected').attr('selected', '');
      if(val){
        // update
        $el.find('option[value="' + val + '"]').attr('selected', "true");
      }
    },
    reinitialize: function(){
      /*
       * This will probably be called before show is run.
       * It will overwrite the base html template given to
       * be able to privde default values for the overlay
       */
      var self = this;
      self.initData();
      self.modal.options.html = self.generateModalHtml();
    }
  });


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
      var id = self.$el.attr('id');
      if(id === undefined){
        id = 'tiny' + (Math.floor((1 + Math.random()) * 0x10000)
          .toString(16).substring(1));
      } else {
        /* hopefully we don't screw anything up here... changing the id 
         * in some cases so we get a decent selector */
        id = id.replace(/\./g, '-');
      }
      self.$el.attr('id', id);
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
