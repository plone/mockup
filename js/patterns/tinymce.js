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
      onclick: editor.settings.openLink,
      stateSelector: 'a[href]'
    });

    editor.addButton('unlink', {
      icon: 'unlink',
      tooltip: 'Remove link(s)',
      cmd: 'unlink',
      stateSelector: 'a[href]'
    });

    editor.addShortcut('Ctrl+K', '', editor.settings.openLink);

    editor.addMenuItem('plonelink', {
      icon: 'link',
      text: 'Insert link',
      shortcut: 'Ctrl+K',
      onclick: editor.settings.openLink,
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
    init: function(){
      var self = this;
      self.tinypattern = self.options.tinypattern;
      self.tiny = self.tinypattern.tiny;
      self.initData();

      self.modal = new Modal_(self.$el, {
        html: '<div>' +
          '<div>' +
            '<h1>' + self.options.text.insertHeading + '</h1>' +
            "<input type='text' class='pat-relateditems' data-pat-relateditems='" +
              JSON.stringify(self.options.relatedItems) + "' value='" + self.uid + "' />" +
            '<div class="controls">' +
              self.buildTargetElement() +
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
    },
    modalShown: function(){
      var self = this;
      self.$select = $('input.pat-relateditems', self.modal.$modal);
      self.$target = $('select[name="target"]', self.modal.$modal);
      self.$button = $('input[name="insert"]', self.modal.$modal);
      self.$button.off('click').on('click', function(e){
        // get the url, only get one uid
        var val = self.$select.select2('val');
        if(!val){
          self.hide();
          return; // No value select, cut out.
        }
        if(typeof(val) === 'object'){
          val = val[0];
        }
        var href = 'resolveuid/' + val;
        var target = self.$target.val();
        if (self.text !== self.initialText) {
          if (self.anchorElm) {
            self.tiny.focus();
            self.anchorElm.innerHTML = self.text;

            self.dom.setAttribs(self.anchorElm, {
              href: href,
              target: target ? target : null,
              rel: self.rel ? self.rel : null
            });

            self.selection.select(self.anchorElm);
          } else {
            self.tiny.insertContent(self.dom.createHTML('a', {
              href: href,
              target: target ? target : null,
              rel: self.rel ? self.rel : null
            }, self.text));
          }
        } else {
          self.tiny.execCommand('mceInsertLink', false, {
            href: href,
            target: target,
            rel: self.rel ? self.rel : null
          });
        }

        self.hide();
      });
      $('input[name="cancel"]', self.modal.$modal).click(function(e){
        e.preventDefault();
        self.hide();
      });

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

      if (self.selectedElm.nodeName === "IMG") {
        self.text = self.initialText = " ";
      }
      self.uid = '';
      if(self.href){
        self.uid = self.href.replace('resolveuid/', '');
      }
    },
    buildTargetElement: function(){
      var self = this;
      var html = '<select name="target">';
      for(var i=0; i<self.options.targetList.length; i=i+1){
        var target = self.options.targetList[i];
        html += '<option value="' + target.value + '">' + target.text + '</option>';
      }
      return html;
    },
    reinitialize: function(){
      /*
       * This will probably be called before show is run.
       * It will overwrite the base html template given to
       * be abel to privde default values for the overlay
       */
      var self = this;
      if(self.uid){
        self.$select.attr('value', self.uid);
      }else{
        self.$select.attr('value', '');
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
        insertHeading: 'Insert link'
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
    openLink: function(){
      /*
       * XXX ONLY working with linking by resolveuid. IMO, this should be the
       * only supported way.
       */
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
      tinyOptions.openLink = function(){
        self.openLink.apply(self, []);
      };
      tinymce.init(tinyOptions);
      self.tiny = tinymce.get(id);
    }
  });

  return TinyMCE;

});
