module.exports = function(grunt) {

  var requirejsOptions = require('./js/config'),
      docs = {};

  for (var key in requirejsOptions.paths) {
    if (key !== 'tinymce') {
      docs['docs/dev/' + requirejsOptions.paths[key] + '.js'] = [requirejsOptions.paths[key] + '.js'];
    }
  }
  docs['docs/dev/bower_components/requirejs/require.js'] = 'bower_components/requirejs/require.js';
  docs['docs/dev/js/config.js'] = 'js/config.js';

  requirejsOptions.optimize = 'none';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'tests/*.js']
    },
    karma: {
      dev: {
        configFile: 'tests/karma.conf.js'
      },
      ci: {
        configFile: 'tests/karma.conf.js',
        singleRun: true,
        reporters: ['dots', 'junit', 'coverage'],
        junitReporter: {
          outputFile: 'test-results.xml'
        },
        coverageReporter: {
          type : 'lcovonly',
          dir : 'coverage/'
        },
        browsers: ['sauce_chrome', 'sauce_firefox'],
        sauceLabs: {
          testName: 'PloneMockup',
          startConnect: true
        },
        customLaunchers: {
          'sauce_chrome': {
             base: 'SauceLabs',
             platform: 'Linux',
             browserName: 'chrome'
           },
          'sauce_firefox': {
             base: 'SauceLabs',
             platform: 'Linux',
             browserName: 'firefox'
           },
           'sauce_ie': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'internet explorer',
             version: '10'
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
        files: docs
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
        pattern: 'throw new Error(\'Unknown Prefix ',
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
        pattern: '<style type="text/less">@import "less/docs.less";@isBrowser\: true;</style>',
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

  grunt.registerTask('compile-widgets', [
      'requirejs:widgets',
      'less:widgets',
      'cssmin:widgets',
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
      'sed:docs-lessjs',
      'sed:docs-docscss',
      'sed:docs-halflings',
      'sed:docs-halflings-white',
      'sed:docs-fontawesome',
      'sed:docs-icomoon',
      'sed:docs-spritemap'
      ]);
  grunt.registerTask('default', ['test-ci', 'compile', 'docs']);

};
