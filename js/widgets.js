if (window.jQuery) {
  define( "jquery", [], function () { return window.jQuery; } );
}
define([
  'jquery',
  'jam/Patterns/src/registry',
  'js/pattern.select2',
  'js/pattern.datetime',
  'js/pattern.autotoc'
], function($, registry, Select2, DateTime) {

  // Initial initialization of patterns
  $(document).ready(function() {
    registry.scan(document);
  });

  $(document).on("patterns-registry-before-scan.patterns", function(e) {
    var $el = $(e.target);

    // enableFormTabbing
    $match = $el.filter('.enableFormTabbing');
    $match = $match.add($el.find('.enableFormTabbing'));
    $match.addClass('pat-autotoc');

  });

});
