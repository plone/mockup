
define([
    'jquery',
    'patterns'
], function($, patterns) {

    Pattern = {
      name: 'classtoggle',
      jqueryPlugin: 'classToggle',
      trigger: '[data-classtoggle]',
      init: function($all) {
        return $all.each(function() {
          var $el = $(this),
              className = $el.attr('data-classtoggle'),
              eventName = $el.attr('data-classtoggle-event') || 'click',
              $target = $el.closest($el.attr('data-classtoggle-target')) || $el;

          $el.off(eventName).on(eventName, function(e) {
            $el.classToggle('toggle');
            e.stopPropagation();
            e.preventDefault();
          });

        });
      },
      toggle: function() {
        return $(this).each(function() {
          var $el = $(this),
              className = $el.attr('data-classtoggle'),
              $target = $el.closest($el.attr('data-classtoggle-target')) || $el;
          if ($target.hasClass(className)) {
            $el.classToggle('close');
          } else {
            $el.classToggle('open');
          }
        });
      },
      close: function() {
        return $(this).each(function() {
          var $el = $(this),
              className = $el.attr('data-classtoggle'),
              $target = $el.closest($el.attr('data-classtoggle-target')) || $el;
          $target.removeClass(className);
          $el.trigger('patterns.classtoggle.close');
        });
      },
      open: function() {
        return $(this).each(function() {
          var $el = $(this),
              className = $el.attr('data-classtoggle'),
              $target = $el.closest($el.attr('data-classtoggle-target')) || $el;
          $target.addClass(className);
          $el.trigger('patterns.classtoggle.open');
        });
      }
    };

    patterns.register(Pattern);

    return Pattern;

});
