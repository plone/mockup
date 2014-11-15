/* LiveSearch pattern.
 *
 * Options:
 *    url_transform(object): Remove and add stuff from the action url ({remove: '@@search$', add: 'livesearch_reply'})
 *    additional_parameters(object): Pass additional parameters to the query view, e.g.: {json: true} ({})
 *    search_delay(string): Delay in milliseconds until the search starts after the last key was pressed. This keeps the number of requests to the server low. (400)
 *    hide_delay(string): Delay in milliseconds until the results window closes after the searchbox looses focus. (400)
 *    highlight_class(string): The class used to highlight the results. ('livesearch-highlight')
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-livesearch-left }}
 *
 *    {{ example-livesearch-right }}
 *
 * Example: example-livesearch-left
 *    <form action="/@@search">
 *      <label for="text">Left aligned search input</label>
 *      <input type="text" class="pat-livesearch" name="text" value="" />
 *    </form>
 *
 * Example: example-livesearch-right
 *    <div style="float:right">
 *      <form action="/@@search">
 *        <label for="text">Right aligned search input</label>
 *        <input type="text" class="pat-livesearch" name="text" value="" />
 *      </form>
 *    </div>
 *    <div style="clear:both"></div>
 *
 */

define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  'use strict';
  var LiveSearch = Base.extend({
    name: 'livesearch',
    defaults: {
      url_transform: {
        add: 'livesearch_reply',
        remove: '@@search$',
      },
      additional_parameters: {},
      search_delay: 400,
      hide_delay: 400,
      highlight_class: "livesearch-highlight"
    },
    init: function() {
      var self = this;
      self.$el.after($('<div class="livesearch-results"><div class="livesearch-shadow"></div></div>'));
      self.$form = self.$el.parents('form:first');
      self.$result = self.$form.find('.livesearch-results');
      self.$shadow = self.$form.find('.livesearch-shadow');
      self.$path = self.$form.find('input[name="path"]');
      self.lastsearch = null;
      self.request = null;
      self.cache = {};
      self.url_regexp = new RegExp(self.options.url_transform.remove, 'g');
      self.querytarget = self.$form.attr('action').replace(self.url_regexp, self.options.url_transform.add);

      function _hide() {
        // hides the result window
        self.$result.hide();
        self.lastsearch = null;
      }

      function _hide_delayed() {
        // hides the result window after a short delay
        window.setTimeout(
          function() {
            _hide();
          },
          self.options.hide_delay
        );
      }

      function _show($data) {
        // shows the result
        self.$result.show();
        self.$shadow.html($data);
      }

      function _search() {
        // does the actual search
        if (self.lastsearch === self.$el.prop('value')) {
          // do nothing if the input didn't change
          return;
        }
        self.lastsearch = self.$el.prop('value');

        if (self.regexp && self.regexp.readyState < 4) {
          // abort any pending request
          self.regexp.abort();
        }

        // Do nothing as long as we have less then two characters -
        // the search results makes no sense, and it's harder on the server.
        if (typeof self.$el.prop('value') === "undefined" || self.$el.prop('value').length < 2) {
          _hide();
          return;
        }

        var $$query = self.options.additional_parameters;
        $$query.q = self.$el.prop('value');
        if (self.$path.length && self.$path[0].checked) {
          $$query.path = self.$path.val();
        }
        // turn into a string for use as a cache key
        $$query = $.param($$query);

        // check cache
        if (self.cache[$$query]) {
          _show(self.cache[$$query]);
          return;
        }
        // the search request (retrieve as text, not a document)
        self.regexp = $.get(self.querytarget, $$query, function($data) {
          // show results if there are any and cache them
          _show($data);
          self.cache[$$query] = $data;
        }, 'text');
      }

      function _search_delayed() {
        // search after a small delay, used by onfocus
        window.setTimeout(
          function() {
            _search();
          },
          self.options.search_delay);
      }

      function _keyhandlerfactory(self) {
        // returns the key event handler functions in a dictionary.
        // we need a factory to get a local scope for the event, this is
        // necessary, because IE doesn't have a way to get the target of
        // an event in a way we need it.
        var $timeout = null;

        function _keyUp() {
          // select the previous element
          var $cur = self.$shadow.find('.'+self.options.highlight_class).removeClass(self.options.highlight_class),
            $prev = $cur.prev('li');

          if (!$prev.length) {
            $prev = self.$shadow.find('li:last');
          }
          $prev.addClass(self.options.highlight_class);
          return false;
        }

        function _keyDown() {
          // select the next element
          var $cur = self.$shadow.find('.'+self.options.highlight_class).removeClass(self.options.highlight_class),
            $next = $cur.next('li');

          if (!$next.length) {
            $next = self.$shadow.find('li:first');
          }
          $next.addClass(self.options.highlight_class);
          return false;
        }

        function _keyEscape() {
          // hide results window
          self.$shadow.find('.'+self.options.highlight_class).removeClass(self.options.highlight_class);
          self.$result.hide();
        }

        function _handler($event) {
          // dispatch to specific functions and handle the search timer
          window.clearTimeout($timeout);
          switch ($event.keyCode) {
            case 38:
              return _keyUp();
            case 40:
              return _keyDown();
            case 27:
              return _keyEscape();
            case 37:
              break; // keyLeft
            case 39:
              break; // keyRight
            default:
              $timeout = window.setTimeout(
                function() {
                  _search();
                },
                self.options.search_delay);
          }
        }

        function _submit() {
          // check whether a search result was selected with the keyboard
          // and open it
          var $target = self.$shadow.find('.' + self.options.highlight_class + ' a').attr('href');
          if (!$target) {
            return;
          }
          window.location = $target;
          return false;
        }

        return {
          handler: _handler,
          submit: _submit
        };
      }

      function _setup(self) {
        // add an id which is used by other functions to find the correct node
        var $key_handler = _keyhandlerfactory(self);
        self.$form.submit($key_handler.submit);
        self.$el.attr('autocomplete', 'off')
          .keydown($key_handler.handler)
          .focus(_search_delayed)
          .blur(_hide_delayed);
      }
      _setup(self);
    }
  });
  return LiveSearch;
});
