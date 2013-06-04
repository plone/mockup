The Plone Mockup is a project to modernize Plone's javascripts.

Check out a demo at http://plone.github.io/mockup/

The project tries to achieve several goals:

1. Standardize configuration of patterns implemented in js
   to use HTML data attributes, so they can be developed and
   without running a backend server.
2. Use modern AMD approach to declaring dependencies on other js libs.
3. Full unit testing of js

Here's a list of the javascripts included in Plone and the current
status of converting them to the Mockup approach: https://docs.google.com/spreadsheet/ccc?key=0AiJ1qTbr6NdMdDMzNVVqZ1ZIOGFZWHZDV1BPWnM4OEE#gid=0

Installing for development
--------------------------

See the "Use it now!" section at http://plone.github.io/mockup/

Running the tests
-----------------

run "make tests" to fire up the testem test runner.

Tests are written using the `mocha <http://visionmedia.github.io/mocha/>`_
test framework using `chai <http://chaijs.com/>`_ assertions.
