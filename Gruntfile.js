module.exports = function(grunt) {

  var requirejsOptions = require('./js/config'),
      karmaConfig = require('./node_modules/karma/lib/config'),
      karmaFiles = [],
      patterns = [];

  karmaFiles.push('bower_components/es5-shim/es5-shim.js');
  karmaFiles.push('bower_components/es5-shim/es5-sham.js');
  karmaFiles.push('bower_components/console-polyfill/index.js');
  karmaFiles.push('node_modules/mocha/mocha.js');
  karmaFiles.push('node_modules/karma-mocha/lib/adapter.js');
  karmaFiles.push('node_modules/requirejs/require.js');
  karmaFiles.push('node_modules/karma-requirejs/lib/adapter.js');

  karmaFiles.push('js/config.js');
  karmaFiles.push('tests/config.js');

  for (var key in requirejsOptions.paths) {
    if (key.indexOf('mockup-patterns-') === 0) {
      patterns.push(key);
    }
    karmaFiles.push({
      pattern: requirejsOptions.paths[key] + '.js',
      included: false
    });
  }

  karmaFiles.push({pattern: 'tests/example-resource*', included: false});
  karmaFiles.push({pattern: 'tests/fakeserver*', included: false});
  karmaFiles.push({pattern: 'tests/*-test.js', included: false});
  karmaFiles.push({pattern: 'tests/**/*-test.js', included: false});
  karmaFiles.push({pattern: 'js/ui/**/*.js', included: false});
  karmaFiles.push({pattern: 'js/ui/**/*.xml', included: false});
  karmaFiles.push({pattern: 'js/patterns/structure/**/*.js', included: false});
  karmaFiles.push({pattern: 'js/patterns/structure/**/*.xml', included: false});
  karmaFiles.push({pattern: 'js/patterns/filemanager/**/*.xml', included: false});
  karmaFiles.push({pattern: 'js/patterns/filemanager/**/*.js', included: false});
  karmaFiles.push({pattern: 'js/patterns/tinymce/**/*.xml', included: false});
  karmaFiles.push({pattern: 'js/patterns/tinymce/**/*.js', included: false});

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'tests/*.js']
    },
    karma: {
      options: {
        basePath: './',
        frameworks: [],
        files: karmaFiles,
        // TODO: we need to fix this tests
        exclude: [ 'tests/iframe-test.js' ],
        preprocessors: { 'js/**/*.js': 'coverage' },
        reporters: ['dots', 'progress', 'coverage'],
        coverageReporter: { type : 'lcov', dir : 'coverage/' },
        port: 9876,
        colors: true,
        logLevel: karmaConfig.LOG_INFO,
        autoWatch: true,
        captureTimeout: 60000,
        plugins: [
          'karma-mocha',
          'karma-coverage',
          'karma-requirejs',
          'karma-sauce-launcher',
          'karma-chrome-launcher',
          'karma-phantomjs-launcher',
          'karma-junit-reporter'
        ]
      },
      test: {
        browsers: ['PhantomJS']
      },
      test_once: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      test_dev: {
        browsers: ['Chrome'],
        preprocessors: {},
        reporters: ['dots', 'progress'],
        plugins: [
          'karma-mocha',
          'karma-requirejs',
          'karma-chrome-launcher',
        ]
      },
      test_ci: {
        singleRun: true,
        port: 8080,
        reporters: ['junit', 'coverage', 'saucelabs'],
        junitReporter: { outputFile: 'test-results.xml' },
        sauceLabs: { testName: 'Mockup', startConnect: true },
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
        ],
        customLaunchers: {
          'SL_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome'
          },
          'SL_Firefox': {
            base: 'SauceLabs',
            browserName: 'firefox'
          },
          'SL_Opera': {
            base: 'SauceLabs',
            browserName: 'opera'
          },
          'SL_Safari': {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'Mac 10.8',
            version: '6'
          },
          'SL_IE_8': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '8'
          },
          'SL_IE_9': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 2008',
            version: '9'
          },
          'SL_IE_10': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 2012',
            version: '10'
          },
          'SL_IE_11': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
          },
          'SL_IPhone': {
            base: 'SauceLabs',
            browserName: 'iphone',
            platform: 'OS X 10.8',
            version: '6.1'
          },
          'SL_IPad': {
            base: 'SauceLabs',
            browserName: 'ipad',
            platform: 'OS X 10.8',
            version: '6.1'
          },
          'SL_Android': {
            base: 'SauceLabs',
            browserName: 'android',
            platform: 'Linux',
            version: '4.0'
          }
        }
      }
    },
    requirejs: {
      options: requirejsOptions,
      docs: {
        options: {
          name: 'node_modules/requirejs/require.js',
          include: ['mockup-bundles-docs'].concat(patterns),
          insertRequire: ['mockup-bundles-docs'],
          out: 'docs/dev/docs.js',
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/plone.app.widgets
      barceloneta: {
        options: {
          name: 'node_modules/requirejs/require.js',
          include: 'mockup-bundles-barceloneta',
          insertRequire: ['mockup-bundles-barceloneta'],
          out: 'build/barceloneta.min.js',
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/wildcard.foldercontents
      structure: {
        options: {
          name: 'node_modules/requirejs/require.js',
          include: 'mockup-bundles-structure',
          insertRequire: ['mockup-bundles-structure'],
          out: 'build/structure.min.js'
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/plone.app.widgets
      widgets: {
        options: {
          name: 'node_modules/requirejs/require.js',
          include: 'mockup-bundles-widgets',
          insertRequire: ['mockup-bundles-widgets'],
          out: 'build/widgets.min.js',
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/plone.app.toolbar
      toolbar: {
        options: {
          name: 'node_modules/requirejs/require.js',
          include: 'mockup-bundles-toolbar',
          insertRequire: ['mockup-bundles-toolbar'],
          out: 'build/toolbar.min.js'
        }
      },
    },
    uglify: {
      barceloneta: {
        files: {
          'build/barceloneta.js': [
            'node_modules/grunt-contrib-less/node_modules/less/dist/less-1.6.1.js',
            'bower_components/domready/ready.js',
            'bower_components/requirejs/require.js',
            'bower_components/jquery/jquery.js',
            'js/bundles/barceloneta_develop.js'
           ],
          'build/barceloneta-legacy.js': [
            'bower_components/html5shiv/dist/html5shiv.js',
            'bower_components/respond/dest/respond.matchmedia.addListener.src.js',
            'bower_components/respond/dest/respond.src.js'
           ]
        }
      },
      structure: {
        files: {
          'build/structure.js': [
            'node_modules/grunt-contrib-less/node_modules/less/dist/less-1.5.1.js',
            'bower_components/domready/ready.js',
            'bower_components/requirejs/require.js',
            'bower_components/jquery/jquery.js',
            'js/bundles/structure.js'
           ]
        }
      },
      widgets: {
        files: {
          'build/widgets.js': [
            'node_modules/grunt-contrib-less/node_modules/less/dist/less-1.6.1.js',
            'bower_components/domready/ready.js',
            'bower_components/requirejs/require.js',
            'bower_components/jquery/jquery.js',
            'js/bundles/widgets_develop.js'
           ]
        }
      },
      toolbar: {
        files: {
          'build/toolbar_init.min.js': [
            'bower_components/domready/ready.js',
            'js/iframe_init.js'
          ],
          'build/toolbar.js': [
            'node_modules/grunt-contrib-less/node_modules/less/dist/less-1.6.1.js',
            'bower_components/domready/ready.js',
            'bower_components/requirejs/require.js',
            'bower_components/jquery/jquery.js',
            'js/bundles/toolbar_develop.js'
            ]
        }
      },
    },
    less: {
      options: {
        compress: true,
        cleancss: true,
        ieCompat: true,
        paths: ['less']
      },
      docs: {
        files: {
          'docs/dev/docs.css': 'less/docs.less'
        }
      },
      barceloneta: {
        files: {
          'build/barceloneta.min.css': 'less/barceloneta.less'
        }
      },
      structure: {
        files: {
          'build/structure.min.css': 'less/structure.less'
        }
      },
      widgets: {
        files: {
          'build/widgets.min.css': 'less/widgets.less'
        }
      },
      toolbar: {
        files: {
          'build/toolbar.min.css': 'less/toolbar.less',
          'build/toolbar_init.min.css': 'less/iframe_init.less'
        }
      }
    },
    copy: {
      docs: {
        files: [
          { expand: true, src: 'index.html', dest: 'docs/dev/' },
          { expand: true, src: 'js/patterns/**', dest: 'docs/dev/' },
          { expand: true, cwd: 'bower_components/bootstrap/fonts/', src: 'glyphicons-halflings-regular.*', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'bootstrap-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/fonts/', src: 'icomoon.*', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'tinymce-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/img/', src: 'loader.gif', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'tinymce-' + src; }},
          { expand: true, cwd: 'bower_components/jqtree/', src: 'jqtree-circle.png', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'jqtree-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.png', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'select2-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.gif', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'select2-' + src; }},
          { expand: true, cwd: 'bower_components/dropzone/downloads/images/', src: 'spritemap*', dest: 'docs/dev/',
            rename: function(dest, src) { return dest + 'dropzone-' + src; }}
        ]
      },
      barceloneta: {
        files: [
          { expand: true, cwd: 'less/images/', src: 'barceloneta-*', dest: 'build/' },
          { expand: true, cwd: 'bower_components/bootstrap/fonts/', src: 'glyphicons-halflings-regular.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'barceloneta-bootstrap-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/fonts/', src: 'icomoon.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'barceloneta-tinymce-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/img/', src: 'loader.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'barceloneta-tinymce-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.png', dest: 'build/',
            rename: function(dest, src) { return dest + 'barceloneta-select2-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'barceloneta-select2-' + src; }},
          { expand: true, cwd: 'bower_components/dropzone/downloads/images/', src: 'spritemap*', dest: 'build/',
            rename: function(dest, src) { return dest + 'barceloneta-dropzone-' + src; }}
        ]
      },
      structure: {
        files: [
          { expand: true, cwd: 'bower_components/bootstrap/fonts/', src: 'glyphicons-halflings-regular.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'structure-bootstrap-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/fonts/', src: 'icomoon.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'structure-tinymce-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/img/', src: 'loader.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'structure-tinymce-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.png', dest: 'build/',
            rename: function(dest, src) { return dest + 'structure-select2-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'structure-select2-' + src; }},
          { expand: true, cwd: 'bower_components/dropzone/downloads/images/', src: 'spritemap*', dest: 'build/',
            rename: function(dest, src) { return dest + 'structure-dropzone-' + src; }}
        ]
      },
      widgets: {
        files: [
          { expand: true, cwd: 'bower_components/bootstrap/fonts/', src: 'glyphicons-halflings-regular.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'widgets-bootstrap-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/fonts/', src: 'icomoon.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'widgets-tinymce-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/img/', src: 'loader.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'widgets-tinymce-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.png', dest: 'build/',
            rename: function(dest, src) { return dest + 'widgets-select2-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'widgets-select2-' + src; }},
          { expand: true, cwd: 'bower_components/dropzone/downloads/images/', src: 'spritemap*', dest: 'build/',
            rename: function(dest, src) { return dest + 'widgets-dropzone-' + src; }}
        ]
      },
      toolbar: {
        files: [
          { expand: true, cwd: 'bower_components/bootstrap/fonts/', src: 'glyphicons-halflings-regular.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'toolbar-bootstrap-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/fonts/', src: 'icomoon.*', dest: 'build/',
            rename: function(dest, src) { return dest + 'toolbar-tinymce-' + src; }},
          { expand: true, cwd: 'lib/tinymce/skins/lightgray/img/', src: 'loader.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'toolbar-tinymce-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.png', dest: 'build/',
            rename: function(dest, src) { return dest + 'toolbar-select2-' + src; }},
          { expand: true, cwd: 'bower_components/select2/', src: 'select2*.gif', dest: 'build/',
            rename: function(dest, src) { return dest + 'toolbar-select2-' + src; }},
          { expand: true, cwd: 'bower_components/dropzone/downloads/images/', src: 'spritemap*', dest: 'build/',
            rename: function(dest, src) { return dest + 'toolbar-dropzone-' + src; }}
        ]
      }
    },
    sed: {
      'bootstrap': {
        path: 'node_modules/lcov-result-merger/index.js',
        pattern: 'throw new Error\\(\'Unknown Prefix ',
        replacement: '//throw// new Error(\'Unknown Prefix '
      },

      'docs-css': {
        path: 'docs/dev/index.html',
        pattern: '<style type="text/less">@import "less/docs.less";@isBrowser: true;</style>',
        replacement: '<link rel="stylesheet" type="text/css" href="docs.css" />'
      },
      'docs-js': {
        path: 'docs/dev/index.html',
        pattern: '<script src="node_modules/grunt-contrib-less/node_modules/less/dist/less-1.6.1.js"></script>\n  <script src="node_modules/requirejs/require.js"></script>\n  <script src="js/config.js"></script>\n  <script>require\\(\\[\'mockup-bundles-docs\'\\]\\);</script>',
        replacement: '<script src="docs.js"></script>'
      },
      'docs-legacy-js': {
        path: 'docs/dev/index.html',
        pattern: '<script src="bower_components/es5-shim/es5-shim.js"></script>\n    <script src="bower_components/es5-shim/es5-sham.js"></script>\n    <script src="bower_components/console-polyfill/index.js"></script>',
        replacement: '<script src="docs-legacy.js"></script>'
      },
      'docs-bootstrap-glyphicons': {
        path: 'docs/dev/docs.css',
        pattern: '../fonts/glyphicons-halflings-regular',
        replacement: 'bootstrap-glyphicons-halflings-regular'
      },
      'docs-dropzone-spritemap': {
        path: 'docs/dev/docs.css',
        pattern: '../images/spritemap',
        replacement: 'dropzone-spritemap'
      },
      'docs-select2-images': {
        path: 'docs/dev/docs.css',
        pattern: '\\(\'select2',
        replacement: '(\'select2-select2'
      },
      'docs-tinymce-icomoon': {
        path: 'docs/dev/docs.css',
        pattern: 'fonts/icomoon',
        replacement: 'tinymce-icomoon'
      },
      'docs-tinymce-loader': {
        path: 'docs/dev/docs.css',
        pattern: 'img/loader.gif',
        replacement: 'tinymce-loader.gif'
      },
      'docs-jqtree-circle': {
        path: 'docs/dev/docs.css',
        pattern: 'jqtree-circle.png',
        replacement: 'jqtree-jqtree-circle.png'
      },

      'barceloneta-images': {
        path: 'build/barceloneta.min.css',
        pattern: '\\(\'images/barceloneta-',
        replacement: '\\(\'++resource++plonetheme.barceloneta-'
      },
      'barceloneta-bootstrap-glyphicons': {
        path: 'build/barceloneta.min.css',
        pattern: '../fonts/glyphicons-halflings-regular',
        replacement: 'bootstrap-glyphicons-halflings-regular'
      },
      'barceloneta-dropzone-spritemap': {
        path: 'build/barceloneta.min.css',
        pattern: '../images/spritemap',
        replacement: 'dropzone-spritemap'
      },
      'barceloneta-select2-images': {
        path: 'build/barceloneta.min.css',
        pattern: '\\(\'select2',
        replacement: '(\'select2-select2'
      },
      'barceloneta-tinymce-icomoon': {
        path: 'build/barceloneta.min.css',
        pattern: 'fonts/icomoon',
        replacement: 'tinymce-icomoon'
      },
      'barceloneta-tinymce-loader': {
        path: 'build/barceloneta.min.css',
        pattern: 'img/loader.gif',
        replacement: 'tinymce-loader.gif'
      },

      'structure-bootstrap-glyphicons': {
        path: 'build/structure.min.css',
        pattern: '../fonts/glyphicons-halflings-regular',
        replacement: '++resource++wildcard.foldercontents-bootstrap-glyphicons-halflings-regular'
      },
      'structure-dropzone-spritemap': {
        path: 'build/structure.min.css',
        pattern: '../images/spritemap',
        replacement: '++resource++wildcard.foldercontents-dropzone-spritemap'
      },
      'structure-select2-images': {
        path: 'build/structure.min.css',
        pattern: '\\(\'select2',
        replacement: '(\'++resource++wildcard.foldercontents-select2-select2'
      },
      'structure-tinymce-icomoon': {
        path: 'build/structure.min.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++wildcard.foldercontents-tinymce-icomoon'
      },
      'structure-tinymce-loader': {
        path: 'build/structure.min.css',
        pattern: 'img/loader.gif',
        replacement: '++resource++wildcard.foldercontents-tinymce-loader.gif'
      },

      'widgets-bootstrap-glyphicons': {
        path: 'build/widgets.min.css',
        pattern: '../fonts/glyphicons-halflings-regular',
        replacement: '++resource++plone.app.widgets-bootstrap-glyphicons-halflings-regular'
      },
      'widgets-dropzone-spritemap': {
        path: 'build/widgets.min.css',
        pattern: '../images/spritemap',
        replacement: '++resource++plone.app.widgets-dropzone-spritemap'
      },
      'widgets-select2-images': {
        path: 'build/widgets.min.css',
        pattern: '\\(\'select2',
        replacement: '(\'++resource++plone.app.widgets-select2-select2'
      },
      'widgets-tinymce-icomoon': {
        path: 'build/widgets.min.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plone.app.widgets-tinymce-icomoon'
      },
      'widgets-tinymce-loader': {
        path: 'build/widgets.min.css',
        pattern: 'img/loader.gif',
        replacement: '++resource++plone.app.widgets-tinymce-loader.gif'
      },

      'toolbar-bootstrap-glyphicons': {
        path: 'build/toolbar.min.css',
        pattern: '../fonts/glyphicons-halflings-regular',
        replacement: '++resource++plone.app.toolbar-bootstrap-glyphicons-halflings-regular'
      },
      'toolbar-dropzone-spritemap': {
        path: 'build/toolbar.min.css',
        pattern: '../images/spritemap',
        replacement: '++resource++plone.app.toolbar-dropzone-spritemap'
      },
      'toolbar-select2-images': {
        path: 'build/toolbar.min.css',
        pattern: '\\(\'select2',
        replacement: '(\'++resource++plone.app.toolbar-select2-select2'
      },
      'toolbar-tinymce-icomoon': {
        path: 'build/toolbar.min.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plone.app.toolbar-tinymce-icomoon'
      },
      'toolbar-tinymce-loader': {
        path: 'build/toolbar.min.css',
        pattern: 'img/loader.gif',
        replacement: '++resource++plone.app.toolbar-tinymce-loader.gif'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-sed');


  grunt.registerTask('docs', [
      'requirejs:docs',
      'less:docs',
      'copy:docs',
      'sed:docs-css',
      'sed:docs-js',
      'sed:docs-legacy-js',
      'sed:docs-bootstrap-glyphicons',
      'sed:docs-dropzone-spritemap',
      'sed:docs-select2-images',
      'sed:docs-tinymce-icomoon',
      'sed:docs-tinymce-loader',
      'sed:docs-jqtree-circle'
      ]);

  grunt.registerTask('compile-barceloneta', [
      'requirejs:barceloneta',
      'uglify:barceloneta',
      'less:barceloneta',
      'copy:barceloneta',
      'sed:barceloneta-images',
      'sed:barceloneta-bootstrap-glyphicons',
      'sed:barceloneta-dropzone-spritemap',
      'sed:barceloneta-select2-images',
      'sed:barceloneta-tinymce-icomoon',
      'sed:barceloneta-tinymce-loader'
      ]);

  grunt.registerTask('compile-structure', [
      'requirejs:structure',
      'uglify:structure',
      'less:structure',
      'copy:structure',
      'sed:structure-bootstrap-glyphicons',
      'sed:structure-dropzone-spritemap',
      'sed:structure-select2-images',
      'sed:structure-tinymce-icomoon',
      'sed:structure-tinymce-loader'
      ]);

  grunt.registerTask('compile-widgets', [
      'requirejs:widgets',
      'uglify:widgets',
      'less:widgets',
      'copy:widgets',
      'sed:widgets-bootstrap-glyphicons',
      'sed:widgets-dropzone-spritemap',
      'sed:widgets-select2-images',
      'sed:widgets-tinymce-icomoon',
      'sed:widgets-tinymce-loader'
      ]);

  grunt.registerTask('compile-toolbar', [
      'requirejs:toolbar',
      'uglify:toolbar',
      'less:toolbar',
      'copy:toolbar',
      'sed:toolbar-bootstrap-glyphicons',
      'sed:toolbar-dropzone-spritemap',
      'sed:toolbar-select2-images',
      'sed:toolbar-tinymce-icomoon',
      'sed:toolbar-tinymce-loader'
      ]);


  grunt.registerTask('test', [
      'jshint',
      'karma:test'
      ]);
  grunt.registerTask('test_once', [
      'jshint',
      'karma:test_once'
      ]);
  grunt.registerTask('test_dev', [
      'karma:test_dev'
      ]);
  grunt.registerTask('test_ci', [
      'jshint',
      'karma:test_once',
      'karma:test_ci',
      'compile-barceloneta',
      'compile-widgets',
      'compile-toolbar',
      'docs'
      ]);

};
