Plone Mockup is an ongoing effort to modernize Plone's javascript story. Check out examples and documentation at http://plone.github.io/mockup/

The Goals of Mockup
-------------------

1. Standardize configuration of patterns implemented in js
   to use HTML data attributes, so they can be developed
   without running a backend server.
2. Use modern AMD approach to declaring dependencies on other js libs.
3. Full unit testing of js

Install & Run Tests
-------------------
Install Node version 0.10 or greater

    `Install using package manager, e.g. apt or yum
    <https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager>`_

    `Install without using package manager
    <https://github.com/joyent/node/wiki/Installation>`_

Install PhantomJS

    `Download and install PhantomJS
    <http://phantomjs.org/download.html>`_

Maybe use your package manager::

    $ apt-get install phantomjs

Now git clone & build Mockup::

    $ git clone https://github.com/plone/mockup.git
    $ cd mockup
    $ make bootstrap

Run tests with PhantomJS::

    $ make test

Run tests with Chrome::

    $ make test-dev

Generate widgets.pot file in the working directory for Plone translations::

    $ make i18n-dump

If you are currently in the buildout.coredev/src/mockup folder and want to update
the translations in plone.app.locales, first go back in the buildout.coredev
folder, copy widgets.pot in the plone.app.locales package and resync the po files like
this::

    $ cd ../..
    $ cp src/mockup/widgets.pot src/plone.app.locales/plone/app/locales/locales/widgets.pot
    $ bin/buildout -c experimental/i18n.cfg  # to have the bin/i18n command
    $ bin/i18n widgets

If you did some changes in the js files and want to test them live in Plone:

- go to Site Setup -> Resource Registries
- click on the "Development Mode (only logged in users)" checkbox
- click on the "Develop Javascript" button for the plone-editor-tools bundle
  (for folder contents changes, may be another bundle for an other pattern)
- click the "Save" button
- refresh your page (folder contents for example)

To have the js changes in the next Plone release, you need to build the
bundles, see `README of plone.staticresources <https://github.com/plone/plone.staticresources>`_
You may be interested reading `JavaScript For Plone Developers <https://training.plone.org/5/javascript/index.html>`_ and
`Resource Registry <https://docs.plone.org/adapt-and-extend/theming/resourceregistry.html>`_ documentation too.

To test a translation, for example French:

- edit the po file src/plone.app.locales/plone/app/locales/locales/fr/LC_MESSAGES/widgets.po
- restart your instance to rebuild the mo file from the po file
- purge your localStorage and refresh the page to trigger a new download of the translations

The translations are handled by mockup/js/i18n.js that calls the plonejsi18n view defined
in plone.app.content to generate a json of the translations from the mo file.
The plonejsi18n view is called one time for a given domain and language and the result
is cached in localStorage for 24 hours.
The only way to test the new translations is to restart the instance to update the mo file
from the po file, and then to purge the localStorage to trigger a new download of the translations.


License
=======

The BSD 3-Clause License. Copyrights hold the Plone Foundation.
See `LICENSE.rst <LICENSE.rst>`_ for details.


Credits
-------

Originally created by `Rok Garbas <http://garbas.si/>`_ using parts of `Patterns
library <http://patternslib.com/>`_. Now maintained by the `Plone Foundation
<http://plone.org/>`_.


Status of builds
----------------

.. image:: https://travis-ci.org/plone/mockup.png
   :target: https://travis-ci.org/plone/mockup
   :alt: Travis CI

.. image:: https://coveralls.io/repos/plone/mockup/badge.png?branch=master
   :target: https://coveralls.io/r/plone/mockup?branch=master
   :alt: Coveralls

.. image:: https://d2weczhvl823v0.cloudfront.net/plone/mockup/trend.png
   :target: https://bitdeli.com/free
   :alt: Bitdeli
