Changelog
=========

v1.2.12 - 2014-10-24
--------------------

* Bower updates, except reactjs.
  [thet]

* Cleanup: Remove uglifying config for ``*._develop.js`` files - they are not
  used anymore. Move all NixOS plattform specific ``*.nix`` config files to a
  ``.nix`` subdirectory.
  [thet]

* Don't include Configuration and License section in docs, if they aren't
  defined.
  [thet]

* Fix Makefile for node versions < and >= 0.11.x.
  [petschki, thet]

* Remove licensing and author information from source files.
  Refs https://github.com/plone/mockup/issues/422
  [thet]

* Fix more TinyMCE related paths.
  [thet]

v1.2.11 - 2014-08-13
--------------------

* only jshint in test directory
  [vangheem]

v1.2.10 - 2014-08-13
--------------------

* dependency version upgrades.
  [thet]

v1.2.9 - 2014-08-12
-------------------

* upgrade to jQuery 1.11.1
  [thet]

* fix tests and better karma reporting
  [thet]

v1.2.8 - 2014-08-11
-------------------

* finish removing jscs
  [vangheem]

v1.2.7 - 2014-08-10
-------------------

* correctly generate js min and dev files with maps
  [vangheem]

v1.2.6 - 2014-08-10
-------------------

* fix tests to work with latest mockup
  [vangheem]

* do not use jscs anymore
  [vangheem]


v1.2.4 - 2014-04-19
-------------------

* tinymce icons/font packaging fixed
  [garbas]


v1.2.3 - 2014-03-31
-------------------

* update bower packages:
   - react: 0.8.0 -> 0.10.0


v1.2.2 - 2014-03-31
-------------------

* update Saucelabs browser definitions
  [garbas]

* update bower packages:
   - sinon: 1.8.2 -> 1.9.0


v1.2.1 - 2014-03-30
-------------------

* add selectivizr, a utility that emulates CSS3 pseudo-classes and attribute
  selectors in Internet Explorer 6-8
  [garbas]

* all files in tests/ and js/ folder are now included in karma test runner
  [garbas]

* update node packages:
    - coveralls: 2.8.0 -> 2.10.0
    - grunt: 0.4.3 -> 0.4.4
    - grunt-contrib-jshint: 0.8.0 -> 0.9.2
    - grunt-contrib-less: 0.10.0 -> 0.11.0
    - grunt-jscs-checker: 0.4.0 -> 0.4.1
    - grunt-karma: 0.8.0 -> 0.8.2
    - karma: 0.12.0 -> 0.12.1
    - karma-coverage: 0.2.0 -> 0.2.1
    - karma-mocha: 0.1.1 -> 0.1.3
    - karma-sauce-launcher: 0.2.0 -> 0.2.4
    - mocha: 1.17.1 -> 1.18.2


v1.2.0 - 2014-03-25
-------------------

* karma/lib/config.js now also found when using nix
  [garbas]

* run multiple travis jobs for 2 browsers at the time
  [garbas]

* fixed typo in js/docs/view.js
  [garbas]

* add watcher for less files
  [garbas]

* make sure the router can find the pattern div
  [davisagli]


v1.1.1 - 2014-03-12
-------------------

* jscs linter added
  [garbas]

* fix grunthelper script
  [garbas]


v1.1.0 - 2014-03-12
-------------------

* update to bootstrap 3.1.0
  [garbas]

* move grunt helper script to mockup-core (from mockup) repository
  [garbas]


v1.0.1 - 2014-02-05
-------------------

* if the pattern file uses windows line endings (CRLF) remove the CR so the
  still matches.
  [domruf]

* DocsApp fix for loading patterns. Now it loads pattern as 'text!' using url
  and pattern via requirejs name registered in requirejs paths.
  [garbas]


v1.0.0 - 2014-01-21
-------------------

* Initial release.
  [garbas]
