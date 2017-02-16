define([
  'jquery',
  'mockup-tinymce-linktype-base',
  'mockup-patterns-relateditems',
  'text!mockup-patterns-tinymce-url/templates/link.xml',
], function($, BaseLinkType, RelatedItems, LinkTemplate) {
  'use strict';

  var InternalLink = BaseLinkType.extend({

    init: function() {
      BaseLinkType.prototype.init.call(this);
      this.getEl().addClass('pat-relateditems');
      this.createRelatedItems();
    },

    getEl: function(){
      return this.$el.find('input:not(.select2-input)');
    },

    createRelatedItems: function() {
      var options = this.tinypattern.options.relatedItems;
      options.upload = false;  // ensure that related items upload is off.
      this.relatedItems = new RelatedItems(this.getEl(), options);
    },

    value: function() {
      var val = this.getEl().select2('data');
      if (val && typeof(val) === 'object') {
        val = val[0];
      }
      return val;
    },

    toUrl: function() {
      var value = this.value();
      if (value) {
        return this.tinypattern.generateUrl(value);
      }
      return null;
    },
    load: function(element) {
      var val = this.tiny.dom.getAttrib(element, 'data-val');
      if (val) {
        this.set(val);
      }
    },

    set: function(val) {
      var $el = this.getEl();
      // kill it and then reinitialize since select2 will load data then
      $el.select2('destroy');
      $el.removeData('pattern-relateditems'); // reset the pattern
      $el.parent().replaceWith($el);
      $el.attr('value', val);
      $el.val(val);
      this.createRelatedItems();
    },

    attributes: function() {
      var val = this.value();
      if (val) {
        return {
          'data-val': val.UID
        };
      }
      return {};
    }

  });

  return {
    plugin: InternalLink,
    name: 'internal',
    template: LinkTemplate
  };

});
