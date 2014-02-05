# Why Mockup?

The Mockup project aims to address the lack of encapuslated and tested
javascript in the [Plone](http://plone.org) project.

<TODO: text on how mockup removes the need for a specialized plone dev
environment to develop front-end widgets and javascript>



`Patterns` are units of JavaScript, defined by a RequireJS/AMD style module.
Patterns may require other patterns to operate, and may require third party
libraries. Think of patterns as a module -- encapsulated and separate, and
providing a widget or tool to use by other patterns or in html.

`Bundles` are defined similar to <em>Patterns</em> -- they are encapsulated
bits of JavaScript that define requirements for a bundle, and have some extra
code in them that's useful for integrating the required patterns into Plone
products.

So, the end result is that a front-end developer might spend their time
creating patterns, while a Plone developer might create a bundle and integrate
it into a Plone product.

For more information how to create patterns please read [Hello
world](#hello-world) example.




# Slower-start

This will give you a starting point, and a lot of example code. It's used to
build *bundles* which are then added to various Plone products.  You do
not need to develop code for the existing Plone products when you use the
Mockup project.:

    git clone git://github.com/plone/mockup.git

## Step 3: Bootstrap the environment

Run the following commands::

    cd mockup
    make bootstrap

This will use Node/NPM to download and install all the requirements for
building and bundling, as well as all the external libraries needed to build
the patterns developed within the framework of the mockup project.

## Step 4: Get hacking!

### Mockup Project Structure

 * `build/` : All combined, optimized, and minimized JavaScript code, as well
   as compiled less and media are copied and placed here

 * `docs/` : Documentation files built with `make docs`

 * `js/` : This directory contains all of the modularized JavaScript code

    * `js/config.js` : This file contains the RequireJS configuration

    * `js/bundles` : This is where a bundle is defined -- it is a set of
      requirements and code that provide the features being packaged into
      a Plone product

    * `js/patterns` : This is a directory that contains all individual,
      encapsulated patterns (i.e. widgets/JavaScript)

 * `less/` : This directory contains all the [less](http://lesscss.org/) code
   for all the patterns and bundles

 * `lib/` : This directory contains external libraries not necessarily found in
   the bower repositories

 * `tests/` : This directory contains all tests for patterns and bundles,
   including general setup and configuration code

 * `Gruntfile.js` : This file contains the directives for compiling less, and
   combining/optimizing/minimizing JavaScript for the defined bundles

 * `index.html` : This is the main source of documentation for the mockup
   project.

 * `Makefile` :  This is the Makefile used to define what tasks should run when
   you want to build a bundle, or bootstrap the environment

### What's a Pattern? What Are Bundles? How do they relate?


## Step 5: Bundling

To build bundles::

    make bundle

## Step 6: Testing

You can run tests with::

    make test

This will start a continuous process that will rerun the tests when you change
any of the js files.

If you want to run tests on once and then quick::

    make test-once

If you have Chrome installed you can alternatively run your tests with::

    make test-dev

Running tests in Chrome is useful when you want to debug them.

If you want to just run the tests for the pattern you are working on you can
run tests with::

    make test pattern=foobar

or:

    make test-once pattern=foobar

or:

    make test-dev pattern=foobar

These will run only the tests that end with foobar-test.js


