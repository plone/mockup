requirejs.config({
    baseUrl: './',
    paths: {
      'jquery': 'bower_components/jquery/jquery',
      'jquery.form': 'bower_components/jquery-form/jquery.form',
      'jquery.cookie': 'bower_components/jquery.cookie/jquery.cookie',
      'underscore': 'bower_components/underscore/underscore',
      'backbone': 'bower_components/backbone/backbone',
      'select2': 'bower_components/select2/select2',
      'tinymce': 'lib/tinymce/tinymce',
      'chai': 'bower_components/chai/chai',
      'sinon': 'bower_components/sinon/lib/sinon',
      'sinon-fakexmlhttprequest': 'bower_components/sinon/lib/sinon/util/fake_xml_http_request',
      'sinon-fakeserver': 'bower_components/sinon/lib/sinon/util/fake_server',
      'picker': 'bower_components/pickadate/lib/picker',
      'picker.date': 'bower_components/pickadate/lib/picker.date',
      'picker.time': 'bower_components/pickadate/lib/picker.time',
      'jquery.event.drag': 'lib/jquery.event.drag',
      'jquery.event.drop': 'lib/jquery.event.drop',
      'mockup-registry': 'js/registry'
    },
    shim: {
      'underscore': { exports: 'window._' },
      'backbone': { exports: 'window.Backbone' },
      'picker.date': { deps: [ 'picker' ] },
      'picker.time': { deps: [ 'picker' ] },
      'sinon': { exports: 'window.sinon' },
      'sinon-fakexmlhttprequest': { exports: 'window.sinon',  deps: [ 'sinon' ] },
      'sinon-fakeserver': { exports: 'window.sinon',  deps: [ 'sinon', 'sinon-fakexmlhttprequest' ] },
      'tinymce': {
        exports: 'window.tinyMCE',
        init: function () {
          this.tinyMCE.DOM.events.domLoaded = true;
          return this.tinyMCE;
        }
      }
    }
});
