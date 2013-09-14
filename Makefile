GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome chromium chromium-browser | egrep '^/' | head -1`

all: compile jshint test-ci docs

compile: compile-widgets compile-toolbar
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static    #
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static    #
	# ----------------------------------------------------------------------- #

compile-widgets:
	mkdir -p build
	$(GRUNT) compile-widgets

compile-toolbar:
	mkdir -p build
	$(GRUNT) compile-toolbar

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install
	$(GRUNT) sed:bootstrap

jshint:
	$(GRUNT) jshint

test: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:dev --force

test-ci: jshint
	$(GRUNT) karma:ci --force

docs:
	mkdir -p docs/dev/lib/tinymce
	$(GRUNT) docs

clean:
	if test -f $(BOWER); then $(BOWER) cache-clean; fi
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components


.PHONY: compile bootstrap jshint test test-ci docs clean
