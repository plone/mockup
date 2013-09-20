// Karma configuration

var requirejsOptions = require('../js/config'),
    files = [];

for (var key in requirejsOptions.paths) {
  files.push({
    pattern: requirejsOptions.paths[key] + '.js',
    included: false
  });
}
files.push({pattern: 'tests/example-resource*', included: false});
files.push({pattern: 'tests/fakeserver*', included: false});
files.push({pattern: 'tests/**/*-test.js', included: false});
files.push({pattern: 'js/patterns/ui/**/*.js', included: false});
files.push({pattern: 'js/patterns/templates/*.html', included: false});
files.push({pattern: 'js/patterns/structure/**/*.js', included: false});
files.push({pattern: 'js/patterns/structure/templates/*.html', included: false});

files.push('js/config.js');
files.push('tests/config.js');

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // frameworks to use
    frameworks: ['mocha', 'requirejs'],

    // list of files / patterns to load in the browser
    files: files,

    // list of files to exclude
    exclude: [
      // TODO: we need to fix this tests
      'tests/iframe-test.js',
      'tests/pattern-formunloadalert-test.js',
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
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    plugins: [
      'karma-mocha',
      'karma-coverage',
      'karma-requirejs',
      'karma-sauce-launcher',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter'
    ]
  });
}
