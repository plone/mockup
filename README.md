Plone Mockup is an ongoing effort to modernize Plone's javascript story. Check out examples and documentation at http://plone.github.io/mockup/

The Goals of Mockup
-------------------

1. Standardize configuration of patterns implemented in js
   to use HTML data attributes, so they can be developed
   without running a backend server.

Developing Mockup Patterns
==========================

    Until we merge into Plone 6.0 branch, you have to use the following plip-file in buildout.coredev to get all packages in there right versions: plips/plip-3211-mockup-redone.cfg

### How to work?

In general they are two ways in working with Mockup:

- working without Plone backend, use and test the patterns inside the docs (faster)
- working with Plone backend and test the patterns in their real environment (slower)

### npm run scripts

We provide some useful npm scripts, you can use to build the bundles and docs.

| script  | description  |
|:--|:--|
| build:webpack:plone | build the bundles with webpack and move the result to plone.staticresources package |
| build:docs | build docs with 11ty |
| build:stats | build stats for webpack-bundle-analyzer |
| build | build bundles with webpack and build docs with 11ty |
| watch:webpack | watch for files changes and run webpack, used when working with docs |
| watch:webpack:plone | watch for files changes and run webpack and move result to plone.staticresources, used when working with Plone backend |
| test | run tests and watch for changes |
| testonce | run test once |
| collect:externaldocs | fetches external docs from patternslib, run this before buildung docs, after updating patternslib |
| start:webpack | start webpack-dev-server for working on patterns without Plone backend |
| start:docs | start 11ty dev server to work on docs (markdown files in mockup) |
| start | run cleanup, webpack- and 11ty-dev-server to develop patterns and mockup docs without Plone backend  |
| webpack-bundle-analyzer | start webpack-bundle-analyzer with existing stats file |
| show:stats | build stats and start webpack-bundle-analyzer, shows bundle size stats in browser |


You can use them either with npm or with yarn:

    npm run watch:webpack:plone

or

    yarn watch:webpack:plone

Using yarn is a bit shorter, but npm provides tab-completion of existing scripts.

For more scripts and details have a look at the scripts section of the package.json file.

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
