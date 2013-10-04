(function() {

var requirejsOptions = {
  baseUrl: './',
  wrap: true,
  paths: {
    'text': "bower_components/requirejs-text/text",
    'jquery': 'bower_components/jquery/jquery',
    'jquery.form': 'bower_components/jquery-form/jquery.form',
    'jquery.cookie': 'bower_components/jquery.cookie/jquery.cookie',
    'underscore': 'bower_components/underscore/underscore',
    'backbone': 'bower_components/backbone/backbone',
    'backbone-paginator': 'bower_components/backbone.paginator/lib/backbone.paginator',
    'bootstrap-dropdown': 'bower_components/bootstrap/js/bootstrap-dropdown',
    'bootstrap-tooltip': 'bower_components/bootstrap/js/bootstrap-tooltip',
    'select2': 'bower_components/select2/select2',
    'tinymce': 'lib/tinymce/tinymce.min',
    'chai': 'bower_components/chai/chai',
    'sinon': 'lib/sinon',
    'picker': 'bower_components/pickadate/lib/picker',
    'picker.date': 'bower_components/pickadate/lib/picker.date',
    'picker.time': 'bower_components/pickadate/lib/picker.time',
    'moment': 'bower_components/moment/moment',
    'ace': "bower_components/ace/lib/ace",
    'jqtree': "bower_components/jqtree/tree.jquery",
    'jquery.event.drag': 'lib/jquery.event.drag',
    'jquery.event.drop': 'lib/jquery.event.drop',
    'dropzone': "lib/dropzone/downloads/dropzone-amd-module",
    'mockup-docsapp': 'js/docsapp',
    'mockup-fakeserver': 'tests/fakeserver',
    'mockup-registry': 'js/registry',
    'mockup-router': 'js/router',
    'mockup-utils': 'js/utils',
    'mockup-iframe': 'js/iframe',
    'mockup-iframe_init': 'js/iframe_init',
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
    'mockup-patterns-tinymce': 'js/patterns/tinymce/pattern',
    'mockup-patterns-toggle': 'js/patterns/toggle',
    'mockup-patterns-tooltip': 'js/patterns/tooltip',
    'mockup-patterns-dropzone': 'js/patterns/dropzone',
    'mockup-bundles-widgets': 'js/bundles/widgets',
    'mockup-bundles-toolbar': 'js/bundles/toolbar',
    'mockup-bundles-tiles': 'js/bundles/widgets',
    'mockup-patterns-structure': 'js/patterns/structure/pattern',
    'mockup-patterns-dragdrop': 'js/patterns/dragdrop',
    'mockup-patterns-moment': 'js/patterns/moment',
    'mockup-patterns-ace': 'js/patterns/ace',
    'mockup-patterns-filemanager': 'js/patterns/filemanager/pattern',
    'mockup-patterns-tree': 'js/patterns/tree',
  },
  shim: {
    'underscore': { exports: 'window._' },
    'backbone': {
      exports: 'window.Backbone',
      deps: ['underscore', 'jquery']
    },
    'picker.date': { deps: [ 'picker' ] },
    'picker.time': { deps: [ 'picker' ] },
    'jquery.event.drag': { deps: ['jquery'] },
    'jquery.event.drop': { deps: ['jquery'] },
    'jquery.cookie': { deps: ['jquery'] },
    'bootstrap-dropdown': { deps: ['jquery'] },
    'bootstrap-tooltip': { deps: ['jquery'] },
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
};

if (typeof exports !== "undefined" && typeof module !== "undefined") {
  module.exports = requirejsOptions;
}
if (typeof requirejs !== "undefined" && requirejs.config) {
  requirejs.config(requirejsOptions);
}

}());
