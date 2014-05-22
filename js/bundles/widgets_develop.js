/* globals less:true, domready:true */

(function() {
  'use strict';

  // https://github.com/QueueHammer/codecraftsman.js/blob/master/codecraftsman.js#L23
  var ScriptPath = function() {
    var scriptPath = '', pathParts;
    try {
      throw new Error();
    } catch (e) {
      var stackLines = e.stack.split('\n');
      var callerIndex = 0;
      for (var i in stackLines){
        if (!stackLines[i].match(/http[s]?:\/\//)) {
          continue;
        }
        callerIndex = Number(i) + 2;
        break;
      }
      pathParts = stackLines[callerIndex].match(/((http[s]?:\/\/.+\/)([^\/]+\.js)):/);
    }

    this.fullPath = function() {
      return pathParts[1];
    };

    this.path = function() {
      return pathParts[2];
    };

    this.file = function() {
      return pathParts[3];
    };

    this.fileNoExt = function() {
      var parts = this.file().split('.');
      parts.length = parts.length !== 1 ? parts.length - 1 : 1;
      return parts.join('.');
    };
  };

  window.getScriptPath = function () {
    return new ScriptPath();
  };


  domready(function() {

    var link = document.createElement('link'),
        basePath = window.getScriptPath().path();
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', basePath + '++resource++mockup/build/widgets.min.css');
    document.getElementsByTagName('head')[0].appendChild(link);

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', basePath + '++resource++mockup/js/config.js');
    script.onload = function() {
      requirejs.config({ baseUrl: basePath + '++resource++mockup/' });
      require(['mockup-bundles-widgets']);
    };
    document.getElementsByTagName('head')[0].appendChild(script);

  });

}());
