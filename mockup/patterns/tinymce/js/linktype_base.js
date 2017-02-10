define([
  'jquery',
  'pat-base',
  'text!mockup-patterns-tinymce-url/templates/link.xml',
], function($, Base, LinkTemplate) {
  'use strict';

  var BaseLinkType = Base.extend({

    name: 'base',
    template: LinkTemplate,
    imagemode: false,

    defaults: {
      linkModal: null // required
    },

    init: function() {
      this.linkModal = this.options.linkModal;
      this.tinypattern = this.options.tinypattern;
      this.tiny = this.tinypattern.tiny;
      this.dom = this.tiny.dom;
    },

    getEl: function(){
      return this.$el.find('input');
    },

    value: function() {
      return $.trim(this.getEl().val());
    },

    toUrl: function() {
      return this.value();
    },

    load: function(element) {
      this.getEl().attr('value', this.tiny.dom.getAttrib(element, 'data-val'));
    },

    set: function(val) {
      var $el = this.getEl();
      $el.attr('value', val);
      $el.val(val);
    },

    attributes: function() {
      return {
        'data-val': this.value()
      };
    }
  });

  return BaseLinkType;

});
