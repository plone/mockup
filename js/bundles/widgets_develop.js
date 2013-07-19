(function($) {
  "use strict";

  $(document).ready(function() {

    var script2 = document.createElement('script');
    script2.setAttribute('type', 'text/javascript');
    script2.setAttribute('src', '/++resource++mockup/js/config.js');
    script2.onload = function() {
      requirejs.config({ baseUrl: '++resource++mockup/' });
      if ($('[data-iframe="plone-toolbar"]').size() === 0) {
        require(['mockup-bundles-widgets']);
      } else {
        require(['mockup-bundles-widgets', 'mockup-iframe_init']);
      }
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
    style1.innerHTML = '@import (less) "/++resource++mockup/less/widgets.less"; @isBrowser: true; @pathPrefix: \'/++resource++mockup/less/\';';
    document.getElementsByTagName("head")[0].appendChild(style1);

    if ($('[data-iframe="plone-toolbar"]').size() !== 0) {
      var style2 = document.createElement('style');
      style2.setAttribute('type', 'text/less');
      style2.innerHTML = '@import (less) "/++resource++mockup/less/iframe_init.less"; @isBrowser: true; @pathPrefix: \'/++resource++mockup/less/\';';
      document.getElementsByTagName("head")[0].appendChild(style2);
    }

    var script3 = document.createElement('script');
    script3.setAttribute('type', 'text/javascript');
    script3.setAttribute('src', '/++resource++mockup/node_modules/grunt-contrib-less/node_modules/less/dist/less-1.4.1.js');
    document.getElementsByTagName("head")[0].appendChild(script3);

  });

}(jQuery));
