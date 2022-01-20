# Plone Mockup

Mockup is the JavaScript stack of the Plone Classic UI.


## Install

- Have a current node.js installed.

- Run: ``npx yarn install``:
  We are using yarn instead of npm.
  ``npx`` is for running a npm package command - or downloading and installing it first.
  If yarn is already installed, a ``yarn install`` or just ``yarn`` is enough.

- Run: ``yarn start`` or ``npm run start``:
  This starts up the webpack build process in watch mode.
  Any JavaScript changes are immediately compiled.
  For some changes - like for adding new packages via ``yarn add`` and then using it you might need to restart.
  The command also spins up a development server for our ``11ty`` based documentation and demo pages.
  If you don't need the docs running, you can run ``yarn start:webpack`` or ``npm run start:webpack`` instead, so that only the webpack devserver is running.

- Go to ``http://localhost:8000``:
  On this port our demo and documentation pages are served.

To use the resources directly from webpack-devserver, you have to change the ``plone`` bundle in the resource registry from ``++plone++static/bundle-plone/bundle.min.js`` to ``http://localhost:8000/bundle.min.js``.
Alternatively you can also just run ``yarn watch`` and have the resources recompiled to the ``++plone++static`` directory.

For more commands inspect the script part of the package.json.

## Running tests

You can either install jest with yarn/npm globally or also use it with ``npx jest``

- ``jest``: Run all tests
- ``jest src/pat/PATH-TO-PATTERN``: Run a specific test suite
- ``jest src/pat/PATH-TO-PATTERN -t "Test name"``: Run a specific test matching "Test name" from a specific test suite.
- ``jest --watch``: Run the interactive test runner.


## Debugging tests

The tests are based on jsdom - a library mocking DOM and HTML standards in JavaScript.
No real browsers are involved, which make the tests run really fast.

Still, you can connect to the Chrome debugging interface via:

```
node --inspect-brk node_modules/.bin/jest --runInBand ./src/pat/PATH-TO-PATTERN``
```

Connect in chrome via (You need to click "continue" or "Resume script execution" in the inspector once to proceed):

```
chrome://inspect
```

You can pass Jest any parameter it accepts, like `-t TESTPATTERN`::

```
node --inspect-brk node_modules/.bin/jest --runInBand ./src/pat/PATH-TO-PATTERN -t test.name
```

You can put some ``debugger;`` statements to the code to break the execution and investigate.


## Developing external Packages

If you want to work on ony external package like Patternslib or any external Mockup pattern you can do so by linking those packages into the node_modules folder via ``yarn link``.


1) Check out the external package you want to develop on.

2) Make sure you have installed the dependencies in the development package (e.g. by running ``yarn install``). (TODO: verify that!)

3) Run ``yarn link`` in the external development package to register it with yarn.

4) Run ``yarn link "PACKAGE-NAME"`` in mockup to create the node_modules symlink.


After developing you might want to run ``yarn unlink "PACKAGE-NAME"`` to unlink the development package.


For more information see:

- https://classic.yarnpkg.com/en/docs/cli/link/
- https://classic.yarnpkg.com/en/docs/cli/unlink
- https://docs.npmjs.com/cli/v7/commands/npm-link


**Please note:**: Make sure to unlink and reinstall development pacakges before building a production bundle.
In doubt, remove the node_modules directory and re-install.


## Bundle build analyzation

https://survivejs.com/webpack/optimizing/build-analysis/
https://formidable.com/blog/2018/finding-webpack-duplicates-with-inspectpack-plugin/

Build the stats.json file:

```
npx yarn build:stats
```

Check dependency tree and why which package was included:
https://www.npmjs.com/package/whybundled

```
npx whybundled stats.json
```

Visualize dependency tree and analyze bundle size:
https://www.npmjs.com/package/webpack-bundle-analyzer

```
npx webpack-bundle-analyzer stats.json
```
