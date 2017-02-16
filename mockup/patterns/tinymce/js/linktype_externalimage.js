define([
  'mockup-tinymce-linktype-external',
  'text!mockup-patterns-tinymce-url/templates/image.xml',
], function(ExternalLink, ImageTemplate) {
  'use strict';

  return {
    plugin: ExternalLink,
    name: 'externalImage',
    template: ImageTemplate
  };

});

