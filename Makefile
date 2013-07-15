GIT = git
NPM = npm
GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome`
ifeq ($(UNAME), Linux)
	BOWER_CHROME=`which chromium`
endif

compile:
	$(GRUNT) compile-js
	$(GRUNT) compile-less
	$(GRUNT) compile-css
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static    #
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static    #
	# ----------------------------------------------------------------------- #

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install

jshint:
	$(GRUNT) jshint

test:
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) test

test-ci:
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) test-ci
