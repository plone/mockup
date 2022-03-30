# Plone Mockup

Mockup is the JavaScript stack of the Plone Classic UI.


## Styleguide

- Tab: 4 spaces for everything except for HTML and XML files (2 Spaces) and the Makefile (TAB).
  This rule is defined in the [.editorconfig file](./.editorconfig).


## Commit style guide

We automatically generate the changelog from the commit messages following the [Conventional Commits specification](https://www.conventionalcommits.org/).
Changelog generation is done by the [conventional changelog plugin](https://github.com/release-it/conventional-changelog/) for [release-it](https://github.com/release-it/release-it).
This is enforced via a pre-commit hook managed by [husky](https://github.com/typicode/husky).

### And this is how you use it

We have 4 different types of changelog entries:

- Breaking Changes (type: ``breaking``),
- Features (type: ``feat``),
- Bug Fixes (type: ``fix``),
- Maintenance (type: ``maint``).

We can group commits in the changelog via a scope - or grouping.
Let's follow a convention and use these groupings - but the grouping is optional and any other group name can be used.

- "Dependencies" for upgrading package.json dependencies.
- "Docs" for documentation.
- "Build" for everything related to the release workflow, Webpack and building bundles.
- "Cleanup" for cleaning up or reformatting code.
- "pat PATTERNNAME" for changes to individual patterns in src/pat.
- "core MODULENAME" for changes to core modules in src/core.

A commit message with a changelog-grouping must be structured like so: ``TYPE(GROUP): MESSAGE``.
Without grouping: ``TYPE: MESSAGE``

If the commit message doesn't follow this convention it won't be included in the changelog.
To bypass the pre-commit hook, use the git ``-n`` switch.
Example: ``git commit yarn.lock -m"yarn install." -n``.

If you are working on a component like the structure pattern (pat-structure), use ``pat structure`` as a group.

Examples:

Add a feature to the structure pattern:

```
git commit src/pat/structure -m"feat(pat structure): Add feature to cook some coffee"
```

Cleanup task:

```
git commit -am"maint(Cleanup): Remove whitespace from documentation."

```

or without a grouping:

```
git commit -am"maint: Remove unnecessary file from root directory."
```

---
** Note **

Please keep commits on the ``yarn.lock`` file or any other auto-generated code seperate.

Just commit them seperately with ``git commit yarn.lock -m"yarn install" -n``.

Having them seperately reduces the effort when merging or rebasing branches where a merge conflict can easily happen.
In such cases you can just withdraw your changes on the yarn.lock file or remove those commits and re-install with ``yarn install`` at the end of a successful merge or rebase.

---

## Install

- Have a current version of Node.js installed.

- To install, run: ``make install``.

- To run the demo server, do: ``make serve``.

  This starts up the webpack build process in watch mode.
  Any JavaScript changes are immediately compiled.
  For some changes - like for adding new packages via ``yarn add`` and then using it you might need to restart.
  The command also spins up a development server for our ``11ty`` based documentation and demo pages.
  If you don't need the docs running, you can run ``yarn start:webpack`` or ``npm run start:webpack`` instead, so that only the webpack devserver is running.

- Go to ``http://localhost:8000``:
  On this port our demo and documentation pages are served.

To use the resources directly from webpack-devserver, you have to change the ``plone`` bundle in the resource registry from ``++plone++static/bundle-plone/bundle.min.js`` to ``http://localhost:8000/bundle.min.js``.
Alternatively you can also just run ``yarn watch`` and have the resources recompiled to the ``++plone++static`` directory.

For more commands inspect Makefile and the script part of the package.json.

## Running tests

Run ``make check`` to run all tests including ``eslint`` checks.

To run individual tests, run:

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
