/* TinyMCE pattern.
 *
 * Options:
 *    relatedItems(object): Related items pattern options. ({ attributes: ["UID", "Title", "Description", "getURL", "portal_type", "path", "ModificationDate"], batchSize: 20, basePath: "/", vocabularyUrl: null, width: 500, maximumSelectionSize: 1, placeholder: "Search for item on site..." })
 *    upload(object): Upload pattern options. ({ attributes: look at upload pattern for getting the options list })
 *    text(object): Translation strings ({ insertBtn: "Insert", cancelBtn: "Cancel", insertHeading: "Insert link", title: "Title", internal: "Internal", external: "External", email: "Email", anchor: "Anchor", subject: "Subject" image: "Image", imageAlign: "Align", scale: "Size", alt: "Alternative Text", externalImage: "External Image URI"})
 *    scales(string): TODO: is this even used ('Listing (16x16):listing,Icon (32x32):icon,Tile (64x64):tile,Thumb (128x128):thumb,Mini (200x200):mini,Preview (400x400):preview,Large (768x768):large')
 *    targetList(array): TODO ([ {text: "Open in this window / frame", value: ""}, {text: "Open in new window", value: "_blank"}, {text: "Open in parent window / frame", value: "_parent"}, {text: "Open in top frame (replaces all frames)", value: "_top"}])
 *    imageTypes(string): TODO ('Image')
 *    folderTypes(string): TODO ('Folder,Plone Site')
 *    linkableTypes(string): TODO ('Document,Event,File,Folder,Image,News Item,Topic')
 *    tiny(object): TODO ({ plugins: [ "advlist autolink lists charmap print preview anchor", "usearchreplace visualblocks code fullscreen autoresize", "insertdatetime media table contextmenu paste plonelink ploneimage" ], menubar: "edit table format tools view insert",
toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | unlink plonelink ploneimage", autoresize_max_height: 1500 })
 *    prependToUrl(string): Text to prepend to generated internal urls. ('')
 *    appendToUrl(string): Text to append to generated internal urls. ('')
 *    prependToScalePart(string): Text to prepend to generated image scale url part. ('/imagescale/')
 *    appendToScalePart(string): Text to append to generated image scale url part. ('')
 *    linkAttribute(string): Ajax response data attribute to use for url. ('path')
 *    defaultScale(string): Scale name to default to. ('Original')
 *
 * Documentation:
 *    # Default
 *
 *    {{ example-1 }}
 *
 *    # With dropzone
 *
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <form>
 *      <textarea class="pat-tinymce"
 *          data-pat-tinymce='{"relatedItems": {
 *                                "vocabularyUrl": "/relateditems-test.json"
 *                                }}'></textarea>
 *    </form>
 *
 * Example: example-2
 *    <form>
 *      <textarea class="pat-tinymce"
 *          data-pat-tinymce='{"relatedItems": {"vocabularyUrl": "/relateditems-test.json" },
 *                            "upload": {"baseUrl": "/", "relativePath": "upload"},
 *                            "pasteImages": true
 *                            }'></textarea>
 *    </form>
 *
 */

/* global alert:true */


define([
  'jquery',
  'underscore',
  'mockup-patterns-base',
  'mockup-patterns-relateditems',
  'mockup-patterns-modal',
  'tinymce',
  'mockup-patterns-autotoc',
  'text!mockup-patterns-tinymce-url/templates/result.xml',
  'text!mockup-patterns-tinymce-url/templates/selection.xml',
  'mockup-utils',
  'mockup-patterns-tinymce-url/js/links',
  'mockup-i18n',
  'translate',
  'tinymce-modern-theme',
  'tinymce-advlist',
  'tinymce-anchor',
  'tinymce-autolink',
  'tinymce-autoresize',
  'tinymce-autosave',
  'tinymce-bbcode',
  'tinymce-charmap',
  'tinymce-code',
  'tinymce-colorpicker',
  'tinymce-contextmenu',
  'tinymce-directionality',
  'tinymce-emoticons',
  'tinymce-fullpage',
  'tinymce-fullscreen',
  'tinymce-hr',
  'tinymce-image',
  'tinymce-importcss',
  'tinymce-insertdatetime',
  'tinymce-layer',
  'tinymce-legacyoutput',
  'tinymce-link',
  'tinymce-lists',
  'tinymce-media',
  'tinymce-nonbreaking',
  'tinymce-noneditable',
  'tinymce-pagebreak',
  'tinymce-paste',
  'tinymce-preview',
  'tinymce-print',
  'tinymce-save',
  'tinymce-searchreplace',
  'tinymce-spellchecker',
  'tinymce-tabfocus',
  'tinymce-table',
  'tinymce-template',
  'tinymce-textcolor',
  'tinymce-textpattern',
  'tinymce-visualblocks',
  'tinymce-visualchars',
  'tinymce-wordcount',
  'tinymce-compat3x'
], function($, _,
            Base, RelatedItems, Modal, tinymce,
            AutoTOC, ResultTemplate, SelectionTemplate,
            utils, LinkModal, I18n, _t) {
  'use strict';

  var TinyMCE = Base.extend({
    name: 'tinymce',
    trigger: '.pat-tinymce',
    defaults: {
      upload: {
        uploadMultiple: false,
        maxFiles: 1,
        showTitle: false
      },
      relatedItems: {
        // UID attribute is required here since we're working with related items
        attributes: ['UID', 'Title', 'Description', 'getURL', 'portal_type', 'path', 'ModificationDate', 'getIcon'],
        batchSize: 20,
        basePath: '/',
        vocabularyUrl: null,
        width: 500,
        maximumSelectionSize: 1,
        placeholder: _t('Search for item on site...')
      },
      text: {
        insertBtn: _t('Insert'), // so this can be configurable for different languages
        cancelBtn: _t('Cancel'),
        insertHeading: _t('Insert link'),
        title: _t('Title'),
        internal: _t('Internal'),
        external: _t('External'),
        email: _t('Email'),
        anchor: _t('Anchor'),
        subject: _t('Subject'),
        image: _t('Image'),
        imageAlign: _t('Align'),
        scale: _t('Size'),
        alt: _t('Alternative Text'),
        externalImage: _t('External Image URI')
      },
      // URL generation options
      loadingBaseUrl: '../../../bower_components/tinymce-builded/js/tinymce/',
      prependToUrl: '',
      appendToUrl: '',
      linkAttribute: 'path', // attribute to get link value from data
      prependToScalePart: '/imagescale/', // some value here is required to be able to parse scales back
      appendToScalePart: '',
      appendToOriginalScalePart: '',
      defaultScale: 'large',
      scales: _t('Listing (16x16):listing,Icon (32x32):icon,Tile (64x64):tile,' +
              'Thumb (128x128):thumb,Mini (200x200):mini,Preview (400x400):preview,' +
              'Large (768x768):large'),
      targetList: [
        {text: _t('Open in this window / frame'), value: ''},
        {text: _t('Open in new window'), value: '_blank'},
        {text: _t('Open in parent window / frame'), value: '_parent'},
        {text: _t('Open in top frame (replaces all frames)'), value: '_top'}
      ],
      imageTypes: ['Image'],
      folderTypes: ['Folder', 'Plone Site'],
      tiny: {
        'content_css': '../../../bower_components/tinymce-builded/js/tinymce/skins/lightgray/content.min.css',
        theme: '-modern',
        plugins: ['advlist', 'autolink', 'lists', 'charmap', 'print', 'preview', 'anchor', 'searchreplace',
                  'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'contextmenu',
                  'paste', 'plonelink', 'ploneimage'],
        menubar: 'edit table format tools view insert',
        toolbar: 'undo redo | styleselect | bold italic | ' +
                 'alignleft aligncenter alignright alignjustify | ' +
                 'bullist numlist outdent indent | ' +
                 'unlink plonelink ploneimage',
        //'autoresize_max_height': 900,
        'height': 400
      },
      pasteImages: false
    },
    addLinkClicked: function() {
      var self = this;
      if (self.linkModal === null) {
        var $el = $('<div/>').insertAfter(self.$el);
        var linkTypes = ['internal', 'upload', 'external', 'email', 'anchor'];
        if(!self.options.upload){
          linkTypes.splice(1, 1);
        }
        self.linkModal = new LinkModal($el,
          $.extend(true, {}, self.options, {
            tinypattern: self,
            linkTypes: linkTypes
          })
        );
        self.linkModal.show();
      } else {
        self.linkModal.reinitialize();
        self.linkModal.show();
      }
    },
    addImageClicked: function() {
      var self = this;
      if (self.imageModal === null) {
        var linkTypes = ['image', 'uploadImage', 'externalImage'];
        if(!self.options.upload){
          linkTypes.splice(1, 1);
        }
        var options = $.extend(true, {}, self.options, {
          tinypattern: self,
          linkTypes: linkTypes,
          initialLinkType: 'image',
          text: {
            insertHeading: _t('Insert Image')
          },
          relatedItems: {
            baseCriteria: [{
              i: 'portal_type',
              o: 'plone.app.querystring.operation.list.contains',
              v: self.options.imageTypes.concat(self.options.folderTypes)
            }],
            selectableTypes: self.options.imageTypes,
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
    addImagePasted: function(file){
      var self = this;
      if (self.pasteModal === null) {
        var linkTypes = ['uploadImage'];
        /*if(!self.options.upload){
          linkTypes.splice(1, 1);
        }*/
        var options = $.extend(true, {}, self.options, {
          tinypattern: self,
          linkTypes: linkTypes,
          initialLinkType: 'uploadImage',
          text: {
            insertHeading: _t('Insert Image')
          },
          /*relatedItems: {
            baseCriteria: [{
              i: 'portal_type',
              o: 'plone.app.querystring.operation.list.contains',
              v: self.options.imageTypes.concat(self.options.folderTypes)
            }],
            selectableTypes: self.options.imageTypes,
            resultTemplate: ResultTemplate,
            selectionTemplate: SelectionTemplate
          }*/
        });
        var $el = $('<div/>').insertAfter(self.$el);
        self.pasteModal = new LinkModal($el, options);
        self.pasteModal.options.upload.clipboardfile = file;
        self.pasteModal.show();
        $('a[href=' + $('.linkType.uploadImage legend').attr('id') + ']').click();
      } else {
        self.pasteModal.reinitialize();
        self.pasteModal.options.upload.clipboardfile = file;
        self.pasteModal.show();
        $('a[href=' + $('.linkType.uploadImage legend').attr('id') + ']').click();
      }
    },
    generateUrl: function(data) {
      var self = this;
      var part = data[self.options.linkAttribute];
      return self.options.prependToUrl + part + self.options.appendToUrl;
    },
    generateImageUrl: function(data, scale_name) {
      var self = this;
      var url = self.generateUrl(data);
      if (scale_name !== ""){
        var part = scale_name;
        for(var i=0; i<self.options.scales.length; i++){
          if(self.options.scales[i].name == scale_name){
            part = self.options.scales[i].part;
          }
        }
        url = (url + self.options.prependToScalePart + part +
               self.options.appendToScalePart);
      }else{
        url = url + self.options.appendToOriginalScalePart;
      }
      return url;
    },
    stripGeneratedUrl: function(url) {
      // to get original attribute back
      var self = this;
      url = url.split(self.options.prependToScalePart, 2)[0];
      if (self.options.prependToUrl) {
        var parts = url.split(self.options.prependToUrl, 2);
        if (parts.length === 2) {
          url = parts[1];
        }
      }
      if (self.options.appendToUrl) {
        url = url.split(self.options.appendToUrl)[0];
      }
      return url;
    },
    getScaleFromUrl: function(url) {
      var self = this;
      var split = url.split(self.options.prependToScalePart);
      if (split.length !== 2) {
        // not valid scale, screw it
        return null;
      }
      if (self.options.appendToScalePart) {
        url = split[1].split(self.options.appendToScalePart)[0];
      } else {
        url = split[1];
      }
      if (url.indexOf('/image_') !== -1) {
        url = url.split('/image_')[1];
      }
      return url;
    },
    initLanguage: function(call_back){
      var self = this;
      var i18n = new I18n();
      var lang = i18n.currentLanguage;
      if (lang !== 'en' && self.options.tiny.language !== 'en') {
        tinymce.baseURL = self.options.loadingBaseUrl;
        // does the expected language exist?
        $.ajax({
          url: tinymce.baseURL + '/langs/' + lang + '.js',
          method: 'GET',
          cache: 'true',
          success: function() {
            self.options.tiny.language = lang;
            call_back();
          },
          error: function() {
            // expected lang not available, let's fallback to closest one
            if (lang.split('_') > 1){
              lang = lang.split('_')[0];
            } else {
              lang = lang + '_' + lang.toUpperCase();
            }
            $.ajax({
              url: tinymce.baseURL + '/langs/' + lang + '.js',
              method: 'GET',
              cache: 'true',
              success: function() {
                self.options.tiny.language = lang;
                call_back();
              },
              error: function() {
                call_back();
              }
            });
          }
        });
      } else {
        call_back();
      }
    },
    init: function() {
      var self = this;
      self.linkModal = self.imageModal = self.uploadModal = self.pasteModal = null;
      // tiny needs an id in order to initialize. Creat it if not set.
      var id = utils.setId(self.$el);
      var tinyOptions = self.options.tiny;
      tinyOptions.selector = '#' + id;
      tinyOptions.addLinkClicked = function() {
        self.addLinkClicked.apply(self, []);
      };
      if(self.options.pasteImages){
        tinyOptions.paste_data_images = 'true';
        tinyOptions.addImagePasted = function() {
          self.addImagePasted.apply(self, []);
        };
      }
      tinyOptions.addImageClicked = function(file) {
        self.addImageClicked.apply(self, [file] );
      };
      // XXX: disabled skin means it wont load css files which we already
      // include in widgets.min.css
      tinyOptions.skin = false;
      self.options.relatedItems.generateImageUrl = function(data, scale) {
        // this is so, in our result and selection template, we can
        // access getting actual urls from related items
        return self.generateImageUrl.apply(self, [data, scale]);
      };

      tinyOptions.init_instance_callback = function(editor) {
        if (self.tiny === undefined || self.tiny === null) {
          self.tiny = editor;
        }
      };

      self.initLanguage(function() {
        if(typeof(self.options.scales) === 'string'){
          self.options.scales = _.map(self.options.scales.split(','), function(scale){
            var scale = scale.split(':');
            return {
              part: scale[1],
              name: scale[1],
              label: scale[0]
            };
          });
        }
        if(typeof(self.options.folderTypes) === 'string'){
          self.options.folderTypes = self.options.folderTypes.split(',');
        }
        if(typeof(self.options.imageTypes) === 'string'){
          self.options.imageTypes = self.options.imageTypes.split(',');
        }

        tinymce.init(tinyOptions);
        self.tiny = tinymce.get(id);

        /* tiny really should be doing this by default
         * but this fixes overlays not saving data */
        var $form = self.$el.parents('form');
        $form.on('submit', function() {
          self.tiny.save();
        });
      });
    },
    destroy: function() {
      this.tiny.destroy();
    }
  });

  return TinyMCE;

});
