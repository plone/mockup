// PhantomJS doesn't know about Object.assign
// See: https://stackoverflow.com/a/42923292/1337474
// and: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign !== "function") {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      // .length of function is 2
      "use strict";
      if (target === null || target === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index = index + 1) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}

var tests = Object.keys(window.__karma__.files).filter(function (file) {
  "use strict";

  var pattern,
    args = window.__karma__.config.args;
  if (args) {
    // workaround for cmd line arguments not parsed
    if (Object.prototype.toString.call(args) === "[object Array]") {
      args
        .join(" ")
        .replace(/--pattern[\s|=]+(\S+)?\s*/, function (match, value) {
          pattern = value;
        });
    }
    if (pattern) {
      return new RegExp(pattern + "-test.js$").test(file);
    }
  }

  return /\-test\.js$/.test(file);
});

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: "/base",

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start,
});

window.DEBUG = true;
