module.exports = function(grunt) {

  require('karma-mocha');
  var requirejsOptions = require('./js/config'),
      karmaConfig = require('./node_modules/karma/lib/config'),
      karma_files = [],
      docs_files = {};

  for (var key in requirejsOptions.paths) {
    if (key !== 'tinymce') {
      docs_files['docs/dev/' + requirejsOptions.paths[key] + '.js'] = [requirejsOptions.paths[key] + '.js'];
    }
    karma_files.push({
      pattern: requirejsOptions.paths[key] + '.js',
      included: false
    });
  }

  karma_files.push({pattern: 'tests/example-resource*', included: false});
  karma_files.push({pattern: 'tests/fakeserver*', included: false});
  karma_files.push({pattern: 'tests/*-test.js', included: false});
  karma_files.push({pattern: 'tests/**/*-test.js', included: false});
  karma_files.push({pattern: 'js/ui/**/*.js', included: false});
  karma_files.push({pattern: 'js/ui/**/*.xml', included: false});
  karma_files.push({pattern: 'js/patterns/structure/**/*.js', included: false});
  karma_files.push({pattern: 'js/patterns/structure/**/*.xml', included: false});
  karma_files.push({pattern: 'js/patterns/filemanager/**/*.xml', included: false});
  karma_files.push({pattern: 'js/patterns/filemanager/**/*.js', included: false});
  karma_files.push({pattern: 'js/patterns/tinymce/**/*.xml', included: false});
  karma_files.push({pattern: 'js/patterns/tinymce/**/*.js', included: false});


  karma_files.push('js/config.js');
  karma_files.push('tests/config.js');

  docs_files['docs/dev/bower_components/requirejs/require.js'] = 'bower_components/requirejs/require.js';
  docs_files['docs/dev/js/config.js'] = 'js/config.js';

  requirejsOptions.optimize = 'uglify';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'tests/*.js']
    },
    karma: {
      options: {

        // base path, that will be used to resolve files and exclude
        basePath: './',

        // frameworks to use
        frameworks: ['mocha', 'requirejs'],

        // list of files / patterns to load in the browser
        files: karma_files,

        // list of files to exclude
        exclude: [
          // TODO: we need to fix this tests
          'tests/iframe-test.js',
        ],

        preprocessors: {
          'js/**/*.js': 'coverage'
        },

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['dots', 'progress', 'coverage'],

        coverageReporter: {
          type : 'lcov',
          dir : 'coverage/'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: karmaConfig.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // If browser does not capture in given timeout [ms], kill it
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
      dev: {
        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS']
      },
      dev_once: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      dev_chrome: {
        browsers: ['Chrome'],
        preprocessors: {},
        reporters: ['dots', 'progress'],
        plugins: [
          'karma-mocha',
          'karma-requirejs',
          'karma-sauce-launcher',
          'karma-chrome-launcher',
          'karma-phantomjs-launcher',
          'karma-junit-reporter'
        ]
      },
      ci: {
        singleRun: true,
        browsers: ['sauce_chrome', 'sauce_firefox'],

        reporters: ['junit', 'coverage'],
        junitReporter: {
          outputFile: 'test-results.xml'
        },

        sauceLabs: {
          testName: 'PloneMockup',
          startConnect: true
        },
        customLaunchers: {
          'sauce_chrome': {
             base: 'SauceLabs',
             platform: 'Windows 7',
             browserName: 'chrome',
             version: '31'
           },
          'sauce_firefox': {
             base: 'SauceLabs',
             platform: 'Windows 7',
             browserName: 'firefox',
             version: '25'
           },
           'sauce_ie': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'internet explorer'
           }
        }
      }
    },
    requirejs: {
      options: requirejsOptions,
      // this bundle is used by:
      //    https://pypi.python.org/pypi/plonetheme.barceloneta
      barceloneta: {
        options: {
          name: 'node_modules/almond/almond.js',
          include: 'mockup-bundles-barceloneta',
          insertRequire: ['mockup-bundles-barceloneta'],
          out: 'build/barceloneta.min.js',
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/plone.app.widgets
      widgets: {
        options: {
          name: 'node_modules/almond/almond.js',
          include: 'mockup-bundles-widgets',
          insertRequire: ['mockup-bundles-widgets'],
          out: 'build/widgets.min.js',
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/plone.app.toolbar
      toolbar: {
        options: {
          name: 'node_modules/almond/almond.js',
          include: 'mockup-bundles-toolbar',
          insertRequire: ['mockup-bundles-toolbar'],
          out: 'build/toolbar.min.js'
        }
      },
      // this bundle is used by:
      //    https://pypi.python.org/pypi/wildcard.foldercontents
      structure: {
        options: {
          optimize: 'none',
          name: 'node_modules/almond/almond.js',
          include: 'mockup-bundles-structure',
          insertRequire: ['mockup-bundles-structure'],
          out: 'build/structure.js'
        }
      }
    },
    uglify: {
      barceloneta: {
        files: {
          'build/barceloneta.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/domready/ready.js',
            'js/bundles/barceloneta_develop.js'
           ],
          'build/barceloneta-legacy.js': [
            'bower_components/html5shiv/dist/html5shiv.js',
            'bower_components/respond/dest/respond.matchmedia.addListener.src.js',
            'bower_components/respond/dest/respond.src.js'
           ]
        }
      },
      widgets: {
        files: {
          'build/widgets.js': [
            'node_modules/grunt-contrib-less/node_modules/less/dist/less-1.5.1.js',
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
            'node_modules/grunt-contrib-less/node_modules/less/dist/less-1.5.1.js',
            'bower_components/domready/ready.js',
            'bower_components/requirejs/require.js',
            'bower_components/jquery/jquery.js',
            'js/bundles/toolbar_develop.js'
            ]
        }
      },
      docs: {
        files: docs_files
      }
    },
    less: {
      barceloneta: {
        options: {
          paths: ['less']
        },
        files: {
          'build/barceloneta.css': 'less/barceloneta.less'
        }
      },
      widgets: {
        options: {
          paths: ['less']
        },
        files: {
          'build/widgets.css': 'less/widgets.less'
        }
      },
      toolbar: {
        options: {
          paths: ['less']
        },
        files: {
          'build/toolbar.css': 'less/toolbar.less',
          'build/toolbar_init.css': 'less/iframe_init.less'
        }
      },
      structure: {
        options: {
          paths: ['less']
        },
        files: {
          'build/toolbar.css': 'less/structure.less'
        }
      },
      docs: {
        options: {
          paths: ['less']
        },
        files: {
          'docs/dev/docs.css': 'less/docs.less'
        }
      }
    },
    cssmin: {
      barceloneta: {
        expand: true,
        cwd: 'build/',
        src: ['barceloneta.css'],
        dest: 'build/',
        ext: '.min.css',
        report: 'min'
      },
      widgets: {
        expand: true,
        cwd: 'build/',
        src: ['widgets.css'],
        dest: 'build/',
        ext: '.min.css',
        report: 'min'
      },
      toolbar: {
        expand: true,
        cwd: 'build/',
        src: ['toolbar.css', 'toolbar_init.css'],
        dest: 'build/',
        ext: '.min.css',
        report: 'min'
      },
      structure: {
        expand: true,
        cwd: 'build/',
        src: ['toolbar.css'],
        dest: 'build/',
        ext: '.min.css',
        report: 'min'
      },
      docs: {
        expand: true,
        cwd: 'docs/dev/',
        src: ['docs.css'],
        dest: 'docs/dev/',
        ext: '.min.css',
        report: 'min'
      }
    },
    sed: {
      'bootstrap': {
        path: 'node_modules/lcov-result-merger/index.js',
        pattern: 'throw new Error\\(\'Unknown Prefix ',
        replacement: '//throw// new Error(\'Unknown Prefix '
      },
      'barceloneta-ticks.png': {
        path: 'build/barceloneta.css',
        pattern: 'images/barceloneta-ticks.png',
        replacement: '++resource++plonetheme.barceloneta-ticks.png'
      },
      'barceloneta-bg-watermark.png': {
        path: 'build/barceloneta.css',
        pattern: 'images/barceloneta-bg-watermark.png',
        replacement: '++resource++plonetheme.barceloneta-bg-watermark.png'
      },
      'barceloneta-bg-breadcrumb.png': {
        path: 'build/barceloneta.css',
        pattern: 'images/barceloneta-bg-breadcrumb.png',
        replacement: '++resource++plonetheme.barceloneta-bg-breadcrumb.png'
      },
      'barceloneta-select2png': {
        path: 'build/barceloneta.css',
        pattern: 'select2.png',
        replacement: '++resource++plonetheme.barceloneta-select2.png'
      },
      'barceloneta-select2spinnergif': {
        path: 'build/barceloneta.css',
        pattern: 'select2-spinner.gif',
        replacement: '++resource++plonetheme.barceloneta-select2-spinner.gif'
      },
      'barceloneta-glyphicons': {
        path: 'build/barceloneta.css',
        pattern: '../bower_components/bootstrap/fonts/glyphicons-halflings-regular',
        replacement: '++resource++plonetheme.barceloneta-glyphicons-halflings-regular'
      },
      'barceloneta-tinymce-icomoon': {
        path: 'build/barceloneta.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plonetheme.barceloneta-tinymce-icomoon'
      },
      'barceloneta-dropzone-spritemap': {
        path: 'build/barceloneta.css',
        pattern: 'images/spritemap',
        replacement: '++resource++plonetheme.barceloneta-dropzone-spritemap'
      },
      'widgets-select2png': {
        path: 'build/widgets.css',
        pattern: 'select2.png',
        replacement: '++resource++plone.app.widgets-select2.png'
      },
      'widgets-select2spinnergif': {
        path: 'build/widgets.css',
        pattern: 'select2-spinner.gif',
        replacement: '++resource++plone.app.widgets-select2-spinner.gif'
      },
      'widgets-glyphicons': {
        path: 'build/widgets.css',
        pattern: '../bower_components/bootstrap/fonts/glyphicons-halflings-regular',
        replacement: '++resource++plone.app.widgets-glyphicons-halflings-regular'
      },
      'widgets-tinymce-icomoon': {
        path: 'build/widgets.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plone.app.widgets-tinymce-icomoon'
      },
      'widgets-dropzone-spritemap': {
        path: 'build/widgets.css',
        pattern: 'images/spritemap',
        replacement: '++resource++plone.app.widgets-dropzone-spritemap'
      },
      'toolbar-select2png': {
        path: 'build/toolbar.css',
        pattern: 'select2.png',
        replacement: '++resource++plone.app.toolbar-select2.png'
      },
      'toolbar-select2spinnergif': {
        path: 'build/toolbar.css',
        pattern: 'select2-spinner.gif',
        replacement: '++resource++plone.app.toolbar-select2-spinner.gif'
      },
      'toolbar-glyphicons': {
        path: 'build/toolbar.css',
        pattern: '../bower_components/bootstrap/fonts/glyphicons-halflings-regular',
        replacement: '++resource++plone.app.toolbar-glyphicons-halflings-regular'
      },
      'toolbar-tinymce-icomoon': {
        path: 'build/toolbar.min.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plone.app.toolbar-tinymce-icomoon'
      },
      'toolbar-dropzone-spritemap': {
        path: 'build/toolbar.min.css',
        pattern: 'images/spritemap',
        replacement: '++resource++plone.app.toolbar-dropzone-spritemap'
      },
      'docs-lessjs': {
        path: 'docs/dev/index.html',
        pattern: '<script src="node_modules/grunt-contrib-less/node_modules/less/dist/less-1.4.1.js"></script>',
        replacement: ''
      },
      'docs-docscss': {
        path: 'docs/dev/index.html',
        pattern: '<style type="text/less">@import "less/docs.less";@isBrowser: true;</style>',
        replacement: '<link rel="stylesheet" type="text/css" href="docs.min.css" />'
      },
      'docs-halflings': {
        path: 'docs/dev/docs.min.css',
        pattern: '../img/glyphicons-halflings.png@glyphicons-halflings.png',
        replacement: ''
      },
      'docs-halflings-white': {
        path: 'docs/dev/docs.min.css',
        pattern: '../img/glyphicons-halflings-white.png',
        replacement: 'glyphicons-halflings-white.png'
      },
      'docs-fontawesome': {
        path: 'docs/dev/docs.min.css',
        pattern: '../bower_components/font-awesome/fonts/fontawesome-webfont',
        replacement: 'fontawesome-webfont'
      },
      'docs-icomoon': {
        path: 'docs/dev/docs.min.css',
        pattern: 'fonts/icomoon',
        replacement: 'icomoon'
      },
      'docs-spritemap': {
        path: 'docs/dev/docs.min.css',
        pattern: 'images/spritemap',
        replacement: 'spritemap'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-sed');

  grunt.registerTask('barceloneta-files', '', function() {
    grunt.file.delete('build/barceloneta.css');
    grunt.file.write('build/barceloneta.css', '');

    grunt.file.copy('less/images/barceloneta-apple-touch-icon-114x114-precomposed.png', 'build/barceloneta-apple-touch-icon-114x114-precomposed.png');
    grunt.file.copy('less/images/barceloneta-apple-touch-icon-144x144-precomposed.png', 'build/barceloneta-apple-touch-icon-144x144-precomposed.png');
    grunt.file.copy('less/images/barceloneta-apple-touch-icon-57x57-precomposed.png', 'build/barceloneta-apple-touch-icon-57x57-precomposed.png');
    grunt.file.copy('less/images/barceloneta-apple-touch-icon-72x72-precomposed.png', 'build/barceloneta-apple-touch-icon-72x72-precomposed.png');
    grunt.file.copy('less/images/barceloneta-apple-touch-icon.png', 'build/barceloneta-apple-touch-icon.png');
    grunt.file.copy('less/images/barceloneta-apple-touch-icon-precomposed.png', 'build/barceloneta-apple-touch-icon-precomposed.png');
    grunt.file.copy('less/images/barceloneta-bg-breadcrumb.png', 'build/barceloneta-bg-breadcrumb.png');
    grunt.file.copy('less/images/barceloneta-bg-watermark.png', 'build/barceloneta-bg-watermark.png');
    grunt.file.copy('less/images/barceloneta-favicon.ico', 'build/barceloneta-favicon.ico');
    grunt.file.copy('less/images/barceloneta-ticks.png', 'build/barceloneta-ticks.png');

    grunt.file.copy('less/images/barceloneta-ticks.png', 'less/images/barceloneta-ticks.png');
    grunt.file.copy('less/images/barceloneta-bg-watermark.png', 'less/images/barceloneta-bg-watermark.png');
    grunt.file.copy('less/images/barceloneta-bg-breadcrumb.png', 'less/images/barceloneta-bg-breadcrumb.png');

    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot', 'build/barceloneta-glyphicons-halflings-regular.eot');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg', 'build/barceloneta-glyphicons-halflings-regular.svg');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf', 'build/barceloneta-glyphicons-halflings-regular.ttf');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff', 'build/barceloneta-glyphicons-halflings-regular.woff');

    grunt.file.copy('bower_components/select2/select2.png', 'build/barceloneta-select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'build/barceloneta-select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'build/barceloneta-tinymce-icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'build/barceloneta-tinymce-icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'build/barceloneta-tinymce-icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'build/barceloneta-tinymce-icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'build/barceloneta-tinymce-icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'build/barceloneta-tinymce-icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'build/barceloneta-tinymce-icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'build/barceloneta-tinymce-icomoon-small.ttf');

    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap.png', 'build/barceloneta-dropzone-spritemap.png');
    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap@2x.png', 'build/barceloneta-dropzone-spritemap@2x.png');
  });
  grunt.registerTask('widgets-files', '', function() {
    grunt.file.delete('build/widgets.css');
    grunt.file.write('build/widgets.css', '');

    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot', 'build/widgets-glyphicons-halflings-regular.eot');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg', 'build/widgets-glyphicons-halflings-regular.svg');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf', 'build/widgets-glyphicons-halflings-regular.ttf');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff', 'build/widgets-glyphicons-halflings-regular.woff');

    grunt.file.copy('bower_components/select2/select2.png', 'build/widgets-select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'build/widgets-select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'build/widgets-tinymce-icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'build/widgets-tinymce-icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'build/widgets-tinymce-icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'build/widgets-tinymce-icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'build/widgets-tinymce-icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'build/widgets-tinymce-icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'build/widgets-tinymce-icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'build/widgets-tinymce-icomoon-small.ttf');

    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap.png', 'build/widgets-dropzone-spritemap.png');
    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap@2x.png', 'build/widgets-dropzone-spritemap@2x.png');
  });
  grunt.registerTask('toolbar-files', '', function() {

    grunt.file.delete('build/toolbar.css');
    grunt.file.delete('build/toolbar_init.css');
    grunt.file.write('build/toolbar.css', '');

    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot', 'build/toolbar-glyphicons-halflings-regular.eot');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg', 'build/toolbar-glyphicons-halflings-regular.svg');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf', 'build/toolbar-glyphicons-halflings-regular.ttf');
    grunt.file.copy('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff', 'build/toolbar-glyphicons-halflings-regular.woff');

    grunt.file.copy('bower_components/select2/select2.png', 'build/toolbar-select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'build/toolbar-select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'build/toolbar-tinymce-icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'build/toolbar-tinymce-icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'build/toolbar-tinymce-icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'build/toolbar-tinymce-icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'build/toolbar-tinymce-icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'build/toolbar-tinymce-icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'build/toolbar-tinymce-icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'build/toolbar-tinymce-icomoon-small.ttf');

    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap.png', 'build/toolbar-dropzone-spritemap.png');
    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap@2x.png', 'build/toolbar-dropzone-spritemap@2x.png');
  });
  grunt.registerTask('structure-files', '', function() {
    grunt.file.delete('build/toolbar.css');

    grunt.file.copy('bower_components/bootstrap/img/glyphicons-halflings.png', 'build/toolbar-glyphicons-halflings.png');
    grunt.file.copy('bower_components/bootstrap/img/glyphicons-halflings-white.png', 'build/toolbar-glyphicons-halflings-white.png');

    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.eot', 'build/toolbar-fontawesome-webfont.eot');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.woff', 'build/toolbar-fontawesome-webfont.woff');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.ttf', 'build/toolbar-fontawesome-webfont.ttf');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.svg', 'build/toolbar-fontawesome-webfont.svg');

    grunt.file.copy('bower_components/select2/select2.png', 'build/toolbar-select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'build/toolbar-select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'build/toolbar-icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'build/toolbar-icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'build/toolbar-icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'build/toolbar-icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'build/toolbar-icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'build/toolbar-icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'build/toolbar-icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'build/toolbar-icomoon-small.ttf');

    grunt.file.copy('lib/dropzone/downloads/images/spritemap.png', 'build/toolbar-spritemap.png');
    grunt.file.copy('lib/dropzone/downloads/images/spritemap@2x.png', 'build/toolbar-spritemap@2x.png');
  });
  grunt.registerTask('docs-files', '', function() {
    grunt.file.copy('lib/tinymce/tinymce.min.js', 'docs/dev/lib/tinymce/tinymce.min.js');

    grunt.file.copy('index.html', 'docs/dev/index.html');

    grunt.file.copy('bower_components/select2/select2.png', 'docs/dev/select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'docs/dev/select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'docs/dev/tinymce-icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'docs/dev/tinymce-icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'docs/dev/tinymce-icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'docs/dev/tinymce-icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'docs/dev/tinymce-icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'docs/dev/tinymce-icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'docs/dev/tinymce-icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'docs/dev/tinymce-icomoon-small.ttf');

    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap.png', 'docs/dev/dropzone-spritemap.png');
    grunt.file.copy('bower_components/dropzone/downloads/images/spritemap@2x.png', 'docs/dev/dropzone-spritemap@2x.png');
  });

  grunt.registerTask('compile-barceloneta', [
      'requirejs:barceloneta',
      'uglify:barceloneta',
      'less:barceloneta',
      'sed:barceloneta-ticks.png',
      'sed:barceloneta-bg-watermark.png',
      'sed:barceloneta-bg-breadcrumb.png',
      'sed:barceloneta-glyphicons',
      'sed:barceloneta-select2png',
      'sed:barceloneta-select2spinnergif',
      'sed:barceloneta-tinymce-icomoon',
      'sed:barceloneta-dropzone-spritemap',
      'cssmin:barceloneta',
      'barceloneta-files'
      ]);
  grunt.registerTask('compile-widgets', [
      'requirejs:widgets',
      'uglify:widgets',
      'less:widgets',
      'sed:widgets-glyphicons',
      'sed:widgets-select2png',
      'sed:widgets-select2spinnergif',
      'sed:widgets-tinymce-icomoon',
      'sed:widgets-dropzone-spritemap',
      'cssmin:widgets',
      'widgets-files'
      ]);
  grunt.registerTask('compile-toolbar', [
      'requirejs:toolbar',
      'uglify:toolbar',
      'less:toolbar',
      'sed:toolbar-glyphicons',
      'sed:toolbar-select2png',
      'sed:toolbar-select2spinnergif',
      //'sed:toolbar-tinymce-icomoon',
      //'sed:toolbar-dropzone-spritemap',
      'cssmin:toolbar',
      'toolbar-files'
      ]);
  grunt.registerTask('compile-structure', [
      'requirejs:structure',
      'less:structure',
      'cssmin:structure',
      'structure-files',
      'sed:toolbar-halflings',
      'sed:toolbar-glyphiconswhite',
      'sed:toolbar-fontawesome',
      'sed:toolbar-select2png',
      'sed:toolbar-select2spinnergif',
      'sed:toolbar-icomoon',
      'sed:toolbar-spritemap'
      ]);

  grunt.registerTask('docs', [
      'uglify:docs',
      'less:docs',
      'cssmin:docs',
      'docs-files',
      'sed:docs-lessjs',
      'sed:docs-docscss',
      'sed:docs-halflings',
      'sed:docs-halflings-white',
      'sed:docs-fontawesome',
      'sed:docs-icomoon',
      'sed:docs-spritemap'
      ]);
  grunt.registerTask('dev', [
      'jshint',
      'karma:dev'
      ]);
  grunt.registerTask('dev_once', [
      'jshint',
      'karma:dev_once'
      ]);
  grunt.registerTask('dev_chrome', [
      'karma:dev_chrome'
      ]);
  grunt.registerTask('ci', [
      'jshint',
      'karma:dev_once',
//      'karma:ci',
      'compile-barceloneta',
      'compile-widgets',
      'compile-toolbar',
      'docs'
      ]);

};
