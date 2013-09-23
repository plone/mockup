
NIX_PATH = $(HOME)/.nix-defexpr/channels/
NIX := $(shell which nix-build | egrep '^/' | head -1)
UNAME := $(shell uname)

GIT = git
NPM = npm

ifdef NIX
GRUNT = ./nixenv/bin/grunt
BOWER = ./nixenv/bin/bower
else
GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower
endif

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

bootstrap: clean
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
ifdef NIX
	NIX_PATH=${NIX_PATH} nix-build --out-link nixenv dev.nix
	ln -s ./nixenv/lib/node_modules ./
else
	$(NPM) link --prefix=./node_modules
	sed -i -e "s@throw new Error('Unknown Prefix @//throw// new Error('Unknown Prefix @g" ./node_modules/lcov-result-merger/index.js
	$(GRUNT) sed:bootstrap
endif
	$(BOWER) install

jshint:
	$(GRUNT) jshint

test: jshint
	NODE_PATH=./node_modules $(GRUNT) karma:dev --force

test-chrome: jshint
	NODE_PATH=./node_modules $(GRUNT) karma:dev_chrome --force

test-ci: jshint
	NODE_PATH=./node_modules $(GRUNT) karma:ci --force

docs:
	mkdir -p docs/dev/lib/tinymce
	$(GRUNT) docs

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

clean-all: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi

.PHONY: compile bootstrap jshint test test-ci docs clean
