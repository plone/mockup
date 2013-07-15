var tests = Object.keys(window.__karma__.files).filter(function (file) {
      console.log(file);
      return /\-test\.js$/.test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    // ask Require.js to load these files (all our tests)
    deps: [
      '/base/tests/iframe-test.js',
      '/base/tests/pattern-accessibility-test.js',
      '/base/tests/pattern-autotoc-test.js',
      '/base/tests/pattern-backdrop-test.js',
      '/base/tests/pattern-base-test.js',
      //'/base/tests/pattern-cookiedirective-test.js',
      '/base/tests/pattern-expose-test.js',
      '/base/tests/pattern-formautofocus-test.js',
      //'/base/tests/pattern-formunloadalert-test.js',
      '/base/tests/pattern-livesearch-test.js',
      //'/base/tests/pattern-modal-test.js',
      //'/base/tests/pattern-pickadate-test.js',
      //'/base/tests/pattern-preventdoublesubmit-test.js',
      //'/base/tests/pattern-relateditems-test.js',
      //'/base/tests/pattern-select2-test.js',
      //'/base/tests/pattern-tablesorter-test.js',
      //'/base/tests/pattern-toggle-test.js'
  ],

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
