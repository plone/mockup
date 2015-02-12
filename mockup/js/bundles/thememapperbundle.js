
define([
  'jquery',
  'pat-registry',
  'mockup-patterns-base',
  'mockup-patterns-filemanager',
  'mockup-patterns-thememapper'
], function($, Registry, Base) {
  'use strict';

  var thememapperbundleBundle = Base.extend({
    name: 'mockup-bundles-thememapperbundle',
    init: function() {
      var self = this;
    }
  });

  // initialize only if we are in top frame
  if (window.parent === window) {
    $(document).ready(function() {
      $('body').addClass('pat-thememapperbundle-bundle');
      Registry.scan($('body'));
    });
  }

  return thememapperbundleBundle;
});
