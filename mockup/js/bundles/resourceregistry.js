define([
  'pat-registry',
  'mockup-patterns-resourceregistry',
], function(registry) {
  'use strict';
  if (!registry.initialized) {
    registry.init();
  }
});
