##############
## Please note
##############

# Run `make` or `make help` for the targets you most likely need.
#
# install, serve, check, eslint and the release targets come from the Makefile
# of @patternslib/dev. See there for more targets and for how to release.

# Settings like a GITHUB_TOKEN for release-it or another PNPM command can be
# defined in a .env file. The base Makefile includes it too, but is not there
# yet for the first install on a fresh checkout.
-include .env
export

PNPM ?= npx pnpm

.DEFAULT_GOAL := help


.PHONY: help
help:
	@echo "Usage: make TARGET"
	@echo ""
	@echo "  install        Install the dependencies."
	@echo "  serve          Run the demo and documentation server."
	@echo "  serve-webpack  Run only the webpack dev server, e.g. to develop in Plone."
	@echo "  watch          Rebuild the development bundle in dist/ on changes."
	@echo "  build          Build the production bundle into dist/."
	@echo "  watch-plone    Like watch, but write into plone.staticresources."
	@echo "  build-plone    Like build, but write into plone.staticresources."
	@echo "  check          Run eslint and the tests."
	@echo "  docs           Build the documentation."
	@echo ""
	@echo "Every target installs the dependencies first, so there is no need to"
	@echo "call the package manager yourself."
	@echo ""
	@echo "For more targets, e.g. for a release, see the Makefile and"
	@echo "node_modules/@patternslib/dev/Makefile."


# Include the base Makefile.
# It is not installed yet on a fresh checkout. Make then creates it with the
# rule below and starts over, so that every target works right away. Only
# asking for the help does not install anything.
-include node_modules/@patternslib/dev/Makefile

ifneq ($(filter-out help,$(or $(MAKECMDGOALS),help)),)
node_modules/@patternslib/dev/Makefile:
	$(PNPM) install
endif


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
