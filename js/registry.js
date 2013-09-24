define([
  "jquery"
], function($, undefined) {

  function warn(msg) {
    if (window.DEBUG) {
      console.warn(msg);
    }
  }

  var registry = {

    patterns: {},

    init: function($el, patternName, options) {
      $el.data('pattern-' + patternName,
          new registry.patterns[patternName]($el, options));
    },

    scan: function(content, do_not_catch_init_exception) {
      var $content = $(content),
          patterns = [];

      patterns.push($content.filter('[class^="pat-"]'));
      patterns.push($('[class^="pat-"]', $content));

      $.each(patterns, function(i, $el) {
        $.each($el.attr('class').split(' '), function(j, className) {
          if (className.indexOf('pat-')) {
            try {
              registry.init($el, className.substr(4));
            } catch (e) {
              warn('Failed while initializing "' + className.substr(4) +
                '" on element: ' + $el);
              // TODO: provide some nicer traceback what went wrong
            }
          }
        });
      });

    },

    register: function(Pattern) {

      // automatically create jquery plugin from pattern
      if (Pattern.prototype.jqueryPlugin === undefined) {
        Pattern.prototype.jqueryPlugin = "pattern" +
            Pattern.prototype.name.charAt(0).toUpperCase() +
            Pattern.prototype.name.slice(1);
      }

      if (Pattern.prototype.jqueryPlugin) {
        $.fn[Pattern.prototype.jqueryPlugin] = function(method, options) {
          $(this).each(function() {
            var $el = $(this),
                pattern = $el.data('pattern-' + Pattern.prototype.name);
            if (typeof method === "object") {
              options = method;
              method = undefined;
            }
            if (!pattern || typeof(pattern) === 'string') {
              registry.init($el, options);
            } else if (method && pattern && pattern[method]) {
              if (method.charAt(0) !== '_') {
                pattern[method].apply(pattern, [options]);
              } else {
                console.warn('Method "' + method + '" is private.');
              }
            }

          });
          return this;
        };
      }

      if (!Pattern.prototype.name) {
        if (window.DEBUG) {
        }
        return false;
      }

            if (registry.patterns[pattern.name]) {
                return false;
            }

            // register pattern to be used for scanning new content
            registry.patterns[pattern.name] = pattern;

            return true;
        }
    };

    return registry;
});
