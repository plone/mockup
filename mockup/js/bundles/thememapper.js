
define([
  'jquery',
  'pat-registry',
  'mockup-patterns-base',
  'mockup-patterns-filemanager',
  'mockup-patterns-thememapper'
], function($, Registry) {
  'use strict';

  // initialize only if we are in top frame
  if (!Registry.initialized) {
    Registry.init();
  }

});
