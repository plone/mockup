/* global basePath, files, MOCHA, MOCHA_ADAPTER, REQUIRE, REQUIRE_ADAPTER,
 *   preprocessors, exclude, reporters, coverageReporter, port, runnerPort,
 *   colors, logLevel, LOG_INFO, autoWatch, browsers, captureTimeout,
 *   singleRun
 *   */

// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,

  'js/config.js',
  {pattern: 'lib/**/*.js', included: false},
  {pattern: 'bower_components/**/*.js', included: false},
  {pattern: 'js/**/*.js', included: false},
  {pattern: 'tests/example-resource*', included: false},
  {pattern: 'tests/**/*-test.js', included: false},

  'tests/config.js'
];

preprocessors = {
  'js/**/*.js': 'coverage'
};

// list of files to exclude
exclude = [
  // TODO: we need to fix this tests
  'tests/iframe-test.js',
  'tests/pattern-formunloadalert-test.js',
  'tests/pattern-preventdoublesubmit-test.js'
];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress', 'coverage'];
coverageReporter = {
  type : 'html',
  dir : 'coverage/'
};

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
