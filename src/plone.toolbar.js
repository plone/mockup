define([
    'jquery',
    'jquery-iframe',
    'pattern-classtoggle'
], function($, $iframe, ClassToggle) {

  $(ClassToggle.trigger).on('patterns.classtoggle.open', function(e) {
    var $el = $(this);
        className = $el.attr('data-classtoggle');
    $('.toolbar-dropdown-open > a').each(function() {
      if ($el[0] !== this) {
        $(this).classToggle('close');
      }
    });
    $iframe.stretch();
  });
  $(ClassToggle.trigger).on('patterns.classtoggle.close', function(e) {
    $iframe.shrink();
  });

  // shrink iframe when click happens on toolbar and no dropdown is open at
  // that time
  $.iframe.registerAction(
      function(e) {
        return $('.toolbar-dropdown-open', e.target).size() !== 0;
      },
      function(e) {
        $('.toolbar-dropdown-open > a').each(function() {
          $(this).classToggle('close');
        });
        $.iframe.shrink();
      });

});
