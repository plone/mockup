var _ = require('underscore'),
    config = module.exports,
    defaults = {
        rootPath: "../",
        environment: "browser",
        extensions: [ require("buster-coverage"), require("buster-amd") ],
        "buster-coverage": {
          coverageExclusions: ["example-resource"],
          combinedResultsOnly: true
        }
      };


//config['plone.app.toolbar-iframe.js'] = _.extend({}, defaults, {
//  libs:         [],
//  resources:    [ 'test/example-resource.css', 'test/example-resource.js',
//                  'test/example-resource.less' ],
//  testHelpers:  [ 'test/iframe-helpers.js' ],
//  sources:      [ 'js/iframe.js' ],
//  tests:        [ 'test/iframe-test.js' ],
//  extensions:   [ require("buster-coverage") ]
//});

config['plone.app.toolbar-jquery.iframe.js'] = _.extend({}, defaults, {
  libs: [
    'jam/require.js'
  ],
  sources: [
    'jam/jquery/dist/jquery.js',
    'js/patterns.js',
    'js/jquery.iframe.js'
  ],
  tests: [
    'test/jquery.iframe-test.js'
  ]
});

//config['plone.app.toolbar-plone.overlay.js'] = _.extend({}, defaults, {
//  autoRun:  false,
//  libs:     [
//              'jam/jquery/dist/jquery.js',
//              'jam/jquery-form/jquery.form.js',
//              'jam/bootstrap/js/bootstrap-transition.js',
//              'jam/bootstrap/js/bootstrap-modal.js',
//              'js/jquery.iframe.js',
//              'js/patterns.js'
//            ],
//  sources:  [ 'js/plone.overlay.js' ],
//  tests:    [ 'test/plone.overlay-test.js' ]
//});
//
//config['plone.app.toolbar-plone.tabs.js'] = _.extend({}, defaults, {
//  autoRun:  false,
//  libs:     [ 'jam/jquery/dist/jquery.js',
//              'js/patterns.js',
//              'js/pattern.tabs.js'
//            ],
//  sources:  [ 'js/plone.tabs.js' ],
//  tests:    [ 'test/plone.tabs-test.js' ]
//});
