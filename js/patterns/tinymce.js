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
  'js/patterns/base',
  'js/patterns/relateditems',
  'js/patterns/modal'
], function($, Base, RelatedItems, Modal) {
  "use strict";

  try{
    // XXX if tinymce not loading, let's bail instead of giving errors.
    if(tinymce === undefined){}
  }catch(e){
    console.log('Warning: tinymce not loaded.');
    return;
  }

  /* register the tinymce plugin */
  var Modal_ = Modal;
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
    /*
    * XXX ONLY working with linking by resolveuid. IMO, this should be the
    * only supported way.
    */
    name: 'linkmodal',
    linkTypes: [
      'internal',
      'external',
      'email',
      'anchor'
    ],
    defaults: {
      anchor_selector: 'h1,h2,h3'
    },
    init: function(){
      var self = this;
      self.tinypattern = self.options.tinypattern;
      self.tiny = self.tinypattern.tiny;
      self.linkType = 'internal';
      self.initData();
      self.anchor_nodes = [];
      self.anchor_data = [];

      self.modal = new Modal_(self.$el, {
        html: '<div>' +
          '<div class="linkModal">' +
            '<h1>' + self.options.text.insertHeading + '</h1>' +
            self.buildLinkTypeElement() +
            '<hr style="clear:both" />' +
            '<div class="internal">' +
              "<input type='text' class='pat-relateditems' data-pat-relateditems='" +
              JSON.stringify(self.options.relatedItems) + "' value='" + self.uid + "' />" +
            '</div>' +
            '<div class="external">' +
              '<div class="control-group">' +
                '<label>' + self.options.text.external + '</label>' +
                '<div class="controls">' +
                  '<input type="text" name="external" value="' + self.external + '" />' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="email">' +
              '<div class="control-group">' +
                '<label>' + self.options.text.email + '</label>' +
                '<div class="controls">' +
                  '<input type="text" name="email" value="' + self.email + '" />' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="email">' +
              '<div class="control-group">' +
                '<label>' + self.options.text.subject + '</label>' +
                '<div class="controls">' +
                  '<input type="text" name="subject" value="' + self.subject + '" />' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="anchor">' +
              '<div class="control-group">' +
                '<label>Select an anchor</label>' +
                '<div class="controls">' +
                  '<select name="anchor" class="pat-select2" data-pat-select2="width:500px" value="' + self.anchor + '" />' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="controls">' +
              self.buildTargetElement() +
            '</div>' +
            '<div class="control-group">' +
              '<label>' + self.options.text.title + '</label>' +
              '<div class="controls">' +
                '<input type="text" name="title" value="' + self.title + '" />' +
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
      self.modal.on('shown', function(){
        self.modalShown.apply(self, []);
      });
      self.initElements();
    },
    initElements: function(){
      var self = this;
      self.$select = $('input.pat-relateditems', self.modal.$modal);
      self.$target = $('select[name="target"]', self.modal.$modal);
      self.$button = $('input[name="insert"]', self.modal.$modal);
      self.$title = $('input[name="title"]', self.modal.$modal);
      self.$external = $('input[name="external"]', self.modal.$modal);
      self.$email = $('input[name="email"]', self.modal.$modal);
      self.$subject = $('input[name="subject"]', self.modal.$modal);
      self.$anchor = $('select[name="anchor"]', self.modal.$modal);
      self.$linkTypes = $('.linkTypes', self.modal.$modal);
      self.$linkTypes.find('input[value="' + self.linkType + '"]')[0].checked = true;
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
        val = self.$select.select2('val');
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
          var index = parseInt(val);
          var node = self.anchor_nodes[index];
          var data = self.anchor_data[index];
          if(data.newAnchor){
            node.innerHTML = '<a name="' + data.name + '" class="mce-item-anchor"></a>' + node.innerHTML;
          }
          return '#' + data.name;
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
    modalShown: function(){
      var self = this;
      self.initElements();
      self.$button.off('click').on('click', function(e){
        var href = self.getLinkUrl();
        if(!href){
          return; // just cut out if no url
        }
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
      for(i = 0; i < self.anchor_data.length; i=i+1){
        var data = self.anchor_data[i];
        self.$anchor.append("<option value='" + i + "'>" + data.title + '</option>');
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
      self.external = self.email = self.subject = self.anchor = '';
      self.tiny.focus();

      self.selectedElm = self.selection.getNode();
      self.anchorElm = self.dom.getParent(self.selectedElm, 'a[href]');
      if (self.anchorElm) {
        self.selection.select(self.anchorElm);
      }

      self.text = self.initialText = self.selection.getContent({format: 'text'});
      self.href = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'href') : '';
      self.target = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'target') : '';
      self.rel = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'rel') : '';
      self.title = self.anchorElm ? self.dom.getAttrib(self.anchorElm, 'title') : '';

      if (self.selectedElm.nodeName === "IMG") {
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
      }
    },
    buildLinkTypeElement: function(){
      var self = this;
      var linkTypes = [
        ['internal', self.options.text.internal],
        ['external', self.options.text.external],
        ['email', self.options.text.email],
        ['anchor', self.options.text.anchor]
      ];
      var html = '<div class="linkTypes">';
      for(var i=0; i<linkTypes.length; i=i+1){
        var type = linkTypes[i];
        html += '<label><input name="linktype" type="radio" ' +
          ' value="' + type[0] + '" />' + type[1] + '</label>';
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
    reinitialize: function(){
      /*
       * This will probably be called before show is run.
       * It will overwrite the base html template given to
       * be abel to privde default values for the overlay
       */
      var self = this;
      self.linkType = 'internal'; // reset this since we won't know...
      self.initElements();
      self.initData();
      if(self.uid){
        self.$select.attr('value', self.uid);
      }else{
        self.$select.attr('value', '');
      }
      self.$title.attr('value', self.title);
      self.$external.attr('value', self.external);
      self.$email.attr('value', self.email);
      self.$subject.attr('value', self.subject);
      self.$external.attr('value', self.external);

      // unselect existing
      self.$target.find('option:selected').attr('selected', '');
      if(self.target){
        // update
        self.$target
          .find('option[value="' + self.target + '"]')
          .attr('selected', "true");
      }
      self.$anchor.find('option').attr('selected', '');
      if(self.anchor !== ''){
        self.$anchor.find('option[value="' + self.anchor + '"]')
          .attr('selected', 'true');
      }
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
        subject: 'Subject'
      },
      targetList: [
        {text: 'Open in this window / frame', value: ''},
        {text: 'Open in new window', value: '_blank'},
        {text: 'Open in parent window / frame', value: '_parent'},
        {text: 'Open in top frame (replaces all frames)', value: '_top'}
      ],
      tiny: {
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste plonelink"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | unlink plonelink image"
      }
    },
    addLinkClicked: function(){
      var self = this;
      if(self.linkModal === null){
        self.linkModal = new LinkModal(self.$el,
          $.extend({}, self.options, {tinypattern: self}));
        self.linkModal.show();
      } else {
        self.linkModal.reinitialize();
        self.linkModal.show();
      }
    },
    init: function() {
      var self = this;
      self.linkModal = null;
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
      tinymce.init(tinyOptions);
      self.tiny = tinymce.get(id);
    }
  });

  return TinyMCE;

});
