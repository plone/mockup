if (window.jQuery) {
  define( "jquery", [], function () { return window.jQuery; } );
}
define([
  'jquery',
  'jam/Patterns/src/registry',
  'js/pattern.select2',
  'js/pattern.datetime',
  'js/pattern.autotoc',
  'js/pattern.expose',
  'js/pattern.modal'
], function($, registry) {

  // Initial initialization of patterns
  $(document).ready(function() {
    registry.scan($('body'));
  });


  // 
  $(document).on("patterns-registry-before-scan.patterns", function(e) {
    var $el = $(e.target);

    // enableFormTabbing
    $match = $el.filter('.enableFormTabbing');
    $match = $match.add($el.find('.enableFormTabbing'));
    $match.addClass('pat-autotoc');

  });

});
