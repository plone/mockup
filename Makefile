
GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

all: compile jshint test-ci docs

compile: compile-barceloneta compile-widgets compile-toolbar compile-structure
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static
	# cp build/barceloneta* path/to/plonetheme.barceloneta/plonetheme/barceloneta/static
	# cp build/structure* path/to/wildcard.foldercontents/wildcard/foldercontents/static
	# ----------------------------------------------------------------------- #

compile-barceloneta:
	mkdir -p build
	$(GRUNT) compile-barceloneta

compile-widgets:
	mkdir -p build
	$(GRUNT) compile-widgets

compile-toolbar:
	mkdir -p build
	$(GRUNT) compile-toolbar

compile-structure:
	$(GRUNT) compile-structure

bootstrap: clean
	mkdir -p build
	$(NPM) link --prefix=./node_modules
	$(GRUNT) sed:bootstrap
	$(BOWER) install

jshint:
	NODE_PATH=./node_modules $(GRUNT) jshint

test:
	NODE_PATH=./node_modules $(GRUNT) test --force --pattern=$(pattern)

test-once:
	NODE_PATH=./node_modules $(GRUNT) test_once --force --pattern=$(pattern)

test-dev:
	NODE_PATH=./node_modules $(GRUNT) test_dev --force --pattern=$(pattern)

test-ci:
	NODE_PATH=./node_modules $(GRUNT) test_ci

docs:
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	rm -rf docs/dev
	$(GRUNT) docs

docs-publish: docs
	if [ "$(TRAVIS_BRANCH)" = "master" ]; then echo -e "Starting to update gh-pages\n"; cd docs; ls -la; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed to gh-pages"; git push -fq https://$(GH_TOKEN)@github.com/plone/mockup.git gh-pages > /dev/null; cd ..; fi

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

clean-all: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi

.PHONY: compile bootstrap jshint test test-ci docs clean
