module.exports = function(grunt) {

  var MockupGrunt = require('./js/grunt'),
      requirejsOptions = require('./js/config'),
      mockup = new MockupGrunt(requirejsOptions),
      docsExtraIncludes = [];


  for (var i = 0; i < mockup.patterns.length; i++) {
    docsExtraIncludes.push(mockup.patterns[i]);
    docsExtraIncludes.push('text!' + requirejsOptions.paths[mockup.patterns[i]] + '.js');
  }

  mockup.registerBundle('docs', {
    copy: {
      docs: {
        files: [
          { expand: true, src: 'index.html', dest: 'docs/dev/' }
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
    extraInclude: docsExtraIncludes, 
  }, ['requirejs', 'less', 'copy', 'sed']);

  mockup.registerBundle('structure', {}, {
    url: '++resource++wildcard.foldercontents-structure'
  });

  mockup.registerBundle('plone');

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
    url: '++resource++plonetheme.barceloneta',
    exclude: ['jquery', 'mockup-registry', 'mockup-patterns-base']
  },
  // skip the uglify section; barceloneta has a custom dev loader, since it assumed the presence of the plone bundle
  ['requirejs', 'less', 'copy', 'sed']
  );

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
