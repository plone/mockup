/* RequireJS configuration
 */

/* global module:true */

(function() {
  'use strict';

  var tinymcePlugins = [
    'advlist', 'anchor', 'autolink', 'autoresize', 'autosave', 'bbcode',
    'charmap', 'code', 'colorpicker', 'contextmenu', 'directionality',
    'emoticons', 'fullpage', 'fullscreen', 'hr', 'image', 'importcss',
    'insertdatetime', 'layer', 'legacyoutput', 'link', 'lists', 'media',
    'nonbreaking', 'noneditable', 'pagebreak', 'paste', 'preview', 'print',
    'save', 'searchreplace', 'spellchecker', 'tabfocus', 'table', 'template',
    'textcolor', 'textpattern', 'visualblocks', 'visualchars', 'wordcount'
  ];

  var requirejsOptions = {
    baseUrl: './',
    optimize: 'none',
    paths: {
      'JSXTransformer': 'bower_components/react/JSXTransformer',
      'ace': 'bower_components/ace-builds/src/ace',
      'ace-mode-css': 'bower_components/ace-builds/src/mode-css',
      'ace-mode-javascript': 'bower_components/ace-builds/src/mode-javascript',
      'ace-mode-text': 'bower_components/ace-builds/src/mode-text',
      'ace-theme-monokai': 'bower_components/ace-builds/src/theme-monokai',
      'backbone': 'bower_components/backbone/backbone',
      'backbone.paginator': 'bower_components/backbone.paginator/lib/backbone.paginator',
      'bootstrap-alert': 'bower_components/bootstrap/js/alert',
      'bootstrap-collapse': 'bower_components/bootstrap/js/collapse',
      'bootstrap-dropdown': 'bower_components/bootstrap/js/dropdown',
      'bootstrap-tooltip': 'bower_components/bootstrap/js/tooltip',
      'bootstrap-transition': 'bower_components/bootstrap/js/transition',
      'docs-contribute': 'CONTRIBUTE.md',
      'docs-getting-started': 'GETTING_STARTED.md',
      'docs-learn': 'LEARN.md',
      'dropzone': 'bower_components/dropzone/downloads/dropzone-amd-module',
      'expect': 'bower_components/expect/index',
      'jqtree': 'bower_components/jqtree/tree.jquery',
      'jquery': 'bower_components/jquery/dist/jquery',
      'jquery.cookie': 'bower_components/jquery.cookie/jquery.cookie',
      'jquery.event.drag': 'lib/jquery.event.drag',
      'jquery.event.drop': 'lib/jquery.event.drop',
      'jquery.form': 'bower_components/jquery-form/jquery.form',
      'jquery.sticky-kit': 'lib/jquery.sticky-kit',
      'translate': 'js/i18n-wrapper',
      'marked': 'bower_components/marked/lib/marked',
      'mockup-bundles-docs': 'js/bundles/docs',
      'mockup-bundles-filemanager': 'js/bundles/filemanager',
      'mockup-bundles-plone': 'js/bundles/plone',
      'mockup-bundles-resourceregistry': 'js/bundles/resourceregistry',
      'mockup-bundles-structure': 'js/bundles/structure',
      'mockup-bundles-tiles': 'js/bundles/widgets',
      'mockup-bundles-widgets': 'js/bundles/widgets',
      'mockup-docs': 'bower_components/mockup-core/js/docs/app',
      'mockup-docs-navigation': 'bower_components/mockup-core/js/docs/navigation',
      'mockup-docs-page': 'bower_components/mockup-core/js/docs/page',
      'mockup-docs-pattern': 'bower_components/mockup-core/js/docs/pattern',
      'mockup-docs-view': 'bower_components/mockup-core/js/docs/view',
      'mockup-fakeserver': 'tests/fakeserver',
      'mockup-i18n': 'js/i18n',
      'mockup-patterns-accessibility': 'patterns/accessibility/pattern',
      'mockup-patterns-autotoc': 'patterns/autotoc/pattern',
      'mockup-patterns-backdrop': 'patterns/backdrop/pattern',
      'mockup-patterns-base': 'bower_components/mockup-core/js/pattern',
      'mockup-patterns-cookietrigger': 'patterns/cookietrigger/pattern',
      'mockup-patterns-eventedit': 'patterns/eventedit/pattern',
      'mockup-patterns-filemanager': 'patterns/filemanager/pattern',
      'mockup-patterns-filemanager-url': 'patterns/filemanager',
      'mockup-patterns-formautofocus': 'patterns/formautofocus/pattern',
      'mockup-patterns-formunloadalert': 'patterns/formunloadalert/pattern',
      'mockup-patterns-inlinevalidation': 'patterns/inlinevalidation/pattern',
      'mockup-patterns-markspeciallinks': 'patterns/markspeciallinks/pattern',
      'mockup-patterns-modal': 'patterns/modal/pattern',
      'mockup-patterns-moment': 'patterns/moment/pattern',
      'mockup-patterns-pickadate': 'patterns/pickadate/pattern',
      'mockup-patterns-preventdoublesubmit': 'patterns/preventdoublesubmit/pattern',
      'mockup-patterns-querystring': 'patterns/querystring/pattern',
      'mockup-patterns-relateditems': 'patterns/relateditems/pattern',
      'mockup-patterns-resourceregistry': 'patterns/resourceregistry/pattern',
      'mockup-patterns-resourceregistry-url': 'patterns/resourceregistry',
      'mockup-patterns-select2': 'patterns/select2/pattern',
      'mockup-patterns-sortable': 'patterns/sortable/pattern',
      'mockup-patterns-sticky-kit': 'patterns/sticky-kit/pattern',
      'mockup-patterns-structure': 'patterns/structure/pattern',
      'mockup-patterns-structure-url': 'patterns/structure',
      'mockup-patterns-tablesorter': 'patterns/tablesorter/pattern',
      'mockup-patterns-textareamimetypeselector': 'patterns/textareamimetypeselector/pattern',
      'mockup-patterns-texteditor': 'patterns/texteditor/pattern',
      'mockup-patterns-thememapper': 'patterns/thememapper/pattern',
      'mockup-patterns-thememapper-url': 'patterns/thememapper',
      'mockup-patterns-tinymce': 'patterns/tinymce/pattern',
      'mockup-patterns-tinymce-url': 'patterns/tinymce',
      'mockup-patterns-toggle': 'patterns/toggle/pattern',
      'mockup-patterns-tooltip': 'patterns/tooltip/pattern',
      'mockup-patterns-tree': 'patterns/tree/pattern',
      'mockup-patterns-upload': 'patterns/upload/pattern',
      'mockup-patterns-upload-url': 'patterns/upload',
      'mockup-patterns-passwordstrength': 'patterns/passwordstrength/pattern',
      'mockup-patterns-passwordstrength-url': 'patterns/passwordstrength',
      'mockup-registry': 'bower_components/mockup-core/js/registry',
      'mockup-router': 'js/router',
      'mockup-ui-url': 'js/ui',
      'mockup-utils': 'js/utils',
      'moment': 'bower_components/moment/moment',
      'picker': 'bower_components/pickadate/lib/picker',
      'picker.date': 'bower_components/pickadate/lib/picker.date',
      'picker.time': 'bower_components/pickadate/lib/picker.time',
      'react': 'bower_components/react/react',
      'select2': 'bower_components/select2/select2',
      'sinon': 'bower_components/sinonjs/sinon',
      'text': 'bower_components/requirejs-text/text',
      'tinymce': 'bower_components/tinymce-builded/js/tinymce/tinymce',
      'tinymce-modern-theme': 'bower_components/tinymce-builded/js/tinymce/themes/modern/theme',
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
      'jquery.event.drop': { deps: ['jquery'], exports: '$.drop' },
      'jquery.sticky-kit': { deps: ['jquery'] },
      'picker.date': { deps: [ 'picker' ] },
      'picker.time': { deps: [ 'picker' ] },
      'sinon': {exports: 'window.sinon'},
      'tinymce': { exports: 'window.tinyMCE', init: function () { this.tinyMCE.DOM.events.domLoaded = true; return this.tinyMCE; }},
      'tinymce-modern-theme': { deps: ['tinymce'] },
      'underscore': { exports: 'window._' }
    },
    wrapShim: true
  };
  for(var i=0; i<tinymcePlugins.length; i=i+1){
    var plugin = tinymcePlugins[i];
    requirejsOptions.paths['tinymce-' + plugin] = 'bower_components/tinymce-builded/js/tinymce/plugins/' + plugin + '/plugin';
    requirejsOptions.shim['tinymce-' + plugin] = {
      deps: ['tinymce']
    };
  }

  if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = requirejsOptions;
  }
  if (typeof requirejs !== 'undefined' && requirejs.config) {
    requirejs.config(requirejsOptions);
  }

}());
