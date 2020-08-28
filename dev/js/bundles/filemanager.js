define([
  'pat-registry',
  'mockup-patterns-filemanager',
  'jqtree-contextmenu'
], function(registry) {
  'use strict';
  // initialize only if we are in top frame
  if (window.parent === window) {
    if (!registry.initialized) {
      registry.init();
    }
  }
});
