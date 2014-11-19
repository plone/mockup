define([
  'jquery',
  'mockup-registry',
  'mockup-patterns-base',
  'mockup-patterns-select2',
  'mockup-patterns-passwordstrength',
  'mockup-patterns-pickadate',
  'mockup-patterns-relateditems',
  'mockup-patterns-querystring',
  'mockup-patterns-fileupload',
  'mockup-patterns-tinymce'
], function($, Registry, Base) {
  'use strict';

  var PloneWidgets = Base.extend({
    name: 'plone-widgets',
    init: function() {
      var self = this;
    }
  });

  // initialize only if we are in top frame
  if (window.parent === window) {
    $(document).ready(function() {
      $('body').addClass('pat-plone-widgets');
      Registry.scan($('body'));
    });
  }

  return PloneWidgets;
});
