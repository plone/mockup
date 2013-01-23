if (jQuery) {
  define( "jquery", [], function () { return jQuery; } );
}
define([
  'jquery',
  'js/patterns',
  'js/pattern.autocomplete',
  'js/pattern.calendar',
  'js/pattern.tabs',
  'js/pattern.toggle',
  'js/plone.tabs'
], function($, Patterns) {

  // Initial initialization of patterns
  $(document).ready(function() {
    Patterns.initialize($(document));
  });

});
