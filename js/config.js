/* globals module:true */

(function() {
  'use strict';

  var requirejsOptions = {
    baseUrl: './',
    optimize: 'uglify',
    paths: {
      'JSXTransformer': 'bower_components/react/JSXTransformer',
      'ace': 'bower_components/ace-builds/src/ace',
      'ace-theme-monokai': 'bower_components/ace-builds/src/theme-monokai',
      'ace-mode-text': 'bower_components/ace-builds/src/mode-text',
      'backbone': 'bower_components/backbone/backbone',
      'backbone.paginator': 'bower_components/backbone.paginator/lib/backbone.paginator',
      'bootstrap-alert': 'bower_components/bootstrap/js/alert',
      'bootstrap-collapse': 'bower_components/bootstrap/js/collapse',
      'bootstrap-dropdown': 'bower_components/bootstrap/js/dropdown',
      'bootstrap-tooltip': 'bower_components/bootstrap/js/tooltip',
      'bootstrap-transition': 'bower_components/bootstrap/js/transition',
      'docs-getting-started': 'GETTING_STARTED.md',
      'docs-learn': 'LEARN.md',
      'docs-contribute': 'CONTRIBUTE.md',
      'domready': 'bower_components/domready/ready',
      'dropzone': 'bower_components/dropzone/downloads/dropzone-amd-module',
      'expect': 'bower_components/expect/index',
      'jqtree': 'bower_components/jqtree/tree.jquery',
      'jquery': 'bower_components/jquery/jquery',
      'jquery.cookie': 'bower_components/jquery.cookie/jquery.cookie',
      'jquery.event.drag': 'lib/jquery.event.drag',
      'jquery.event.drop': 'lib/jquery.event.drop',
      'jquery.form': 'bower_components/jquery-form/jquery.form',
      'marked': 'bower_components/marked/lib/marked',
      'mockup-bundles-barceloneta': 'js/bundles/barceloneta',
      'mockup-bundles-docs': 'js/bundles/docs',
      'mockup-bundles-plone': 'js/bundles/plone',
      'mockup-bundles-structure': 'js/bundles/structure',
      'mockup-bundles-tiles': 'js/bundles/widgets',
      'mockup-bundles-widgets': 'js/bundles/widgets',
      'mockup-docs': 'bower_components/mockup-core/js/docs/app',
      'mockup-docs-navigation': 'bower_components/mockup-core/js/docs/navigation',
      'mockup-docs-page': 'bower_components/mockup-core/js/docs/page',
      'mockup-docs-pattern': 'bower_components/mockup-core/js/docs/pattern',
      'mockup-docs-view': 'bower_components/mockup-core/js/docs/view',
      'mockup-fakeserver': 'tests/fakeserver',
      'mockup-patterns-accessibility': 'js/patterns/accessibility',
      'mockup-patterns-autotoc': 'js/patterns/autotoc',
      'mockup-patterns-backdrop': 'js/patterns/backdrop',
      'mockup-patterns-base': 'bower_components/mockup-core/js/pattern',
      'mockup-patterns-sortable': 'js/patterns/sortable',
      'mockup-patterns-formautofocus': 'js/patterns/formautofocus',
      'mockup-patterns-formunloadalert': 'js/patterns/formunloadalert',
      'mockup-patterns-modal': 'js/patterns/modal',
      'mockup-patterns-moment': 'js/patterns/moment',
      'mockup-patterns-pickadate': 'js/patterns/pickadate',
      'mockup-patterns-preventdoublesubmit': 'js/patterns/preventdoublesubmit',
      'mockup-patterns-querystring': 'js/patterns/querystring',
      'mockup-patterns-relateditems': 'js/patterns/relateditems',
      'mockup-patterns-select2': 'js/patterns/select2',
      'mockup-patterns-structure': 'js/patterns/structure/pattern',
      'mockup-patterns-tablesorter': 'js/patterns/tablesorter',
      'mockup-patterns-tinymce': 'js/patterns/tinymce/pattern',
      'mockup-patterns-toggle': 'js/patterns/toggle',
      'mockup-patterns-tooltip': 'js/patterns/tooltip',
      'mockup-patterns-tree': 'js/patterns/tree',
      'mockup-patterns-upload': 'js/patterns/upload/pattern',
      'mockup-registry': 'bower_components/mockup-core/js/registry',
      'mockup-router': 'js/router',
      'mockup-utils': 'js/utils',
      'mockup-i18n': 'js/i18n',
      'moment': 'bower_components/moment/moment',
      'picker': 'bower_components/pickadate/lib/picker',
      'picker.date': 'bower_components/pickadate/lib/picker.date',
      'picker.time': 'bower_components/pickadate/lib/picker.time',
      'react': 'bower_components/react/react',
      'select2': 'bower_components/select2/select2',
      'sinon': 'bower_components/sinonjs/sinon',
      'text': 'bower_components/requirejs-text/text',
      'tinymce': 'lib/tinymce/tinymce.min',
      'underscore': 'bower_components/lodash/dist/lodash.underscore'
    },
    shim: {
      'JSXTransformer': { exports: 'window.JSXTransformer' },
      'backbone': { exports: 'window.Backbone', deps: ['underscore', 'jquery'] },
      'backbone.paginator': { exports: 'window.Backbone.Paginator', deps: ['backbone'] },
      'bootstrap-alert': { deps: ['jquery'] },
      'bootstrap-collapse': {exports: 'window.jQuery.fn.collapse.Constructor', deps: ['jquery']},
      'bootstrap-dropdown': { deps: ['jquery'] },
      'bootstrap-tooltip': { deps: ['jquery'] },
      'bootstrap-transition': {exports: 'window.jQuery.support.transition', deps: ['jquery']},
      'expect': {exports: 'window.expect'},
      'jqtree': { deps: ['jquery'] },
      'jquery.cookie': { deps: ['jquery'] },
      'jquery.event.drag': { deps: ['jquery'] },
      'jquery.event.drop': {
        deps: ['jquery'],
        exports: '$.drop'
      },
      'mockup-iframe_init': { deps: ['domready'] },
      'picker.date': { deps: [ 'picker' ] },
      'picker.time': { deps: [ 'picker' ] },
      'sinon': {exports: 'window.sinon'},
      'tinymce': { exports: 'window.tinyMCE', init: function () { this.tinyMCE.DOM.events.domLoaded = true; return this.tinyMCE; }},
      'underscore': { exports: 'window._' }
    },
    wrapShim: true
  };

  if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = requirejsOptions;
  }
  if (typeof requirejs !== 'undefined' && requirejs.config) {
    requirejs.config(requirejsOptions);
  }

}());
