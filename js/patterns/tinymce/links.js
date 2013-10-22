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


define([
  'jquery',
  'underscore',
  'mockup-patterns-base',
  'mockup-patterns-relateditems',
  'mockup-patterns-modal',
  'tinymce',
  'mockup-patterns-dropzone',
  'text!js/patterns/tinymce/templates/link.xml'
], function($, _, Base, RelatedItems, Modal, tinymce, DropZone, LinkTemplate) {
  "use strict";

  var LinkType = Base.extend({
    defaults: {
      linkModal: null // required
    },
    init: function(){
      this.linkModal = this.options.linkModal;
      this.tinypattern = this.options.tinypattern;
      this.tiny = this.tinypattern.tiny;
      this.dom = this.tiny.dom;
      this.$input = this.$el.find('input');
    },
    value: function(){
      return this.$input.val();
    },
    toUrl: function(){
      return this.value();
    },
    load: function(element){
      this.$input.attr('value', this.tiny.dom.getAttrib(element, 'data-val'));
    },
    set: function(val){
      this.$input.attr('value', val);
    },
    attributes: function(){
      return {
        'data-val': this.value()
      };
    }
  });

  var InternalLink = LinkType.extend({
    init: function(){
      var self = this;
      LinkType.prototype.init.call(self);
      self.$input.addClass('pat-relateditems');
      self.createRelatedItems();
    },
    createRelatedItems: function(){
      this.relatedItems = new RelatedItems(this.$input,
        this.linkModal.options.relatedItems);
    },
    value: function(){
      var self = this;
      var val = self.$input.select2('data');
      if(val && typeof(val) === 'object'){
        val = val[0];
      }
      return val;
    },
    toUrl: function(){
      var value = this.value();
      if(value){
        return this.tinypattern.generateUrl(value);
      }
      return null;
    },
    load: function(element){
      var val = this.tiny.dom.getAttrib(element, 'data-val');
      if(val){
        this.set(val);
      }
    },
    set: function(val){
      // kill it and then reinitialize since select2 will load data then
      this.$input.select2('destroy');
      this.$input.attr('data-relateditems', undefined); // reset the pattern
      this.$input.parent().replaceWith(this.$input);
      this.$input.attr('value', val);
      this.createRelatedItems();
    },
    attributes: function(){
      var val = this.value();
      if(val){
        return {
          'data-val': val.UID
        };
      }
      return {};
    }

  });

  var ImageLink = InternalLink.extend({
    toUrl: function(){
      var value = this.value();
      return this.tinypattern.generateImageUrl(value, this.linkModal.$scale.val());
    }
  });

  var EmailLink = LinkType.extend({
    toUrl: function(){
      var self = this;
      var val = self.value();
      if(val){
        var subject = self.getSubject();
        var href = 'mailto:' + val;
        if(subject){
          href += '?subject=' + subject;
        }
        return href;
      }
      return null;
    },
    load: function(element){
      LinkType.prototype.load.apply(this, [element]);
      this.linkModal.$subject.val(this.tiny.dom.getAttrib(element, 'data-subject'));
    },
    getSubject: function(){
      return this.linkModal.$subject.val();
    },
    attributes: function(){
      var attribs = LinkType.prototype.attributes.call(this);
      attribs['data-subject'] = this.getSubject();
      return attribs;
    }
  });

  var AnchorLink = LinkType.extend({
    init: function(){
      var self = this;
      LinkType.prototype.init.call(self);
      self.$select = self.$el.find('select');
      self.anchorNodes = [];
      self.anchorData = [];
      self.populate();
    },
    value: function(){
      var self = this;
      var val = self.$select.select2('data');
      if(val && typeof(val) === 'object'){
        val = val[0];
      }
      return val;
    },
    populate: function(){
      var self = this;
      self.$select.find('option').remove();
      self.anchorNodes = [];
      self.anchorData = [];
      var node, i, name, title;

      var nodes = self.tiny.dom.select('a.mceItemAnchor,img.mceItemAnchor,a.mce-item-anchor,img.mce-item-anchor');
      for (i = 0; i < nodes.length; i=i+1) {
        node = nodes[i];
        name = self.tiny.dom.getAttrib(node, "name");
        if(!name){
          name = self.tiny.dom.getAttrib(node, "id");
        }
        if (name !== "") {
          self.anchorNodes.push(node);
          self.anchorData.push({name: name, title: name});
        }
      }

      nodes = self.tiny.dom.select(self.linkModal.options.anchorSelector);
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
          for(i=0; i<self.anchorNodes.length; i=i+1){
            var anode = self.anchorData[i];
            if(anode.name === name){
              found = true;
              // so it's also found, let's update the title to be more presentable
              anode.title = title;
              break;
            }
          }
          if(!found){
            self.anchorData.push({name: name, title:title, newAnchor: true});
            self.anchorNodes.push(node);
          }
        }
      }
      if(self.anchorNodes.length > 0){
        for(i = 0; i < self.anchorData.length; i=i+1){
          var data = self.anchorData[i];
          self.$select.append("<option value='" + i + "'>" + data.title + '</option>');
        }
      } else {
        self.$select.append('<option>No anchors found..</option>');
      }
    },
    getIndex: function(name){
      var self = this;
      for(var i=0; i<self.anchorData.length; i=i+1){
        var data = self.anchorData[i];
        if(data.name === name){
          return i;
        }
      }
      return 0;
    },
    toUrl: function(){
      var self = this;
      var val = self.value();
      if(val){
        var index = parseInt(val, 10);
        var node = self.anchorNodes[index];
        var data = self.anchorData[index];
        if(data.newAnchor){
          node.innerHTML = '<a name="' + data.name + '" class="mce-item-anchor"></a>' + node.innerHTML;
        }
        return '#' + data.name;
      }
      return null;
    },
    set: function(val){
      var anchor = this.getIndex(val);
      this.$select.select2('data', '' + anchor);
    }
  });

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


  var LinkModal = Base.extend({
    name: 'linkmodal',
    defaults: {
      anchorSelector: 'h1,h2,h3',
      linkTypes: [
        /* available, none activate by default because these options
         * only get merged, not set.
        'internal',
        'external',
        'email',
        'anchor',
        'image'
        'externalImage'*/
      ],
      initialLinkType: 'internal',
      text: {
        insertHeading: 'Insert Link'
      },
      linkTypeClassMapping: {
        'internal': InternalLink,
        'external': LinkType,
        'email': EmailLink,
        'anchor': AnchorLink,
        'image': ImageLink,
        'externalImage': LinkType
      }
    },
    template: _.template(LinkTemplate),
    init: function(){
      var self = this;
      self.tinypattern = self.options.tinypattern;
      if(self.tinypattern.options.anchorSelector){
        self.options.anchorSelector = self.tinypattern.options.anchorSelector;
      }
      self.tiny = self.tinypattern.tiny;
      self.dom = self.tiny.dom;
      self.linkType = self.options.initialLinkType;
      self.linkTypes = {};
      self.modal = new Modal(self.$el, {
        html: self.generateModalHtml(),
        content: null,
        buttons: '.btn'
      });
      self.modal.on('shown', function(e){
        self.modalShown.apply(self, [e]);
      });
    },
    generateModalHtml: function(){
      var self = this;
      return self.template({
        text: self.options.text,
        insertHeading: self.options.text.insertHeading,
        linkTypes: self.options.linkTypes,
        externalText: self.options.text.external,
        emailText: self.options.text.email,
        subjectText: self.options.text.subject,
        targetList: self.options.targetList,
        titleText: self.options.text.title,
        externalImageText: self.options.text.externalImage,
        altText: self.options.text.alt,
        imageAlignText: self.options.text.imageAlign,
        scaleText: self.options.text.scale,
        scales: self.options.scales,
        cancelBtn: self.options.text.cancelBtn,
        insertBtn: self.options.text.insertBtn
      });
    },
    isImageMode: function(){
      return ['image', 'externalImage'].indexOf(this.linkType) !== -1;
    },
    initElements: function(){
      var self = this;
      self.$target = $('select[name="target"]', self.modal.$modal);
      self.$button = $('.modal-footer input[name="insert"]', self.modal.$modal);
      self.$title = $('input[name="title"]', self.modal.$modal);
      self.$subject = $('input[name="subject"]', self.modal.$modal);

      self.$alt = $('input[name="alt"]', self.modal.$modal);
      self.$align = $('select[name="align"]', self.modal.$modal);
      self.$scale = $('select[name="scale"]', self.modal.$modal);

      /* load up all the link types */
      _.each(self.options.linkTypes, function(type){
        var $container = $('.linkType.main.' + type, self.modal.$modal);
        self.linkTypes[type] = new self.options.linkTypeClassMapping[type]($container, {
          linkModal: self,
          tinypattern: self.tinypattern
        });
      });

      /* modal els */
      self.$linkTypes = $('.linkTypes', self.modal.$modal);
      var $linkType = self.$linkTypes.find('input[value="' + self.linkType + '"]');
      if($linkType.length > 0){
        $linkType[0].checked = true;
      }
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
      return self.linkTypes[self.linkType].toUrl();
    },
    getValue: function(){
      return this.linkTypes[this.linkType].value();
    },
    updateAnchor: function(href){
      var self = this;
      var target = self.$target.val();
      var title = self.$title.val();
      var data = $.extend(true, {}, {
        title: title ? title : null,
        target: target ? target : null,
        "data-linkType": self.linkType,
        href: href
      }, self.linkTypes[self.linkType].attributes());
      self.tiny.execCommand('mceInsertLink', false, data);
    },
    focusElement: function(elm){
      var self = this;
      self.tiny.focus();
      self.tiny.selection.select(elm);
      self.tiny.nodeChanged();
    },
    updateImage: function(src){
      var self = this;
      var data = $.extend(true, {}, {
        src: src,
        alt: self.$alt.val(),
        class: 'image-' + self.$align.val(),
        "data-linkType": self.linkType,
        "data-scale": self.$scale.val()
      }, self.linkTypes[self.linkType].attributes());
      if (self.imgElm && !self.imgElm.getAttribute('data-mce-object')) {
        data.width = self.dom.getAttrib(self.imgElm, 'width');
        data.height = self.dom.getAttrib(self.imgElm, 'height');
      } else {
        self.imgElm = null;
      }

      function waitLoad(imgElm) {
        imgElm.onload = imgElm.onerror = function() {
          imgElm.onload = imgElm.onerror = null;
          self.focusElement(imgElm);
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
      if(self.imgElm.complete){
        self.focusElement(self.imgElm);
      }
    },
    modalShown: function(e){
      var self = this;

      self.initElements();
      self.initData();

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
    show: function(){
      this.modal.show();
    },
    hide: function(){
      this.modal.hide();
    },
    initData: function(){
      var self = this;

      self.selection = self.tiny.selection;
      self.tiny.focus();

      var selectedElm = self.imgElm = self.selection.getNode();
      self.anchorElm = self.dom.getParent(selectedElm, 'a[href]');

      var linkType;
      if(self.isImageMode()){
        if(self.imgElm.nodeName !== 'IMG'){
          // try finding elsewhere
          if(self.anchorElm){
            var imgs = self.anchorElm.getElementsByTagName('img');
            if(imgs.length > 0){
              self.imgElm = imgs[0];
              self.focusElement(self.imgElm);
            }
          }
        }
        if(self.imgElm.nodeName !== 'IMG'){
          // okay, still no image, unset
          self.imgElm = null;
        }
        if(self.imgElm){
          var src = self.dom.getAttrib(self.imgElm, 'src');
          self.$alt.val(self.dom.getAttrib(self.imgElm, 'alt'));
          linkType = self.dom.getAttrib(self.imgElm, 'data-linktype');
          if(linkType){
            self.linkType = linkType;
            self.linkTypes[self.linkType].load(self.imgElm);
            var scale = self.dom.getAttrib(self.imgElm, 'data-scale');
            self.$scale.val(scale);
          }else if(src){
            self.guessImageLink(src);
          }
          var className = self.dom.getAttrib(self.imgElm, 'class');
          var klasses = className.split(' ');
          for(var i=0; i<klasses.length; i=i+1){
            var klass = klasses[i];
            if(klass.indexOf('image-') !== -1){
              self.$align.val(klass.replace('image-', ''));
            }
          }
        }
      }else if(self.anchorElm){
        self.focusElement(self.anchorElm);
        var href = '';
        href = self.dom.getAttrib(self.anchorElm, 'href');
        self.$target.val(self.dom.getAttrib(self.anchorElm, 'target'));
        self.$title.val(self.dom.getAttrib(self.anchorElm, 'title'));
        linkType = self.dom.getAttrib(self.anchorElm, 'data-linktype');
        if(linkType){
          self.linkType = linkType;
          self.linkTypes[self.linkType].load(self.anchorElm);
        }else if(href){
          self.guessAnchorLink(href);
        }
      }
    },
    guessImageLink: function(src){
      if(src.indexOf(self.options.prependToScalePart) !== -1){
        self.linkType = 'image';
        self.$scale.val(self.tinypattern.getScaleFromUrl(src));
        self.linkTypes.image.set(self.tinypattern.stripGeneratedUrl(src));
      } else {
        self.linkType = 'externalImage';
        self.linkTypes.externalImage.set(src);
      }
    },
    guessAnchorLink: function(href){
      var self = this;
      if(self.options.prependToUrl &&
          href.indexOf(self.options.prependToUrl) !== -1){
        // XXX if using default configuration, it gets more difficult
        // here to detect internal urls so this might need to change...
        self.linkType = 'internal';
        self.linkTypes.internal.set(self.tinypattern.stripGeneratedUrl(href));
      } else if(href.indexOf('mailto:') !== -1){
        self.linkType = 'email';
        var email = href.substring("mailto:".length, href.length);
        var split = email.split('?subject=');
        self.linkTypes.email.set(split[0]);
        if(split.length > 1){
          self.$subject.val(decodeURIComponent(split[1]));
        }
      } else if(href[0] === '#'){
        self.linkType = 'anchor';
        self.linkTypes.anchor.setRaw(href.substring(1));
      } else {
        self.linkType = 'external';
        self.linkTypes.external.setRaw(href);
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
      self.modal.options.html = self.generateModalHtml();
    }
  });

  return LinkModal;

});
