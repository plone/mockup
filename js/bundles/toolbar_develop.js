(function($) {
  "use strict";

/*!
 * domready (c) Dustin Diaz 2012 - License MIT
 * https://github.com/ded/domready
 *
 * Modified just a bit by Rok Garbas 2013
 */
var domready = function (ready) {
  /*jshint laxcomma:true, boss:true, scripturl:true, expr:true */

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
    , loaded = loadedRgx.test(doc[readyState]);

  function flush(f) {
    loaded = 1;
    while (f = fns.shift()) f();
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f);
    flush();
  }, f);


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn);
      flush();
    }
  });

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left');
          } catch (e) {
            return setTimeout(function() { ready(fn); }, 50);
          }
          fn();
        }();
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn);
    });
}();

  domready(function() {

    var script2 = document.createElement('script');
    script2.setAttribute('type', 'text/javascript');
    script2.setAttribute('src', '/++resource++mockup/js/config.js');
    script2.onload = function() {
      requirejs.config({ baseUrl: '++resource++mockup/' });
      require(['mockup-bundles-toolbar']);
    };

    var script1 = document.createElement('script');
    script1.setAttribute('type', 'text/javascript');
    script1.setAttribute('src', '/++resource++mockup/bower_components/requirejs/require.js');
    script1.onload = function() {
      document.getElementsByTagName("head")[0].appendChild(script2);
    };
    document.getElementsByTagName("head")[0].appendChild(script1);

    var style1 = document.createElement('style');
    style1.setAttribute('type', 'text/less');
    style1.innerHTML = '@import (less) "/++resource++mockup/less/toolbar.less"; @isBrowser: true; @pathPrefix: \'/++resource++mockup/less/\';';
    document.getElementsByTagName("head")[0].appendChild(style1);

    var script3 = document.createElement('script');
    script3.setAttribute('type', 'text/javascript');
    script3.setAttribute('src', '/++resource++mockup/node_modules/grunt-contrib-less/node_modules/less/dist/less-1.4.1.js');
    document.getElementsByTagName("head")[0].appendChild(script3);

  });

}(jQuery));
