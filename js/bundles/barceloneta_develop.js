/* globals less:true, domready:true */

(function() {
  'use strict';

  domready(function() {

    var link = document.createElement('link'),
        basePath = window.getScriptPath().path();
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', basePath + '++resource++mockup/build/barceloneta.min.css');
    document.getElementsByTagName('head')[0].appendChild(link);

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', basePath + '++resource++mockup/js/config.js');
    script.onload = function() {
      requirejs.config({ baseUrl: basePath + '++resource++mockup/' });
      require(['mockup-bundles-barceloneta']);
    };
    document.getElementsByTagName('head')[0].appendChild(script);

  });

}());
