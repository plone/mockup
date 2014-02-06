# Why Mockup?

The Mockup project aims to address the lack of encapuslated and tested
javascript in [Plone](http://plone.org) and to remove the need
for a backend development environment to create front-end functionality.

The basic idea is that, when building a new Plone website, javascript features
can be developed and tested, then tied into bundles that integrate the
features with Plone products.

The end result is that a front-end developer might spend their time creating
patterns, while a Plone developer might create a bundle and integrate
it into a Plone product.


# What Is Mockup?

First, `Patterns`, for the purposes of this project, are units of code that
define a single widget or piece of functionality. A *pattern* can depend on
other *patterns*, and can be a bridges to other libraries and frameworks.

`Bundles` are collections of *patterns*, which can contain custom code to help
make integration into a larger project easier.

*Bundles* and *Patterns* are both *JavaScript*, and are defined with
[RequireJS][0], the canonical implementation of the [AMD][1] style of writing
modular javascript.

So, what is `Mockup`? It's a few things:

  1. A framework for creating and testing *patterns* and *bundles*
  2. A collection of common *patterns*
  3. A collection of *bundles* for various (potentially) core Plone products
  4. Scripts to help perform tests and to make and release builds of *bundles*


# Where to start?

The [Getting Started](/#getting-started) page describes how to get Mockup
setup and ready to work with.

Once you've completed that, you may want to look at [the tutorial](/#tutorial),
which covers the creation of a simple pattern and bundle, and goes into more
detail about the structure and operation of the *Mockup Project*.

After getting started, and running through the tutorial, check out the
[Pattern Examples](/#pattern), and, if your interested, how to
[Contribute](/#contribute) to the project!


[0]: http://requirejs.org
[1]: http://en.wikipedia.org/wiki/Asynchronous_module_definition
