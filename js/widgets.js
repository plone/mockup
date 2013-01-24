if (window.jQuery) {
  define( "jquery", [], function () { return window.jQuery; } );
}
define([
  'jquery',
  'jam/Patterns/src/registry',
  'js/pattern.select2',
  'js/pattern.datetime'
//  'js/pattern.tabs',
//  'js/plone.tabs'
], function($, registry, Select2, DateTime) {

  registry.register(registry.wrap(Select2));
  registry.register(registry.wrap(DateTime));

  // Initial initialization of patterns
  $(document).ready(function() {
    registry.scan(document);
  });

});
