define([
  'jquery',
  'mockup-tinymce-linktype-base',
  'text!mockup-patterns-tinymce-url/templates/link.xml',
], function($, BaseLinkType, LinkTemplate) {
  'use strict';

  var UploadLink = BaseLinkType.extend({

    /* need to do it a bit differently here.
       when a user uploads and tries to upload from
       it, you need to delegate to the real insert
       linke types */
    getDelegatedLinkType: function(){
      return this.linkModal.linkTypes.internal;
    },

    toUrl: function(){
      return this.getDelegatedLinkType().toUrl();
    },

    attributes: function(){
      return this.getDelegatedLinkType().attributes();
    },

    set: function(val){
      return this.getDelegatedLinkType().set(val);
    },

    load: function(element){
      return this.getDelegatedLinkType().load(element);
    },

    value: function(){
      return this.getDelegatedLinkType().value();
    }

  });

  return {
    plugin: UploadLink,
    name: 'upload',
    template: LinkTemplate
  };

});
