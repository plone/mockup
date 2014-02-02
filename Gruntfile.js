module.exports = function(grunt) {

  var MockupGrunt = require('./js/grunt'),
      requirejsOptions = require('./js/config'),
      mockup = new MockupGrunt(requirejsOptions);

  mockup.registerBundle('docs', {
    copy: {
      docs: {
        files: [
          { expand: true, src: 'index.html', dest: 'docs/dev/' },
          { expand: true, src: 'js/patterns/**', dest: 'docs/dev/' }
        ]
      }
    },
    sed: {
      'docs-css': {
        path: 'docs/dev/index.html',
        pattern: '<style type="text/less">@import "less/docs.less";@isBrowser: true;</style>',
        replacement: '<link rel="stylesheet" type="text/css" href="docs.min.css" />'
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
    url: '',
    insertExtraRequires: mockup.patterns
  }, ['requirejs', 'less', 'copy', 'sed']);

  mockup.registerBundle('structure', {}, {
    url: '++resource++wildcard.foldercontents-structure'
  });

  mockup.registerBundle('barceloneta', {
    uglify: {
      barceloneta: {
        files: {
          'build/barceloneta-legacy.js': [
            'bower_components/html5shiv/dist/html5shiv.js',
            'bower_components/respond/dest/respond.matchmedia.addListener.src.js',
            'bower_components/respond/dest/respond.src.js'
           ]
        }
      }
    },
    copy: {
      barceloneta: {
        files: [
          { expand: true, cwd: 'less/images/', src: 'barceloneta-*', dest: 'build/' },
          { expand: true, cwd: 'less/fonts/', src: 'barceloneta-*', dest: 'build/' }
        ]
      }
    },
    sed: {
      'barceloneta-images': {
        path: 'build/barceloneta.min.css',
        pattern: 'url\\(\'images/barceloneta-',
        replacement: 'url(\'++resource++plonetheme.barceloneta-'
      },
      'barceloneta-fonts': {
        path: 'build/barceloneta.min.css',
        pattern: 'url\\(\'fonts/barceloneta-',
        replacement: 'url(\'++resource++plonetheme.barceloneta-'
      }
    }
  }, {
    url: '++resource++plonetheme.barceloneta'
  });

  mockup.registerBundle('widgets');

  mockup.registerBundle('toolbar', {
    uglify: {
      toolbar: {
        files: {
          'build/toolbar_init.min.js': [
            'bower_components/domready/ready.js',
            'js/iframe_init.js'
          ]
        }
      }
    },
    less: {
      toolbar: {
        files: {
          'build/toolbar_init.min.css': 'less/iframe_init.less'
        }
      }
    },
  });

  mockup.initGrunt(grunt, {
    karma: {
      options: {
        exclude: [ 'tests/iframe-test.js' ],
        test_ci: {
          browsers: [
            'SL_Chrome',
            'SL_Firefox',
            //'SL_Opera',
            //'SL_Safari',
            //'SL_IE_8',
            //'SL_IE_9',
            //'SL_IE_10',
            //'SL_IE_11'
            //'SL_IPhone',
            //'SL_IPad',
            //'SL_Android'
          ]
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
