if (window.jQuery) {
  define( "jquery", [], function () { return window.jQuery; } );
}
define([
  'jquery',
  'jam/Patterns/src/registry',
  'js/pattern.select2'
//  'js/pattern.pickadate',
//  'js/pattern.tabs',
//  'js/plone.tabs'
], function($, registry, Select2) {

  // Initial initialization of patterns
  $(document).ready(function() {
    registry.scan(document);
  });

  registry.register(registry.wrap(Select2));

});
