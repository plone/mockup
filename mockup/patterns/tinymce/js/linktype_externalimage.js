define([
  'jquery',
  'mockup-tinymce-linktype-external',
  'text!mockup-patterns-tinymce-url/templates/image.xml',
], function($, ExternalLink, ImageTemplate) {
  'use strict';

  var ExternalImage = ExternalLink.extend({

    name: 'externalImage',
    template: ImageTemplate

  });

  return ExternalImage;

});

