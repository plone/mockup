define([
  'jquery',
  'mockup-tinymce-linktype-base',
  'text!mockup-patterns-tinymce-url/templates/link.xml',
], function($, BaseLinkType, LinkTemplate) {
  'use strict';

  var ExternalLink = BaseLinkType.extend({

    init: function() {
      BaseLinkType.prototype.init.call(this);
      this.getEl().on('change', function(){
        // check here if we should automatically add in http:// to url
        var val = $(this).val();
        if((new RegExp('https?\:\/\/')).test(val)){
          // already valid url
          return;
        }
        var domain = $(this).val().split('/')[0];
        if(domain.indexOf('.') !== -1){
          $(this).val('http://' + val);
        }
      });
    }

  });

  return {
    plugin: ExternalLink,
    name: 'external',
    template: LinkTemplate
  };

});
