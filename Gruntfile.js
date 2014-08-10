/* globals module:true */

module.exports = function(grunt) {
  'use strict';

  var MockupGrunt = require('./bower_components/mockup-core/js/grunt'),
      requirejsOptions = require('./js/config'),
      mockup = new MockupGrunt(requirejsOptions),
      docsExtraIncludes = [];


  for (var i = 0; i < mockup.patterns.length; i = i + 1) {
    if (mockup.patterns[i].indexOf('-url') === -1) {
      docsExtraIncludes.push(mockup.patterns[i]);
      docsExtraIncludes.push('text!' + requirejsOptions.paths[mockup.patterns[i]] + '.js');
    }
  }

  mockup.registerBundle('docs', {
    copy: {
      docs: {
        files: [
          { expand: true, src: 'index.html', dest: 'docs/dev/' },
          { expand: true, src: '*.md', dest: 'docs/dev/' },
          { expand: true, src: 'js/**', dest: 'docs/dev/' },
          { expand: true, src: 'tests/**', dest: 'docs/dev/' },
          { expand: true, src: 'lib/**', dest: 'docs/dev/' },
          { expand: true, src: 'bower_components/**', dest: 'docs/dev/' },
          { expand: true, src: 'node_modules/requirejs/require.js', dest: 'docs/dev/' },
          { expand: true, src: 'build/**', dest: 'docs/dev/' },
          { expand: true, src: 'less/**', dest: 'docs/dev/' }
        ]
      }
    },
    sed: {
      'docs-css': {
        path: 'docs/dev/index.html',
        pattern: 'href="docs/dev/docs.min.css"',
        replacement: 'href="docs.min.css"'
      },
      'docs-js': {
        path: 'docs/dev/index.html',
        pattern: '<script src="node_modules/grunt-contrib-less/node_modules/less/dist/less-1.6.1.js"></script>\n  <script src="node_modules/requirejs/require.js"></script>\n  <script src="js/config.js"></script>\n  <script>require\\(\\[\'mockup-bundles-docs\'\\]\\);</script>',
        replacement: '<script src="docs.min.js"></script>'
      },
      'docs-legacy-js': {
        path: 'docs/dev/index.html',
        pattern: '<script src="bower_components/es5-shim/es5-shim.js"></script>\n    <script src="bower_components/es5-shim/es5-sham.js"></script>\n    <script src="bower_components/console-polyfill/index.js"></script>',
        replacement: '<script src="docs-legacy.js"></script>'
      }
    }
  }, {
    path: 'docs/dev/',
    url: 'docs',
    extraInclude: docsExtraIncludes,
  }, ['requirejs', 'less', 'copy', 'sed']);

  mockup.registerBundle('structure', {}, {
    url: '++resource++wildcard.foldercontents-structure'
  });

  mockup.registerBundle('filemanager', {}, {
    url: '++resource++plone.resourceeditor-filemanager'
  });

  mockup.registerBundle('plone', {
    copy: {
      plone: {
        files: [
          { expand: true, cwd: 'less/fonts/', src: 'plone-*', dest: 'build/' }
        ]
      }
    },
    sed: {
      'plone-fonts': {
        path: 'build/plone.min.css',
        pattern: 'url\\(\'fonts/plone-',
        replacement: 'url(\'++resource++plone-'
      }
    }
  }, {
    url: '++resource++plone'
  });

  mockup.registerBundle('widgets');

  mockup.initGrunt(grunt, {
    uglify: {
      barceloneta: {
        files: {
          'build/barceloneta.js': 'js/bundles/barceloneta_develop.js'
        }
      }
    },
    sed: {
      bootstrap: {
        path: 'node_modules/lcov-result-merger/index.js',
        pattern: 'throw new Error\\(\'Unknown Prefix ',
        replacement: '//throw// new Error(\'Unknown Prefix '
      }
    }
  });

};
