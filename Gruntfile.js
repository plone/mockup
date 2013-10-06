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
  karma_files.push({pattern: 'tests/**/*-test.js', included: false});
  karma_files.push({pattern: 'js/patterns/ui/**/*.js', included: false});
  karma_files.push({pattern: 'js/patterns/ui/**/*.html', included: false});
  karma_files.push({pattern: 'js/patterns/structure/**/*.js', included: false});
  karma_files.push({pattern: 'js/patterns/structure/**/*.tmpl', included: false});
  karma_files.push({pattern: 'js/patterns/filemanager/**/*.tmpl', included: false});
  karma_files.push({pattern: 'js/patterns/filemanager/**/*.js', included: false});
  karma_files.push({pattern: 'js/patterns/tinymce/**/*.tmpl', included: false});
  karma_files.push({pattern: 'js/patterns/tinymce/**/*.js', included: false});


  karma_files.push('js/config.js');
  karma_files.push('tests/config.js');

  docs_files['docs/dev/bower_components/requirejs/require.js'] = 'bower_components/requirejs/require.js';
  docs_files['docs/dev/js/config.js'] = 'js/config.js';

  requirejsOptions.optimize = 'none';

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
          'tests/pattern-preventdoublesubmit-test.js'
        ],

        preprocessors: {
          'js/**/*.js': 'coverage'
        },

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['dots', 'progress', 'coverage'],

        coverageReporter: {
          type : 'html',
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
        browsers: ['sauce_chrome'],

        reporters: ['junit', 'coverage'],
        junitReporter: {
          outputFile: 'test-results.xml'
        },
        coverageReporter: {
          type : 'lcovonly',
          dir : 'coverage/'
        },

        sauceLabs: {
          testName: 'PloneMockup',
          startConnect: true
        },
        customLaunchers: {
          'sauce_chrome': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'chrome'
           },
          'sauce_firefox': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'firefox'
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
      widgets: {
        options: {
          name: 'node_modules/almond/almond.js',
          include: 'mockup-bundles-widgets',
          insertRequire: ['mockup-bundles-widgets'],
          out: 'build/widgets.min.js',
          excludeShallow: ['jquery']
        }
      },
      toolbar: {
        options: {
          name: 'node_modules/almond/almond.js',
          include: 'mockup-bundles-toolbar',
          insertRequire: ['mockup-bundles-toolbar'],
          out: 'build/toolbar.min.js'
        }
      }
    },
    uglify: {
      toolbar: {
        files: {
          'build/toolbar_init.min.js': ['js/iframe_init.js']
        }
      },
      docs: {
        files: docs_files
      }
    },
    less: {
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
      'widgets-fontawesome': {
        path: 'build/widgets.min.css',
        pattern: '../bower_components/font-awesome/font/fontawesome-webfont',
        replacement: '++resource++plone.app.widgets-fontawesome-webfont'
      },
      'widgets-select2png': {
        path: 'build/widgets.min.css',
        pattern: 'select2.png',
        replacement: '++resource++plone.app.widgets-select2.png'
      },
      'widgets-select2spinnergif': {
        path: 'build/widgets.min.css',
        pattern: 'select2-spinner.gif',
        replacement: '++resource++plone.app.widgets-select2-spinner.gif'
      },
      'widgets-icomoon': {
        path: 'build/widgets.min.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plone.app.widgets-icomoon'
      },
      'widgets-spritemap': {
        path: 'build/widgets.min.css',
        pattern: 'images/spritemap',
        replacement: 'spritemap'
      },
      'toolbar-halflings': {
        path: 'build/toolbar.min.css',
        pattern: '../img/glyphicons-halflings.png',
        replacement: '++resource++plone.app.toolbar-glyphicons-halflings.png'
      },
      'toolbar-glyphiconswhite': {
        path: 'build/toolbar.min.css',
        pattern: '../img/glyphicons-halflings-white.png',
        replacement: '++resource++plone.app.toolbar-glyphicons-halflings-white.png'
      },
      'toolbar-fontawesome': {
        path: 'build/toolbar.min.css',
        pattern: '../bower_components/font-awesome/font/fontawesome-webfont',
        replacement: '++resource++plone.app.toolbar-fontawesome-webfont'
      },
      'toolbar-select2png': {
        path: 'build/toolbar.min.css',
        pattern: 'select2.png',
        replacement: '++resource++plone.app.toolbar-select2.png'
      },
      'toolbar-select2spinnergif': {
        path: 'build/toolbar.min.css',
        pattern: 'select2-spinner.gif',
        replacement: '++resource++plone.app.toolbar-select2-spinner.gif'
      },
      'toolbar-icomoon': {
        path: 'build/toolbar.min.css',
        pattern: 'fonts/icomoon',
        replacement: '++resource++plone.app.toolbar-icomoon'
      },
      'toolbar-spritemap': {
        path: 'build/toolbar.min.css',
        pattern: 'images/spritemap',
        replacement: 'spritemap'
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
        pattern: '../bower_components/font-awesome/font/fontawesome-webfont',
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

  grunt.registerTask('widgets-files', '', function() {
    grunt.file.copy('js/bundles/widgets_develop.js', 'build/widgets.js');
    grunt.file.delete('build/widgets.css');
    grunt.file.write('build/widgets.css', '');

    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.eot', 'build/widgets-fontawesome-webfont.eot');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.woff', 'build/widgets-fontawesome-webfont.woff');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.ttf', 'build/widgets-fontawesome-webfont.ttf');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.svg', 'build/widgets-fontawesome-webfont.svg');

    grunt.file.copy('bower_components/select2/select2.png', 'build/widgets-select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'build/widgets-select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'build/widgets-icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'build/widgets-icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'build/widgets-icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'build/widgets-icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'build/widgets-icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'build/widgets-icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'build/widgets-icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'build/widgets-icomoon-small.ttf');

    grunt.file.copy('lib/dropzone/downloads/images/spritemap.png', 'build/widgets-spritemap.png');
    grunt.file.copy('lib/dropzone/downloads/images/spritemap@2x.png', 'build/widgets-spritemap@2x.png');
  });
  grunt.registerTask('toolbar-files', '', function() {
    grunt.file.copy('js/bundles/toolbar_develop.js', 'build/toolbar.js');

    grunt.file.delete('build/toolbar.css');
    grunt.file.delete('build/toolbar_init.css');
    grunt.file.write('build/toolbar.css', '');
    grunt.file.write('build/toolbar_init.css', '');
    grunt.file.write('build/toolbar_init.js', '');

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

    grunt.file.copy('bower_components/bootstrap/img/glyphicons-halflings.png', 'docs/dev/glyphicons-halflings.png');
    grunt.file.copy('bower_components/bootstrap/img/glyphicons-halflings-white.png', 'docs/dev/glyphicons-halflings-white.png');

    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.eot', 'docs/dev/fontawesome-webfont.eot');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.woff', 'docs/dev/fontawesome-webfont.woff');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.ttf', 'docs/dev/fontawesome-webfont.ttf');
    grunt.file.copy('bower_components/font-awesome/font/fontawesome-webfont.svg', 'docs/dev/fontawesome-webfont.svg');

    grunt.file.copy('bower_components/select2/select2.png', 'docs/dev/select2.png');
    grunt.file.copy('bower_components/select2/select2-spinner.gif', 'docs/dev/select2-spinner.gif');

    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.eot', 'docs/dev/icomoon.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.svg', 'docs/dev/icomoon.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.woff', 'docs/dev/icomoon.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon.ttf', 'docs/dev/icomoon.ttf');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.eot', 'docs/dev/icomoon-small.eot');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.svg', 'docs/dev/icomoon-small.svg');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.woff', 'docs/dev/icomoon-small.woff');
    grunt.file.copy('lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf', 'docs/dev/icomoon-small.ttf');
    grunt.file.copy('lib/dropzone/downloads/images/spritemap.png', 'docs/dev/spritemap.png');
    grunt.file.copy('lib/dropzone/downloads/images/spritemap@2x.png', 'docs/dev/spritemap@2x.png');
  });

  grunt.registerTask('compile-widgets', [
      'requirejs:widgets',
      'less:widgets',
      'cssmin:widgets',
      'widgets-files',
      'sed:widgets-fontawesome',
      'sed:widgets-select2png',
      'sed:widgets-select2spinnergif',
      'sed:widgets-icomoon',
      'sed:widgets-spritemap'
      ]);
  grunt.registerTask('compile-toolbar', [
      'requirejs:toolbar',
      'uglify:toolbar',
      'less:toolbar',
      'cssmin:toolbar',
      'toolbar-files',
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
  grunt.registerTask('default', [
      'karma:ci',
      'compile',
      'docs'
      ]);

};
