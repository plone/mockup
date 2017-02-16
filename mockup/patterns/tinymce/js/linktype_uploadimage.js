define([
  'jquery',
  'mockup-tinymce-linktype-upload',
  'text!mockup-patterns-tinymce-url/templates/image.xml',
], function($, UploadLink, ImageTemplate) {
  'use strict';

  var UploadImage = UploadLink.extend({

    imagemode: true,
    
    getDelegatedLinkType: function(){
      return this.linkModal.linkTypes.image;
    }

  });

  return {
    plugin: UploadImage,
    name: 'uploadImage',
    template: ImageTemplate
  };

});
