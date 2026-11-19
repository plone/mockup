##############
## Please note
##############

# Every target installs the dependencies first, so there is no need to call
# the package manager yourself:
#
#   make install        Install the dependencies.
#   make serve          Run the demo and documentation server.
#   make serve-webpack  Run only the webpack dev server, e.g. to develop in Plone.
#   make watch          Rebuild the development bundle in dist/ on changes.
#   make build          Build the production bundle into dist/.
#   make watch-plone    Like watch, but write into plone.staticresources.
#   make build-plone    Like build, but write into plone.staticresources.
#   make check          Run eslint and the tests.
#   make docs           Build the documentation.
#
# install, serve, check, eslint and the release targets come from the Makefile
# of @patternslib/dev. See there for more targets and for how to release.

# Settings like a GITHUB_TOKEN for release-it or another PNPM command can be
# defined in a .env file. The base Makefile includes it too, but is not there
# yet for the first install on a fresh checkout.
-include .env
export

PNPM ?= npx pnpm

.DEFAULT_GOAL := install


# Include the base Makefile.
# It is not installed yet on a fresh checkout. Make then creates it with the
# rule below and starts over, so that every target works right away.
-include node_modules/@patternslib/dev/Makefile

node_modules/@patternslib/dev/Makefile:
	$(PNPM) install


.PHONY: build
build: install
	$(PNPM) run build:webpack


.PHONY: watch
watch: install
	$(PNPM) run watch:webpack


# For the Plone targets, plone.staticresources has to be checked out next to
# Mockup.
.PHONY: build-plone
build-plone: install
	$(PNPM) run build:webpack:plone


# The former name of build-plone.
.PHONY: bundle-plone
bundle-plone: build-plone


.PHONY: watch-plone
watch-plone: install
	$(PNPM) run watch:webpack:plone


.PHONY: serve-webpack
serve-webpack: install
	$(PNPM) run start:webpack


.PHONY: docs
docs: install
	$(PNPM) run build:webpack:docs
	$(PNPM) run build:docs


# The bundle for a release, built from a clean state.
# This replaces the recipe of the base Makefile, which would run the `build`
# script and with it build the documentation too.
.PHONY: bundle
bundle: clean-dist bundle-pre install
	$(PNPM) run build:webpack


# Unlink any linked dependencies before building a bundle.
# Also run the base `bundle-pre` from @patternslib/dev
bundle-pre::
	-$(PNPM) unlink --recursive
	$(PNPM) install --force
