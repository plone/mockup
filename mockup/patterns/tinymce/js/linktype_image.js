define([
  'jquery',
  'mockup-tinymce-linktype-internal',
  'text!mockup-patterns-tinymce-url/templates/image.xml',
], function($, InternalLink, ImageTemplate) {
  'use strict';

  var ImageLink = InternalLink.extend({

    imagemode: true,

    toUrl: function() {
      var value = this.value();
      return this.tinypattern.generateImageUrl(value, this.linkModal.$scale.val());
    }

  });

  return {
    plugin: ImageLink,
    name: 'image',
    template: ImageTemplate
  };

});
