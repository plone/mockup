/* globals less:true, domready:true */

(function() {
  'use strict';

  domready(function() {

    var script1 = document.createElement('script');
    script1.setAttribute('type', 'text/javascript');
    script1.setAttribute('src', '/++resource++mockup/js/config.js');
    script1.onload = function() {
      requirejs.config({ baseUrl: ' ++resource++mockup/' });
      if (document.querySelectorAll('[data-iframe="plone-toolbar"]').length !== 0) {
        require(['mockup-bundles-widgets']);
      } else {
        require(['mockup-bundles-widgets', 'mockup-iframe_init']);
      }
    };
    document.getElementsByTagName('head')[0].appendChild(script1);

    var style1 = document.createElement('style');
    style1.setAttribute('type', 'text/less');
    style1.innerHTML = '@import (less) "/++resource++mockup/less/widgets.less"; @isBrowser: true; @pathPrefix: \'/++resource++mockup/less/\';';
    document.getElementsByTagName('head')[0].appendChild(style1);

    if (document.querySelectorAll('[data-iframe="plone-toolbar"]').length !== 0) {
      var style2 = document.createElement('style');
      style2.setAttribute('type', 'text/less');
      style2.innerHTML = '@import (less) "/++resource++mockup/less/iframe_init.less"; @isBrowser: true; @pathPrefix: \'/++resource++mockup/less/\';';
      document.getElementsByTagName('head')[0].appendChild(style2);
    }

    less.refresh();

  });

}());
