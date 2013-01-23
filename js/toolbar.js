if (jQuery) {
  define( "jquery", [], function () { return jQuery; } );
}
define([
  'jquery',
  'js/patterns',
  'js/widgets',
  'js/plone.toolbar',
  'js/plone.cmsui'
], function($, Patterns) {

  // Initial initialization of patterns
  $(document).ready(function() {
    Patterns.initialize($(document));
  });

});
