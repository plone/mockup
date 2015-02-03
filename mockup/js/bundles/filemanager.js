define([
  'jquery',
  'pat-registry',
  'mockup-patterns-base',
  'mockup-patterns-filemanager'
], function($, Registry, Base) {
  'use strict';

  // initialize only if we are in top frame
  if (window.parent === window) {
    $(document).ready(function() {
      Registry.scan($('body'));
    });
  }
});
