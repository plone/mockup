/*
 * changes to previous patterns.register/scan mechanism
 * - if you want initialised class, do it in init
 * - init returns set of elements actually initialised
 * - handle once within init
 * - no turnstile anymore
 * - set pattern.jquery_plugin if you want it
 */
define([
  'jquery'
], function($) {
  //var log = logger.getLogger('registry');

  function getPatternName($el) {
    var pattern_name;
    $.each($el.attr('class').split(/\s+/), function(i, classname) {
      if (classname.substring(0, 4) === 'pat-') {
        pattern_name = classname.substring(4);
        return;
      }
    });
    return pattern_name;
  }
  function initPattern($el, Pattern) {
    var pattern = new Pattern($el);
    $el.data('pattern-' + pattern.name, pattern);
    return pattern;
  }

  var Registry = {
    patterns: {},
    transforms: [],
    scan: function(content) {
      var self = this,
          $content = $(content);

      // add transform stuff
      $.each(Registry.transforms, function(i, transform) {
        transform($content);
      });
      
      // get pattern_name from class attribute
      $('[class|="pat"]', $content).each(function() {
        var $el = $(this),
            pattern_name = getPatternName($el),
            pattern = $el.data('pattern-' + pattern_name);

        // check if patterns is already initialized
        if (!pattern) {
          // load pattern
          Pattern = Registry.patterns[pattern_name];
          if (!Pattern) {
            require('pattern-' + pattern_name, function(Pattern) {
              initPattern($el, Pattern);
            });
          }
          // initialize pattern
          initPattern($el, Pattern);
        }
      });
    },
    registerTransform: function(transform) {
      Registry.transforms.append(transform);
    },
    register: function(Pattern) {
      if (!Pattern.prototype.name) {
        //log.error("Pattern lacks name:", pattern);
        return false;
      }
      if (Registry.patterns[Pattern.prototype.name]) {
        //log.error("Already have a pattern called: " + pattern.name);
        return false;
      }

      // register pattern to be used for scanning new content
      Registry.patterns[Pattern.prototype.name] = Pattern;

      // register pattern as jquery plugin
      if (Pattern.prototype.jqueryPlugin) {
        $.fn[Pattern.prototype.jqueryPlugin] = function(method) {
          var $el = $(this),
              pattern = $el.data('pattern-' + Pattern.prototype.name);

          if (!pattern) {
            pattern = initPattern($el, Pattern);
          }

          if (method && typeof method === "string" &&
              $.inArray(method, ['init', 'name', 'jqueryPlugin']) === -1 &&
              pattern[method]) {
            pattern[method](Array.prototype.slice.call(arguments, 1));
          }
            //$.error('Method ' + method + ' does not exist on jQuery.' + pattern.name);
          return this;
        };
      }

      //log.debug('Registered pattern:', pattern.name, pattern);
      return true;
    }
  };

  $(document).on('patterns-injected.patterns', function(ev) {
    Registry.scan(ev.target);
    $(ev.target).trigger('patterns-injected-scanned');
  });

  return Registry;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
