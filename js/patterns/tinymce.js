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
/*global tinymce:true,console:true */


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-patterns-relateditems',
  'mockup-patterns-modal',
  'tinymce'
], function($, Base, RelatedItems, Modal, tinymce) {
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
      initialLinkType: 'internal'
    },
    init: function(){
      var self = this;
      self.tinypattern = self.options.tinypattern;
      self.tiny = self.tinypattern.tiny;
      self.linkType = self.options.initialLinkType;
      self.linkTypes = self.options.linkTypes;
      self.initData();
      self.anchor_nodes = [];
      self.anchor_data = [];

      self.modal = new Modal(self.$el, {
        html: '<div>' +
          '<div class="linkModal">' +
            '<h1>' + self.options.text.insertHeading + '</h1>' +
            self.buildLinkTypeElement() +
            '<hr style="clear:both" />' +
            '<div class="internal linkType">' +
              "<input type='text' name='internal' class='pat-relateditems' data-pat-relateditems='" +
              JSON.stringify(self.options.relatedItems) + "' value='" + self.uid + "' />" +
            '</div>' +
            '<div class="image linkType">' +
              "<input type='text' name='image' class='pat-relateditems' data-pat-relateditems='" +
              JSON.stringify(self.options.relatedItems) + "' value='" + self.uid + "' />" +
            '</div>' +
            '<div class="control-group external linkType">' +
              '<label>' + self.options.text.external + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="external" value="' + self.external + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group email linkType">' +
              '<label>' + self.options.text.email + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="email" value="' + self.email + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group email linkType">' +
              '<label>' + self.options.text.subject + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="subject" value="' + self.subject + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group anchor linkType">' +
              '<label>Select an anchor</label>' +
              '<div class="controls">' +
                '<select name="anchor" class="pat-select2" data-pat-select2="width:500px" value="' + self.anchor + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group linkType anchor email external internal">' +
              '<div class="controls">' +
                self.buildTargetElement() +
              '</div>' +
            '</div>' +
            '<div class="control-group linkType anchor email external internal">' +
              '<label>' + self.options.text.title + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="title" value="' + self.title + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group linkType externalImage">' +
              '<label>' + self.options.text.externalImage + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="externalImage" value="' + self.externalImage + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group linkType image externalImage">' +
              '<label>' + self.options.text.alt + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="alt" value="' + self.alt + '" />' +
              '</div>' +
            '</div>' +
            '<div class="control-group linkType image externalImage">' +
              '<label>' + self.options.text.imageAlign + '</label>' +
              '<div class="controls">' +
                '<select name="align">' +
                  '<option value="inline">Inline</option>' +
                  '<option value="right">Right</option>' +
                  '<option value="left">Left</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
            '<div class="control-group linkType image">' +
              '<label>' + self.options.text.scale + '</label>' +
              '<div class="controls">' +
                self.buildScalesElement() +
              '</div>' +
            '</div>' +
            '<input type="submit" class="btn" name="cancel" value="' + self.options.text.cancelBtn + '" />' +
            '<input type="submit" class="btn btn-primary" name="insert" value="' + self.options.text.insertBtn + '" />' +
          '</div>' +
        '</div>',
        templateOptions: {
          content: null,
          buttons: '.btn'
        }
      });
      self.modal.on('shown', function(e){
        self.modalShown.apply(self, [e]);
      });
      self.initElements();
    },
    initElements: function(){
      var self = this;
      self.$internal = $('input[name="internal"]', self.modal.$modal);
      self.$target = $('select[name="target"]', self.modal.$modal);
      self.$button = $('input[name="insert"]', self.modal.$modal);
      self.$title = $('input[name="title"]', self.modal.$modal);
      self.$external = $('input[name="external"]', self.modal.$modal);
      self.$email = $('input[name="email"]', self.modal.$modal);
      self.$subject = $('input[name="subject"]', self.modal.$modal);
      self.$anchor = $('select[name="anchor"]', self.modal.$modal);

      /* image elements */
      self.$image = $('input[name="image"]', self.modal.$modal);
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
      $('.' + self.linkTypes.join(',.'), self.modal.$modal).hide();
      $('.' + self.linkType).show();
    },
    getLinkUrl: function(){
      // get the url, only get one uid
      var self = this;
      var val;
      if(self.linkType === 'internal'){
        val = self.$internal.select2('val');
        if(val){
          if(typeof(val) === 'object'){
            val = val[0];
          }
          return 'resolveuid/' + val;
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
        val = self.$image.select2('val');
        if(val){
          if(typeof(val) === 'object'){
            val = val[0];
          }
          var url = 'resolveuid/' + val;
          var scale = self.$scale.val();
          if(scale){
            url += '/@@images/image/' + scale;
          }
          return url;
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
        var href = self.getLinkUrl();
        if(!href){
          return; // just cut out if no url
        }
        if(['image', 'externalImage'].indexOf(self.linkType) !== -1){
          self.updateImage(href);
        } else {
          /* regular anchor */
          self.updateAnchor(href);
        }
        self.hide();
      });
      $('input[name="cancel"]', self.modal.$modal).click(function(e){
        e.preventDefault();
        self.hide();
      });
      $('.linkTypes input:radio', self.modal.$modal).change(function(){
        self.linkType = $(this).val();
        self.activateLinkTypeElements();
      });
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
      if(self.imgElm.nodeName !== 'IMG'){
        self.imgElm = null;
      }

      self.text = self.initialText = self.selection.getContent({format: 'text'});
      self.href = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'href') : '';
      self.target = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'target') : '';
      self.rel = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'rel') : '';
      self.title = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'title') : '';
      self.src = self.imgElm ? self.dom.getAttrib(self.imgElm, 'src') : '';
      self.klass = self.imgElm ? self.dom.getAttrib(self.imgElm, 'class') : '';
      self.alt = self.imgElm ? self.dom.getAttrib(self.imgElm, 'alt') : '';

      if (self.imgElm && self.imgElm.nodeName === "IMG") {
        self.text = self.initialText = " ";
      }

      self.uid = '';
      if(self.href){
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
        var klasses = self.klass.split(' ');
        for(var i=0; i<klasses.length; i=i+1){
          var klass = klasses[i];
          if(klass.indexOf('image-') !== -1){
            self.align = klass.replace('image-', '');
          }
        }
      }
    },
    buildScalesElement: function(){
      var self = this;
      var html = '<select name="scale"><option value="">Original</option>';
      var scales = self.options.scales.split(',');
      for(var i=0; i<scales.length; i=i+1){
        var scale = scales[i].split(':');
        html += '<option value="' + scale[1] + '">' + scale[0] + '</option>';
      }
      html += '</select>';
      return html;
    },
    buildLinkTypeElement: function(){
      var self = this;
      var html = '<div class="linkTypes">';
      for(var i=0; i<self.linkTypes.length; i=i+1){
        var type = self.linkTypes[i];
        html += '<label><input name="linktype" type="radio" ' +
          ' value="' + type + '" />' + self.options.text[type] + '</label>';
      }
      html += '</div>';
      return html;
    },
    buildTargetElement: function(){
      var self = this;
      var html = '<select name="target">';
      for(var i=0; i<self.options.targetList.length; i=i+1){
        var target = self.options.targetList[i];
        html += '<option value="' + target.value + '">' + target.text + '</option>';
      }
      html += '</select>';
      return html;
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
       * be abel to privde default values for the overlay
       */
      var self = this;
      self.linkType = self.$linkTypes.find('input:first').val(); // reset this since we won't know...
      self.initElements();
      self.initData();
      var relatedEl = self.$internal;
      if(self.linkType === 'image'){
        relatedEl = self.$image;
      }
      if(self.uid){
        relatedEl.attr('value', self.uid);
      }else{
        relatedEl.attr('value', '');
      }
      self.$title.attr('value', self.title);
      self.$external.attr('value', self.external);
      self.$email.attr('value', self.email);
      self.$subject.attr('value', self.subject);
      self.$external.attr('value', self.external);
      self.$alt.attr('value', self.alt);
      self.$externalImage.attr('value', self.externalImage);

      // unselect existing
      self.setSelectElement(self.$target, self.target);
      self.setSelectElement(self.$anchor, self.anchor);
      self.setSelectElement(self.$scale, self.scale);
      self.setSelectElement(self.$align, self.align);
    }
  });


  var TinyMCE = Base.extend({
    name: 'tinymce',
    defaults: {
      relatedItems: {
        attributes: ['UID', 'Title', 'Description', 'getURL', 'Type', 'path', 'ModificationDate'],
        batchSize: 20,
        basePath: '/',
        ajaxvocabulary: null,
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
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste plonelink ploneimage"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | unlink plonelink ploneimage"
      }
    },
    addLinkClicked: function(){
      var self = this;
      if(self.linkModal === null){
        self.linkModal = new LinkModal(self.$el,
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
          relatedItems: {
            baseCriteria: [{
              i: 'Type',
              o: 'plone.app.querystring.operation.list.contains',
              v: self.options.imageTypes.split(',').concat(self.options.folderTypes.split(','))
            }],
            resultTemplate: '' +
  '<div class="pat-relateditems-result pat-relateditems-type-<%= Type %>">' +
  ' <span class="pat-relateditems-buttons">' +
  '  <% if (folderish) { %>' +
  '     <a class="pat-relateditems-result-browse" href="#" data-path="<%= path %>">' +
  '       <i class="icon-folder-open"></i>' +
  '    </a>' +
  '   <% } %>' +
  '  <% if (!selected && !folderish) { %>' +
  '     <a class="pat-relateditems-result-select" href="#">' +
  '         <i class="icon-plus-sign"></i>' +
  '     </a>' +
  '  <% } %>' +
  ' </span>' +
  ' <% if (!folderish) { %>' +
  '   <span class="pat-relateditems-result-image">' +
  '     <img src="<%= getURL %>/@@images/image/tile" />' +
  '   </span>' +
  ' <% } %>' +
  ' <span class="pat-relateditems-result-title"><%= Title %></span>' +
  ' <span class="pat-relateditems-result-path"><%= path %></span>' +
  '</div>',
            selectionTemplate: '' +
  '<span class="pat-relateditems-item pat-relateditems-type-<%= Type %>">' +
  ' <span class="pat-relateditems-result-image">' +
  '   <img src="<%= getURL %>/@@images/image/tile" />' +
  ' </span>' +
  ' <span class="pat-relateditems-item-title"><%= Title %></span>' +
  ' <span class="pat-relateditems-item-path"><%= path %></span>' +
  '</span>',

          }
        });
        self.imageModal = new LinkModal(self.$el, options);
        self.imageModal.show();
      } else {
        self.imageModal.reinitialize();
        self.imageModal.show();
      }
    },
    init: function() {
      var self = this;
      self.linkModal = self.imageModal = null;
      // tiny needs an id in order to initialize. Creat it if not set.
      var id = self.$el.attr('id');
      if(id === undefined){
        id = 'tiny' + (Math.floor((1 + Math.random()) * 0x10000)
          .toString(16).substring(1));
        self.$el.attr('id', id);
      }
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
      tinymce.init(tinyOptions);
      self.tiny = tinymce.get(id);
    }
  });

  return TinyMCE;

});
