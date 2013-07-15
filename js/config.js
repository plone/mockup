requirejs.config({
    baseUrl: './',
    paths: {
      'jquery': 'bower_components/jquery/jquery',
      'jquery.form': 'bower_components/jquery-form/jquery.form',
      'jquery.cookie': 'bower_components/jquery.cookie/jquery.cookie',
      'underscore': 'bower_components/underscore/underscore',
      'backbone': 'bower_components/backbone/backbone',
      'select2': 'bower_components/select2/select2',
      'tinymce': 'lib/tinymce/tinymce.min',
      'chai': 'bower_components/chai/chai',
      'sinon': 'lib/sinon',
      'picker': 'bower_components/pickadate/lib/picker',
      'picker.date': 'bower_components/pickadate/lib/picker.date',
      'picker.time': 'bower_components/pickadate/lib/picker.time',
      'jquery.event.drag': 'lib/jquery.event.drag',
      'jquery.event.drop': 'lib/jquery.event.drop',
      'mockup-registry': 'js/registry',
      'mockup-iframe': 'js/iframe',
      'mockup-jquery.iframe': 'js/jquery.iframe',
      'mockup-patterns-accessibility': 'js/patterns/accessibility',
      'mockup-patterns-autotoc': 'js/patterns/autotoc',
      'mockup-patterns-backdrop': 'js/patterns/backdrop',
      'mockup-patterns-base': 'js/patterns/base',
      'mockup-patterns-cookiedirective': 'js/patterns/cookiedirective',
      'mockup-patterns-expose': 'js/patterns/expose',
      'mockup-patterns-formautofocus': 'js/patterns/formautofocus',
      'mockup-patterns-formunloadalert': 'js/patterns/formunloadalert',
      'mockup-patterns-livesearch': 'js/patterns/livesearch',
      'mockup-patterns-modal': 'js/patterns/modal',
      'mockup-patterns-pickadate': 'js/patterns/pickadate',
      'mockup-patterns-picture': 'js/patterns/picture',
      'mockup-patterns-preventdoublesubmit': 'js/patterns/preventdoublesubmit',
      'mockup-patterns-relateditems': 'js/patterns/relateditems',
      'mockup-patterns-queryhelper': 'js/patterns/queryhelper',
      'mockup-patterns-querystring': 'js/patterns/querystring',
      'mockup-patterns-select2': 'js/patterns/select2',
      'mockup-patterns-tablesorter': 'js/patterns/tablesorter',
      'mockup-patterns-tinymce': 'js/patterns/tinymce',
      'mockup-patterns-toggle': 'js/patterns/toggle',
      'mockup-patterns-tooltip': 'js/patterns/tooltip',
      'mockup-bundles-widgets': 'js/bundles/widgets',
      'mockup-bundles-toolbar': 'js/bundles/widgets',
      'mockup-bundles-tiles': 'js/bundles/widgets'
    },
    shim: {
      'underscore': { exports: 'window._' },
      'backbone': { exports: 'window.Backbone' },
      'picker.date': { deps: [ 'picker' ] },
      'picker.time': { deps: [ 'picker' ] },
      'sinon': { exports: 'window.sinon' },
      'sinon-fakexmlhttprequest': { exports: 'window.sinon',  deps: [ 'sinon' ] },
      'sinon-fakeserver': {
        exports: 'window.sinon.fakeServer',
        deps: [ 'sinon', 'sinon-fakexmlhttprequest' ]
      },
      'sinon-faketimers': {
        exports: 'window.sinon.useFakeTimers',
        deps: [ 'sinon', 'sinon-fakexmlhttprequest' ]
      },
      'tinymce': {
        exports: 'window.tinyMCE',
        init: function () {
          this.tinyMCE.DOM.events.domLoaded = true;
          return this.tinyMCE;
        }
      }
    }
});
