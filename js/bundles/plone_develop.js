(function() {
  "use strict";

  domready(function() {

    var script1 = document.createElement('script');
    script1.setAttribute('type', 'text/javascript');
    script1.setAttribute('src', '/++resource++mockup/js/config.js');
    script1.onload = function() {
      requirejs.config({ baseUrl: '++resource++mockup/' });
      require(['mockup-bundles-plone', 'mockup-bundles-barceloneta']);
    };
    document.getElementsByTagName("head")[0].appendChild(script1);

    var style1 = document.createElement('style');
    style1.setAttribute('type', 'text/less');
    style1.innerHTML = '@import (less) "/++resource++mockup/less/plone.less"; @isBrowser: true; @pathPrefix: \'/++resource++mockup/less/\';';
    document.getElementsByTagName("head")[0].appendChild(style1);

    less.refresh();

  });

}());
