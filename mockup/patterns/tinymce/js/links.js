define([
  'jquery',
  'underscore',
  'pat-registry',
  'pat-base',
  'tinymce',
  'mockup-patterns-relateditems',
  'mockup-patterns-autotoc',
  'mockup-patterns-modal',
  'mockup-patterns-upload',
  // default link types
  'mockup-tinymce-linktype-anchor',
  'mockup-tinymce-linktype-email',
  'mockup-tinymce-linktype-external',
  'mockup-tinymce-linktype-externalImage',
  'mockup-tinymce-linktype-image',
  'mockup-tinymce-linktype-internal',
  'mockup-tinymce-linktype-upload',
  'mockup-tinymce-linktype-uploadImage'
], function($, _, registry, Base, tinymce, RelatedItems) {
  'use strict';

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
    trigger: '.pat-linkmodal',
    defaults: {
      anchorSelector: 'h1,h2,h3',
      linkTypes: [],  // this is set by the tinymce pattern. 
      initialLinkType: 'internal',
      text: {
        insertHeading: 'Insert Link'
      },
    },
    linkType: undefined,
    linkTypes: {},

    template: function(data) {
      return _.template(this.linkType.template)(data);
    },

    init: function() {
      var self = this;

      _.each(self.options.linkTypes, function(requirejsname) {
        // later in ``initElements`` all linkTypes are initialized.
        var linktype = require(requirejsname);
        this.linkTypes[linktype.name] = linktype;
      });

      self.tinypattern = self.options.tinypattern;
      if (self.tinypattern.options.anchorSelector) {
        self.options.anchorSelector = self.tinypattern.options.anchorSelector;
      }
      self.tiny = self.tinypattern.tiny;
      self.dom = self.tiny.dom;
      self.modal = registry.patterns['plone-modal'].init(self.$el, {
        html: self.generateModalHtml(),
        content: null,
        buttons: '.plone-btn'
      });
      self.modal.on('shown', function(e) {
        self.modalShown.apply(self, [e]);
      });
    },

    isOnlyTextSelected: function() {
      /* pulled from TinyMCE link plugin */
      var html = this.tiny.selection.getContent();

      // Partial html and not a fully selected anchor element
      if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') === -1)) {
        return false;
      }

      if (this.anchorElm) {
        var nodes = this.anchorElm.childNodes, i;

        if (nodes.length === 0) {
          return false;
        }

        for (var ii = nodes.length - 1; ii >= 0; ii--) {
          if (nodes[ii].nodeType !== 3) {
            return false;
          }
        }
      }

      return true;
    },

    generateModalHtml: function() {
      return this.template({
        options: this.options,
        upload: this.options.upload,
        text: this.options.text,
        insertHeading: this.options.text.insertHeading,
        linkTypes: _.keys(this.linkTypes),
        externalText: this.options.text.external,
        emailText: this.options.text.email,
        subjectText: this.options.text.subject,
        targetList: this.options.targetList,
        titleText: this.options.text.title,
        externalImageText: this.options.text.externalImage,
        altText: this.options.text.alt,
        imageAlignText: this.options.text.imageAlign,
        scaleText: this.options.text.scale,
        imageScales: this.options.imageScales,
        cancelBtn: this.options.text.cancelBtn,
        insertBtn: this.options.text.insertBtn
      });
    },

    initElements: function() {
      var self = this;
      self.$target = $('select[name="target"]', self.modal.$modal);
      self.$button = $('.plone-modal-footer input[name="insert"]', self.modal.$modal);
      self.$title = $('input[name="title"]', self.modal.$modal);
      self.$subject = $('input[name="subject"]', self.modal.$modal);

      self.$alt = $('input[name="alt"]', self.modal.$modal);
      self.$align = $('select[name="align"]', self.modal.$modal);
      self.$scale = $('select[name="scale"]', self.modal.$modal);

      /* load up all the link types */
      _.each(this.linkTypes, function(linktype) {
        var $container = $('.linkType.' + linktype.name + ' .main', self.modal.$modal);
        self.linkTypes[linktype.name] = new linktype($container, {
          linkModal: self,
          tinypattern: self.tinypattern
        });
      });

      $('.autotoc-nav a', self.modal.$modal).click(function() {
        var $fieldset = $('fieldset.linkType', self.modal.$modal).eq($(this).index());
        var classes = $fieldset[0].className.split(/\s+/);
        _.each(classes, function(val) {
          if (_.indexOf(_.keys(this.linkTypes), val) !== -1){
            self.linkType = this.linkTypes[val];
          }
        });
      });
    },

    getLinkUrl: function() {
      // get the url, only get one uid
      return this.linkType.toUrl();
    },

    getValue: function() {
      return this.linkType.value();
    },

    updateAnchor: function(href) {
      var self = this;

      self.tiny.focus();
      self.tiny.selection.setRng(self.rng);

      var target = self.$target.val();
      var title = self.$title.val();
      var linkAttrs = $.extend(true, self.data, {
        title: title ? title : null,
        target: target ? target : null,
        'data-linkType': self.linkType.name,
        href: href
      }, self.linkType.attributes());
      if (self.anchorElm) {

        if (self.onlyText && linkAttrs.text !== self.initialText) {
          if ("innerText" in self.anchorElm) {
            self.anchorElm.innerText = self.data.text;
          } else {
            self.anchorElm.textContent = self.data.text;
          }
        }

        self.tiny.dom.setAttribs(self.anchorElm, linkAttrs);

        self.tiny.selection.select(self.anchorElm);
        self.tiny.undoManager.add();
      } else {
        if (self.onlyText) {
          self.tiny.insertContent(
            self.tiny.dom.createHTML('a', linkAttrs,
                                     self.tiny.dom.encode(self.data.text)));
        } else {
          self.tiny.execCommand('mceInsertLink', false, linkAttrs);
        }
      }
    },

    focusElement: function(elm) {
      this.tiny.focus();
      this.tiny.selection.select(elm);
      this.tiny.nodeChanged();
    },

    updateImage: function(src) {
      var self = this;
      var title = self.$title.val();

      self.tiny.focus();
      self.tiny.selection.setRng(self.rng);

      var data = $.extend(true, {}, {
        src: src,
        title: title ? title : null,
        alt: self.$alt.val(),
        'class': 'image-' + self.$align.val(),
        'data-linkType': self.linkType.name,
        'data-scale': self.$scale.val()
      }, self.linkType.attributes());
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
      if (self.imgElm.complete) {
        self.focusElement(self.imgElm);
      }
    },

    modalShown: function(e) {
      var self = this;
      self.initElements();
      self.initData();
      // upload init
      if (self.options.upload) {
        self.$upload = $('.uploadify-me', self.modal.$modal);
        self.options.upload.relatedItems = $.extend(true, {}, self.options.relatedItems);
        self.options.upload.relatedItems.selectableTypes = self.options.folderTypes;
        self.$upload.addClass('pat-upload').patternUpload(self.options.upload);
        self.$upload.on('uploadAllCompleted', function(evt, data) {
          if (self.linkType.name === 'image'){
            self.linkType.set(data.data.UID);
            $('#' + $('#tinylink-image' , self.modal.$modal).data('navref')).trigger('click');
          } else {
            self.linkTypes['internal'].set(data.data.UID);
            $('#' + $('#tinylink-internal' , self.modal.$modal).data('navref')).trigger('click');
          }
        });
      }

      self.$button.off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.linkType = self.linkTypes[self.modal.$modal.find('fieldset.active').data('linktype')];

        if(self.linkType.name === 'uploadImage' || self.linkType.name === 'upload'){
          var patUpload = self.$upload.data().patternUpload;
          if(patUpload.dropzone.files.length > 0){
            patUpload.processUpload();
            self.$upload.on('uploadAllCompleted', function(evt, data) {
              var counter = 0;
              var checkUpload = function(){
                if(counter < 5 && !self.linkType.value()){
                  counter += 1;
                  setTimeout(checkUpload, 100);
                  return;
                }else{
                  var href = self.getLinkUrl();
                  self.updateImage(href);
                  self.hide();
                }
              };
              checkUpload();
            });
          }
        }
        var href;
        try{
            href = self.getLinkUrl();
        }catch(error){
            return;  // just cut out if no url
        }
        if (!href) {
          return; // just cut out if no url
        }
        if (this.linkType.imagemode) {
          self.updateImage(href);
        } else {
          /* regular anchor */
          self.updateAnchor(href);
        }
        self.hide();
      });
      $('.plone-modal-footer input[name="cancel"]', self.modal.$modal).click(function(e) {
        e.preventDefault();
        self.hide();
      });
    },

    show: function() {
      this.modal.show();
    },

    hide: function() {
      this.modal.hide();
    },

    initData: function() {
      var self = this;

      self.data = {};
      // get selection BEFORE..
      // This is pulled from TinyMCE link plugin
      self.initialText = null;
      var value;
      self.rng = self.tiny.selection.getRng();
      self.selectedElm = self.tiny.selection.getNode();
      self.anchorElm = self.tiny.dom.getParent(self.selectedElm, 'a[href]');
      self.onlyText = self.isOnlyTextSelected();

      self.data.text = self.initialText = self.anchorElm ? (self.anchorElm.innerText || self.anchorElm.textContent) : self.tiny.selection.getContent({format: 'text'});
      self.data.href = self.anchorElm ? self.tiny.dom.getAttrib(self.anchorElm, 'href') : '';

      if (self.anchorElm) {
        self.data.target = self.tiny.dom.getAttrib(self.anchorElm, 'target');
      } else if (self.tiny.settings.default_link_target) {
        self.data.target = self.tiny.settings.default_link_target;
      }

      if ((value = self.tiny.dom.getAttrib(self.anchorElm, 'rel'))) {
        self.data.rel = value;
      }

      if ((value = self.tiny.dom.getAttrib(self.anchorElm, 'class'))) {
        self.data['class'] = value;
      }

      if ((value = self.tiny.dom.getAttrib(self.anchorElm, 'title'))) {
        self.data.title = value;
      }

      self.selection = self.tiny.selection;
      self.tiny.focus();
      var selectedElm = self.imgElm = self.selection.getNode();
      self.anchorElm = self.dom.getParent(selectedElm, 'a[href]');

      var linkType;
      if (this.linkType.imagemode) {
        if (self.imgElm.nodeName !== 'IMG') {
          // try finding elsewhere
          if (self.anchorElm) {
            var imgs = self.anchorElm.getElementsByTagName('img');
            if (imgs.length > 0) {
              self.imgElm = imgs[0];
              self.focusElement(self.imgElm);
            }
          }
        }
        if (self.imgElm.nodeName !== 'IMG') {
          // okay, still no image, unset
          self.imgElm = null;
        }
        if (self.imgElm) {
          var src = self.dom.getAttrib(self.imgElm, 'src');
          self.$title.val(self.dom.getAttrib(self.imgElm, 'title'));
          self.$alt.val(self.dom.getAttrib(self.imgElm, 'alt'));
          linkType = self.dom.getAttrib(self.imgElm, 'data-linktype');
          if (linkType) {
            self.linkType = thislinkTypes[linkType];
            self.linkType.load(self.imgElm);
            var scale = self.dom.getAttrib(self.imgElm, 'data-scale');
            if(scale){
              self.$scale.val(scale);
            }
            $('#tinylink-' + self.linkType.name, self.modal.$modal).trigger('click');
          }else if (src) {
            self.guessImageLink(src);
          }
          var className = self.dom.getAttrib(self.imgElm, 'class');
          var klasses = className.split(' ');
          for (var i = 0; i < klasses.length; i = i + 1) {
            var klass = klasses[i];
            if (klass.indexOf('image-') !== -1) {
              self.$align.val(klass.replace('image-', ''));
            }
          }
        }
      }else if (self.anchorElm) {
        self.focusElement(self.anchorElm);
        var href = '';
        href = self.dom.getAttrib(self.anchorElm, 'href');
        self.$target.val(self.dom.getAttrib(self.anchorElm, 'target'));
        self.$title.val(self.dom.getAttrib(self.anchorElm, 'title'));
        linkType = self.dom.getAttrib(self.anchorElm, 'data-linktype');
        if (linkType) {
          self.linkType = self.linkTypes[linkType];
          self.linkType.load(self.anchorElm);
          $('#tinylink-' + self.linkType.name, self.modal.$modal).trigger('click');
        }else if (href) {
          self.guessAnchorLink(href);
        }
      }
    },

    guessImageLink: function(src) {
      if (src.indexOf(this.options.prependToScalePart) !== -1) {
        this.linkType = this.linkTypes['image'];
        this.$scale.val(this.tinypattern.getScaleFromUrl(src));
        this.linkType.image.set(this.tinypattern.stripGeneratedUrl(src));
      } else {
        this.linkType = this.linkTypes['externalImage'];
        this.linkType.externalImage.set(src);
      }
    },

    guessAnchorLink: function(href) {
      if (this.options.prependToUrl &&
          href.indexOf(this.options.prependToUrl) !== -1) {
        // XXX if using default configuration, it gets more difficult
        // here to detect internal urls so this might need to change...
        this.linkType = this.linkTypes['internal'];
        this.linkType.internal.set(this.tinypattern.stripGeneratedUrl(href));
      } else if (href.indexOf('mailto:') !== -1) {
        this.linkType = this.linkTypes['email'];
        var email = href.substring('mailto:'.length, href.length);
        var split = email.split('?subject=');
        this.linkType.email.set(split[0]);
        if (split.length > 1) {
          this.$subject.val(decodeURIComponent(split[1]));
        }
      } else if (href[0] === '#') {
        this.linkType = this.linkTypes['anchor'];
        this.linkType.anchor.set(href.substring(1));
      } else {
        this.linkType = this.linkTypes['external'];
        this.linkType.external.set(href);
      }
    },

    setSelectElement: function($el, val) {
      $el.find('option:selected').prop('selected', false);
      if (val) {
        // update
        $el.find('option[value="' + val + '"]').prop('selected', true);
      }
    },

    reinitialize: function() {
      /*
       * This will probably be called before show is run.
       * It will overwrite the base html template given to
       * be able to privde default values for the overlay
       */
      this.modal.options.html = this.generateModalHtml();
    }
  });
  return LinkModal;

});
