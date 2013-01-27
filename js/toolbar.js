if (window.jQuery) {
  define( "jquery", [], function () { return window.jQuery; } );
}
define([
  'jquery',
  'jam/Patterns/src/registry',
  'js/widgets',
  'js/plone.toolbar',
//  'js/plone.cmsui'
], function($, Patterns) {

  // Initial initialization of patterns
  $(document).ready(function() {
    Patterns.scan($('body'));
  });

});
