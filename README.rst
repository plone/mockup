Plone Mockup is an ongoing effort to modernize Plone's javascript story. Check out examples and documentation at http://plone.github.io/mockup/

The Goals of Mockup
-------------------

1. Standardize configuration of patterns implemented in js
   to use HTML data attributes, so they can be developed and
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

    $ make test --chrome

