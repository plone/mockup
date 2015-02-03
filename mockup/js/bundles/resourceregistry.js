define([
  'jquery',
  'pat-registry',
  'mockup-patterns-resourceregistry',
], function($, Registry) {
  'use strict';

  $(document).ready(function() {
    var $registry = $('.pat-resourceregistry');
    Registry.scan($registry);
  });

});
