/* globals less:true, domready:true */

(function() {
  'use strict';

  domready(function() {

    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', '++resource++mockup/build/plone.min.css');
    document.getElementsByTagName('head')[0].appendChild(link);

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '++resource++mockup/js/config.js');
    script.onload = function() {
      requirejs.config({ baseUrl: '++resource++mockup/' });
      require(['mockup-bundles-widgets']);
    };
    document.getElementsByTagName('head')[0].appendChild(script);

  });

}());
