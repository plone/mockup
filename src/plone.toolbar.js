define([
    'jquery',
    'jquery-iframe',
    'pattern-classtoggle'
], function($, $iframe) {

  $('.toolbar-dropdown > a.pat-classtoggle').on('patterns.classtoggle.add', function(e) {
    var el = this;
    $('.toolbar-dropdown-open > a').each(function() {
      if (el !== this) {
        $(this).classToggle('remove');
      }
    });
    $iframe.stretch();
  });
  $('.toolbar-dropdown > a.pat-classtoggle').on('patterns.classtoggle.remove', function(e) {
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
          $(this).classToggle('remove');
        });
        $.iframe.shrink();
      });

});
