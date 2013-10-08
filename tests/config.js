var tests = Object.keys(window.__karma__.files).filter(function (file) {
    if (window.__karma__.config.args.pattern) {
      return (new RegExp(window.__karma__.config.args.pattern + "-test.js$")).test(file);
    }
    return (/\-test\.js$/).test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});

window.DEBUG = true;
