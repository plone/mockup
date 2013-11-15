
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
ifdef NIX
	NIX_PATH=${NIX_PATH} nix-build --out-link nixenv dev.nix
	ln -s ./nixenv/lib/node_modules ./
else
	$(NPM) link --prefix=./node_modules
	$(GRUNT) sed:bootstrap
endif
	$(BOWER) install

jshint:
	NODE_PATH=./node_modules $(GRUNT) jshint

test:
	NODE_PATH=./node_modules $(GRUNT) dev --force --pattern=$(pattern)

test-once:
	NODE_PATH=./node_modules $(GRUNT) dev_once --force --pattern=$(pattern)

test-dev:
	NODE_PATH=./node_modules $(GRUNT) dev_chrome --force --pattern=$(pattern)

test-ci:
	NODE_PATH=./node_modules $(GRUNT) ci

docs:
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	rm -rf docs/dev
	mkdir -p docs/dev/lib/tinymce
	$(GRUNT) docs

docs-publish:
	if [ "$TRAVIS_PULL_REQUEST" == "false" ];
	then
		echo -e "Starting to update gh-pages\n"
		cd docs
		ls -la
		git add -fA .
		git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
		git push -fq https://${GH_TOKEN}@github.com/plone/mockup.git gh-pages > /dev/null
		cd ..
	fi

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

clean-all: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi

.PHONY: compile bootstrap jshint test test-ci docs clean
